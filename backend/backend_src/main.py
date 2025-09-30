from __future__ import annotations

from fastapi import FastAPI, HTTPException, Query, status, Depends, Request
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
import os
from pydantic import BaseModel, ConfigDict
from typing import Dict, Tuple, List, Optional
from sqlalchemy.orm import Session, joinedload
from datetime import datetime
from .db import (
    SessionLocal,
    init_db,
    Post as DBPost,
    Question as DBQuestion,
    DailyTest,
    DailyUserSolved,
    DailyUserFavorite,
    Notice as DBNotice,
    ProgressUser as DBProgressUser,
    engine as DBEngine,
    Comment as DBComment,
    Like as DBLike,
    User,
)
from .auth import get_current_user, get_current_user_optional, require_admin

# Load environment from .env in local/dev scenarios
try:
    from dotenv import load_dotenv  # type: ignore
    load_dotenv()
except Exception:
    pass


app = FastAPI(title="CoreTech API", version="0.1.0")

import os

# CORS for Next.js dev
cors_origins_env = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins_env,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static content (public lessons)
CONTENT_DIR = (Path(__file__).resolve().parent.parent / "content").resolve()
if CONTENT_DIR.exists():
    app.mount("/content", StaticFiles(directory=str(CONTENT_DIR)), name="content")

# --------------------------- 
# Lesson search over markdown files (public)
# --------------------------- 
from time import time
import re

_LESSON_SEARCH_CACHE: Dict[str, Dict[str, str]] | None = None  # key: rel path, value: metadata
_LESSON_SEARCH_BUILT_AT: float = 0.0
_LESSON_SEARCH_TTL_SECONDS = 45.0

def _lesson_index_needs_rebuild() -> bool:
    if _LESSON_SEARCH_CACHE is None:
        return True
    return (time() - _LESSON_SEARCH_BUILT_AT) > _LESSON_SEARCH_TTL_SECONDS

def _read_text(p: Path) -> str:
    try:
        return p.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        try:
            return p.read_text(encoding="utf-8")
        except Exception:
            return ""

def _first_heading(md_text: str) -> str:
    for line in md_text.splitlines():
        s = line.strip()
        if s.startswith("#"):
            return s.lstrip("# ")[:120]
    return ""

def _build_lesson_index():
    global _LESSON_SEARCH_CACHE, _LESSON_SEARCH_BUILT_AT
    root = CONTENT_DIR / "lesson"
    idx: Dict[str, Dict[str, str]] = {}
    if root.exists():
        for sec_dir in sorted(root.glob("*")):
            if not sec_dir.is_dir():
                continue
            section = sec_dir.name  # e.g., 1-1
            for md in sorted(sec_dir.glob("*.md")):
                rel = md.relative_to(root).as_posix()  # e.g., 1-1/3.md
                txt = _read_text(md)
                title = _first_heading(txt) or rel
                plain = txt.lower()
                norm = re.sub(r"[^a-z0-9가-힣]+", "", plain)
                title_plain = title.lower()
                title_norm = re.sub(r"[^a-z0-9가-힣]+", "", title_plain)
                try:
                    idx_num = md.stem  # filename without .md
                except Exception:
                    idx_num = ""
                idx[rel] = {
                    "text": plain,
                    "norm": norm,
                    "title_plain": title_plain,
                    "title_norm": title_norm,
                    "title": title,
                    "section": section,
                    "index": idx_num,
                }
    _LESSON_SEARCH_CACHE = idx
    _LESSON_SEARCH_BUILT_AT = time()


@app.get("/api/v1/lesson-search")
def lesson_search(q: str = Query(..., min_length=1), limit: int = Query(50, ge=1, le=200)):
    """Case-insensitive substring search over lesson markdown files.

    Returns: [{ section, index, title, snippet }]
    """
    try:
        if _lesson_index_needs_rebuild():
            _build_lesson_index()
        assert _LESSON_SEARCH_CACHE is not None
        needle = q.lower().strip()
        norm_needle = re.sub(r"[^a-z0-9가-힣]+", "", needle)
        # tokenize by whitespace, keep non-empty tokens
        tokens = [t for t in re.split(r"\s+", needle) if t]
        # normalize tokens by stripping punctuation; drop tokens that become empty
        norm_tokens = [re.sub(r"[^a-z0-9가-힣]+", "", t) for t in tokens]
        norm_tokens = [t for t in norm_tokens if t]

        results: List[Dict[str, str]] = []
        for rel, meta in _LESSON_SEARCH_CACHE.items():
            text = meta.get("text", "")
            norm = meta.get("norm", "")
            t_plain = meta.get("title_plain", "")
            t_norm = meta.get("title_norm", "")

            hit = False
            # 1) plain substring in title or body
            if needle and (needle in text or needle in t_plain):
                hit = True
            # 2) normalized substring (ignore punctuation/whitespace)
            elif norm_needle and (norm_needle in norm or norm_needle in t_norm):
                hit = True
            # 3) all tokens present (plain)
            elif tokens and all(tok in text for tok in tokens):
                hit = True
            # 4) all tokens present (normalized)
            elif norm_tokens and all(ntok in norm for ntok in norm_tokens):
                hit = True

            if hit:
                # Pick first match position for snippet from plain text
                pos = text.find(needle) if needle else 0
                if pos < 0:
                    pos = text.find(tokens[0]) if tokens else 0
                if pos < 0:
                    pos = 0
                start = max(0, pos - 80)
                end = min(len(text), pos + 120)
                snippet = text[start:end].replace("\n", " ")
                results.append({
                    "section": meta.get("section", ""),
                    "index": meta.get("index", ""),
                    "title": meta.get("title", rel),
                    "snippet": snippet,
                })
                if len(results) >= limit:
                    break
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"search_failed: {type(e).__name__}: {e}")

# Sliding inactivity window: refresh JWT and cookie on each authenticated request
from jose import jwt, JWTError
from datetime import timedelta
from .auth import (
    SECRET_KEY,
    ALGORITHM,
    COOKIE_NAME,
    COOKIE_MAX_AGE_SECONDS,
    COOKIE_SECURE,
    COOKIE_SAMESITE,
    INACTIVITY_EXPIRE_SECONDS,
    create_access_token,
)


@app.middleware("http")
async def sliding_session_middleware(request: Request, call_next):
    # Skip auth endpoints to avoid re-setting cookies on logout/login
    path = request.url.path
    if path.startswith("/api/v1/auth"):
        return await call_next(request)

    response = await call_next(request)
    token = request.cookies.get(COOKIE_NAME)
    if not token:
        return response
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        claims = {k: payload.get(k) for k in ("sub", "username", "id", "role", "is_active") if payload.get(k) is not None}
        if claims and response.status_code < 400:
            fresh = create_access_token(claims, expires_delta=timedelta(seconds=INACTIVITY_EXPIRE_SECONDS))
            response.set_cookie(
                key=COOKIE_NAME,
                value=fresh,
                max_age=COOKIE_MAX_AGE_SECONDS,
                expires=COOKIE_MAX_AGE_SECONDS,
                httponly=True,
                secure=COOKIE_SECURE,
                samesite=COOKIE_SAMESITE,
                path="/",
            )
    except JWTError:
        response.delete_cookie(COOKIE_NAME, path="/")
    return response

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Routers
from .auth import router as auth_router
from .routers import likes_and_comments
from .routers import board as board_router
from .routers import qna as qna_router
from .routers import admin as admin_router
from .routers import notice as notice_router
from .routers import profile as profile_router

app.include_router(auth_router, prefix="/api/v1/auth")
app.include_router(likes_and_comments.router)
app.include_router(board_router.router)
app.include_router(qna_router.router)
app.include_router(admin_router.router, prefix="/api/v1/admin")
app.include_router(notice_router.router)
app.include_router(profile_router.router)

@app.get("/api/v1/hello")
def hello_world():
    return {"message": "Hello from FastAPI!"}

@app.get("/api/v1/auth/verify-token")
def verify_token(current_user: User = Depends(get_current_user)):
    return {"message": "Token is valid", "user_id": current_user.id}


@app.on_event("startup")
def _startup_main():
    # Removed try...except around init_db() to ensure table creation errors are not swallowed
    init_db()
    from .seed import seed_posts, seed_qna
    seed_posts()
    seed_qna()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/health/db")
def health_db():
    """Lightweight DB connectivity check."""
    try:
        with DBEngine.connect() as conn:
            conn.exec_driver_sql("SELECT 1")
        return {"status": "ok", "dialect": DBEngine.dialect.name}
    except Exception as e:
        # Return minimal error info to help diagnose connection issues
        raise HTTPException(status_code=503, detail=f"db_unavailable: {type(e).__name__}: {e}")


# --------------------------- 
# Content (tracks/modules/lessons) - in-memory MVP
# --------------------------- 

class LessonCreate(BaseModel):
    track: str
    module: str
    slug: str
    title: str
    markdown: str


class Lesson(BaseModel):
    track: str
    module: str
    slug: str
    title: str
    markdown: str


_LESSONS: Dict[Tuple[str, str, str], Lesson] = {}


@app.get("/api/v1/content/tracks")
def list_tracks():
    # Minimal static tracks; expand later
    return [
        {"id": "linux", "title": "Linux", "description": "리눅스???습 ?랙"},
        {"id": "network", "title": "Network", "description": "?트?크 기초"},
        {"id": "docker", "title": "Docker", "description": "?커/컨테?너"},
    ]


@app.post("/api/v1/content/lesson", status_code=status.HTTP_201_CREATED)
def create_lesson(payload: LessonCreate):
    key = (payload.track, payload.module, payload.slug)
    lesson = Lesson(**payload.model_dump())
    _LESSONS[key] = lesson
    return {"ok": True, "key": {"track": payload.track, "module": payload.module, "slug": payload.slug}}


@app.get("/api/v1/content/lesson")
def get_lesson(
    track: str = Query(...),
    module: str = Query(...),
    slug: str = Query(...),
):
    key = (track, module, slug)
    lesson = _LESSONS.get(key)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return lesson


@app.get("/api/v1/content/lessons")
def list_lessons(track: str = Query(...), module: str = Query(...)):
    slugs: List[str] = [s for (t, m, s), _ in _LESSONS.items() if t == track and m == module]
    return slugs


# --------------------------- 
# Quiz/Q&A - simple MVP
# --------------------------- 


@app.get("/api/v1/quiz/sample")
def quiz_sample():
    return [
        {"id": "q1", "question": "ls ?션 ????일?", "options": ["-l", "-a", "-t", "-h"], "answer": 1},
        {"id": "q2", "question": "?재 ?렉?리 변?명령?", "options": ["pwd", "mv", "cd", "cp"], "answer": 2},
    ]


class QuizSubmit(BaseModel):
    answers: Dict[str, int]


@app.post("/api/v1/quiz/submit")
def quiz_submit(payload: QuizSubmit):
    sample = {"q1": 1, "q2": 2}
    total = len(sample)
    correct = sum(1 for k, v in payload.answers.items() if k in sample and sample[k] == v)
    return {"total": total, "correct": correct}


class QuestionCreate(BaseModel):
    title: str
    body: str
    tags: List[str] | None = None


class Question(BaseModel):
    id: str
    title: str
    body: str
    tags: List[str] | None = None





# --------------------------- 
# Q&A (DB-backed)
# --------------------------- 

class QnaCreate(BaseModel):
    title: str
    body: str
    tags: Optional[List[str]] = None


class QnaUpdate(BaseModel):
    title: Optional[str] = None
    body: Optional[str] = None
    tags: Optional[List[str]] = None


@app.post("/api/v1/qna/questions", status_code=status.HTTP_201_CREATED)
def create_question(payload: QnaCreate, db: Session = Depends(get_db)):
    q = DBQuestion(
        title=payload.title,
        body=payload.body,
        author_id=0,
        answered=0,
        tags_text=",".join(payload.tags) if payload.tags else None,
    )
    db.add(q)
    db.commit()
    db.refresh(q)
    return {"id": q.id, "title": q.title, "body": q.body, "tags": payload.tags or []}


@app.get("/api/v1/qna/questions")
def list_questions(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(DBQuestion)
    if category and category != 'all':
        if category == 'others':
            query = query.filter(DBQuestion.category.notin_(['server', 'network']))
        else:
            query = query.filter(DBQuestion.category == category)
    
    rows = query.order_by(DBQuestion.created_at.desc()).all()

    def to_dict(r: DBQuestion):
        return {"id": r.id, "title": r.title, "body": r.body, "views": r.views, "likes": likes_count(db, r.id, "question"), "comments_count": comments_count(db, r.id, "question"), "createdAt": r.created_at.isoformat(), "tags": r.tags_text.split(",") if r.tags_text else [], "answered": r.answered}
    return [to_dict(r) for r in rows]

@app.get("/api/v1/qna/tags")
def list_all_tags(db: Session = Depends(get_db)):
    all_tags = set()
    # Add default tags
    all_tags.add("server")
    all_tags.add("network")

    # Get tags from existing questions
    questions = db.query(DBQuestion).all()
    for q in questions:
        if q.tags_text:
            for tag in q.tags_text.split(","):
                all_tags.add(tag.strip())
    
    return sorted(list(all_tags))


@app.get("/api/v1/qna/questions/{qid}")
def get_question(qid: int, db: Session = Depends(get_db)):
    q = db.query(DBQuestion).get(qid)
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")

    comments = db.query(DBComment).filter(DBComment.parent_id == qid, DBComment.parent_type == 'question').all()
    likes = db.query(DBLike).filter(DBLike.parent_id == qid, DBLike.parent_type == 'question').count()

    tags = q.tags_text.split(",") if q.tags_text else []
    # Do not return raw ORM instances in JSON
    comments_data = [
        {
            "id": c.id,
            "content": getattr(c, "content", None),
            "user_id": getattr(c, "user_id", None),
            "created_at": c.created_at.isoformat() if hasattr(c.created_at, "isoformat") else str(c.created_at),
            "parent_id": getattr(c, "parent_id", None),
            "parent_type": getattr(c, "parent_type", None),
        }
        for c in comments
    ]
    return {"id": q.id, "title": q.title, "body": q.body, "tags": tags, "comments": comments_data, "likes": likes, "views": q.views, "category": q.category}


@app.post("/api/v1/qna/questions/{qid}/increment_view")
def increment_question_view(qid: int, db: Session = Depends(get_db)):
    q = db.query(DBQuestion).get(qid)
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    q.views += 1
    db.commit()
    db.refresh(q)
    return {"id": q.id, "views": q.views}


@app.put("/api/v1/qna/questions/{qid}")
def update_question(qid: int, payload: QnaUpdate, db: Session = Depends(get_db)):
    q = db.query(DBQuestion).get(qid)
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    if payload.title is not None:
        q.title = payload.title
    if payload.body is not None:
        q.body = payload.body
    if payload.tags is not None:
        q.tags_text = ",".join(payload.tags)
    db.commit()
    tags = q.tags_text.split(",") if q.tags_text else []
    return {"id": q.id, "title": q.title, "body": q.body, "tags": tags}


@app.delete("/api/v1/qna/questions/{qid}", status_code=status.HTTP_204_NO_CONTENT)
def delete_question(qid: int, db: Session = Depends(get_db)):
    q = db.query(DBQuestion).get(qid)
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    db.delete(q)
    db.commit()
    return


# --------------------------- 
# Board (DB-backed)
# --------------------------- 

class PostCreate(BaseModel):
    title: str
    body: str


@app.post("/api/v1/board/posts", status_code=status.HTTP_201_CREATED)
def create_post(payload: PostCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    p = DBPost(title=payload.title, body=payload.body, user_id=int(current_user.id))
    db.add(p)
    db.commit()
    db.refresh(p)
    return {"id": p.id, "title": p.title, "author": getattr(current_user, "username", None)}


def comments_count(db: Session, parent_id: int, parent_type: str) -> int:
    return db.query(DBComment).filter(DBComment.parent_id == parent_id, DBComment.parent_type == parent_type).count()

def likes_count(db: Session, parent_id: int, parent_type: str) -> int:
    return db.query(DBLike).filter(DBLike.parent_id == parent_id, DBLike.parent_type == parent_type).count()

@app.get("/api/v1/board/posts")
def list_posts(sort: str = "latest", db: Session = Depends(get_db)):
    q = db.query(DBPost).options(joinedload(DBPost.author))
    if sort == "popular":
        q = q.order_by(DBPost.views.desc())
    else:
        q = q.order_by(DBPost.created_at.desc())
    rows = q.limit(50).all()

    result = []
    for r in rows:
        result.append({
            "id": r.id,
            "title": r.title,
            "views": r.views or 0,
            "likes": likes_count(db, r.id, "post"),
            "comments_count": comments_count(db, r.id, "post"),
            "createdAt": r.created_at.isoformat(),
            "author": {
                "id": r.author.id,
                "username": r.author.username
            } if r.author else None
        })

    return result


@app.get("/api/v1/board/posts/{pid}")
def get_post(pid: int, db: Session = Depends(get_db)):
    p = db.query(DBPost).get(pid)
    if not p:
        raise HTTPException(status_code=404, detail="Post not found")

    comments = db.query(DBComment).filter(DBComment.parent_id == pid, DBComment.parent_type == 'post').all()
    likes = db.query(DBLike).filter(DBLike.parent_id == pid, DBLike.parent_type == 'post').count()

    # Resolve author username if available
    author_name = None
    try:
        from .db import User
        u = db.query(User).get(p.author_id) if p.author_id is not None else None
        author_name = u.username if u else None
    except Exception:
        author_name = None
    comments_data = [
        {
            "id": c.id,
            "content": getattr(c, "content", None),
            "user_id": getattr(c, "user_id", None),
            "created_at": c.created_at.isoformat() if hasattr(c.created_at, "isoformat") else str(c.created_at),
            "parent_id": getattr(c, "parent_id", None),
            "parent_type": getattr(c, "parent_type", None),
        }
        for c in comments
    ]
    return {
        "id": p.id,
        "title": p.title,
        "body": p.body,
        "views": p.views, # ?데?트??조회??반환
        "likes": likes,
        "createdAt": p.created_at.isoformat(),
        "author": author_name,
        "comments": comments_data,
    }


@app.post("/api/v1/board/posts/{pid}/increment_view")
def increment_post_view(pid: int, db: Session = Depends(get_db)):
    p = db.query(DBPost).get(pid)
    if not p:
        raise HTTPException(status_code=404, detail="Post not found")
    p.views += 1
    db.commit()
    db.refresh(p)
    return {"id": p.id, "views": p.views}


@app.delete("/api/v1/board/posts/{pid}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(pid: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    p = db.query(DBPost).get(pid)
    if not p:
        raise HTTPException(status_code=404, detail="Post not found")
    if p.author_id is not None and int(p.author_id) != int(getattr(current_user, "id", -1)):
        raise HTTPException(status_code=403, detail="Not allowed to delete this post")
    db.delete(p)
    db.commit()
    return


# --------------------------- 
# Daily Tests (DB-backed)
# --------------------------- 

@app.get("/api/v1/daily/tests")
def daily_list(category: Optional[str] = None, db: Session = Depends(get_db)):
    from sqlalchemy import or_
    q = db.query(DailyTest)
    if category:
        cat = category.lower()
        q = q.filter(or_(DailyTest.category == cat, DailyTest.title.ilike(f"%{cat}%")))
    rows = q.order_by(DailyTest.created_at.desc()).limit(50).all()
    return [
        {"id": r.id, "title": r.title, "category": r.category, "createdAt": r.created_at.isoformat()}
        for r in rows
    ]


@app.get("/api/v1/daily/tests/{tid}")
def daily_detail(tid: int, db: Session = Depends(get_db)):
    row = db.query(DailyTest).get(tid)
    if not row:
        raise HTTPException(status_code=404, detail="Daily test not found")
    import json

    questions = json.loads(row.questions_json)
    redacted = [
        {
            "id": q.get("id"),
            "question": q.get("question"),
            "options": q.get("options"),
            "answer": q.get("answer"),
            "explanation": q.get("explanation"),
        }
        for q in questions
    ]
    return {
        "id": row.id,
        "title": row.title,
        "category": row.category,
        "createdAt": row.created_at.isoformat() if row.created_at else None,
        "questions": redacted,
    }


class DailySubmit(BaseModel):
    answers: Dict[str, int]


@app.post("/api/v1/daily/tests/{tid}/submit")
def daily_submit(tid: int, payload: DailySubmit, db: Session = Depends(get_db), current_user: User | None = Depends(get_current_user_optional)):
    row = db.query(DailyTest).get(tid)
    if not row:
        raise HTTPException(status_code=404, detail="Daily test not found")
    import json

    questions = {q["id"]: q for q in json.loads(row.questions_json)}
    total = len(questions)
    correct = sum(
        1 for qid, ans in payload.answers.items() if qid in questions and questions[qid]["answer"] == ans
    )
    # Record as solved for authenticated user
    try:
        if current_user is not None:
            sid = str(tid)
            exists = (
                db.query(DailyUserSolved)
                .filter(DailyUserSolved.user_id == int(current_user.id), DailyUserSolved.test_id == sid)
                .first()
            )
            if not exists:
                db.add(DailyUserSolved(user_id=int(current_user.id), test_id=sid))
                db.commit()
    except Exception:
        db.rollback()
    return {"total": total, "correct": correct}


# Create/Update/Delete for Daily Tests
class DailyQuestion(BaseModel):
    id: Optional[str] = None
    question: str
    options: List[str]
    answer: int


class DailyCreate(BaseModel):
    title: str
    questions: List[DailyQuestion]
    category: Optional[str] = None


class DailyUpdate(BaseModel):
    title: Optional[str] = None
    questions: Optional[List[DailyQuestion]] = None
    category: Optional[str] = None


@app.post("/api/v1/daily/tests", status_code=status.HTTP_201_CREATED)
def daily_create(payload: DailyCreate, db: Session = Depends(get_db)):
    import json

    # ensure question ids
    for idx, q in enumerate(payload.questions, start=1):
        if not q.id:
            q.id = f"q{idx}"
    cat = (payload.category or "").lower() or None
    row = DailyTest(
        title=payload.title,
        questions_json=json.dumps([q.model_dump() for q in payload.questions]),
        category=cat,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return {"id": row.id, "title": row.title}


@app.put("/api/v1/daily/tests/{tid}")
def daily_update(tid: int, payload: DailyUpdate, db: Session = Depends(get_db)):
    import json

    row = db.query(DailyTest).get(tid)
    if not row:
        raise HTTPException(status_code=404, detail="Daily test not found")
    if payload.title is not None:
        row.title = payload.title
    if payload.questions is not None:
        for idx, q in enumerate(payload.questions, start=1):
            if not q.id:
                q.id = f"q{idx}"
        row.questions_json = json.dumps([q.model_dump() for q in payload.questions])
    if payload.category is not None:
        row.category = (payload.category or "").lower() or None
    db.commit()
    return {"id": row.id, "title": row.title}


@app.delete("/api/v1/daily/tests/{tid}", status_code=status.HTTP_204_NO_CONTENT)
def daily_delete(tid: int, db: Session = Depends(get_db)):
    row = db.query(DailyTest).get(tid)
    if not row:
        raise HTTPException(status_code=404, detail="Daily test not found")
    db.delete(row)
    db.commit()
    return


# --------------------------- 
# Notices (DB-backed)
# --------------------------- 

class NoticeCreate(BaseModel):
    title: str
    body_md: str
    label: Optional[str] = None
    is_pinned: Optional[bool] = False


class NoticeUpdate(BaseModel):
    title: Optional[str] = None
    body_md: Optional[str] = None
    label: Optional[str] = None
    is_pinned: Optional[bool] = None


@app.get("/api/v1/notice")
def notice_list(limit: int = 5, db: Session = Depends(get_db)):
    q = db.query(DBNotice).order_by(DBNotice.is_pinned.desc(), DBNotice.created_at.desc())
    rows = q.limit(max(1, min(50, limit))).all()
    return [
        {
            "id": r.id,
            "title": r.title,
            "label": r.label,
            "author": None,
            "created_at": r.created_at.isoformat() if hasattr(r.created_at, "isoformat") else str(r.created_at),
        }
        for r in rows
    ]


@app.get("/api/v1/notice/{nid}")
def notice_detail(nid: int, db: Session = Depends(get_db)):
    n = db.query(DBNotice).get(nid)
    if not n:
        raise HTTPException(status_code=404, detail="Notice not found")
    return {
        "id": n.id,
        "title": n.title,
        "body_md": n.body_md,
        "label": n.label,
        "is_pinned": bool(n.is_pinned),
        "created_at": n.created_at.isoformat() if hasattr(n.created_at, "isoformat") else str(n.created_at),
        "updated_at": n.updated_at.isoformat() if hasattr(n.updated_at, "isoformat") else str(n.updated_at),
    }


@app.post("/api/v1/notice", status_code=status.HTTP_201_CREATED)
def notice_create(payload: NoticeCreate, db: Session = Depends(get_db)):
    n = DBNotice(
        title=payload.title,
        body_md=payload.body_md,
        label=payload.label,
        is_pinned=bool(payload.is_pinned),
        author_id=0,
    )
    db.add(n)
    db.commit()
    db.refresh(n)
    return {"id": n.id, "title": n.title}


@app.put("/api/v1/notice/{nid}")
def notice_update(nid: int, payload: NoticeUpdate, db: Session = Depends(get_db)):
    n = db.query(DBNotice).get(nid)
    if not n:
        raise HTTPException(status_code=404, detail="Notice not found")
    if payload.title is not None:
        n.title = payload.title
    if payload.body_md is not None:
        n.body_md = payload.body_md
    if payload.label is not None:
        n.label = payload.label
    if payload.is_pinned is not None:
        n.is_pinned = bool(payload.is_pinned)
    db.commit()
    return {"id": n.id, "title": n.title}


@app.delete("/api/v1/notice/{nid}", status_code=status.HTTP_204_NO_CONTENT)
def notice_delete(nid: int, db: Session = Depends(get_db)):
    n = db.query(DBNotice).get(nid)
    if not n:
        raise HTTPException(status_code=404, detail="Notice not found")
    db.delete(n)
    db.commit()
    return


# --------------------------- 
# Daily Progress by category (DB-backed; simple)
# --------------------------- 

@app.get("/api/v1/daily/progress")
def daily_progress(by: str = "category", user_id: int = 0, db: Session = Depends(get_db)):
    if by != "category":
        raise HTTPException(status_code=400, detail="Unsupported grouping")
    # return last recorded percent per category for a user (0..100)
    from sqlalchemy import desc

    rows = (
        db.query(DBProgressUser.category, DBProgressUser.percent, DBProgressUser.created_at)
        .filter(DBProgressUser.user_id == user_id)
        .order_by(DBProgressUser.category.asc(), desc(DBProgressUser.created_at))
        .all()
    )
    latest: dict[str, int] = {}
    for cat, pct, created_at in rows:
        if cat not in latest:
            latest[cat] = int(pct or 0)
    # normalize keys we care about
    result = {k: max(0, min(100, int(v))) for k, v in latest.items()}
    for key in ["linux", "server", "network"]:
        result.setdefault(key, 0)
    return result

# --------------------------- 
# Daily: per-user solved & favorites
# --------------------------- 

class FavoriteToggle(BaseModel):
    favorite: bool


@app.get("/api/v1/daily/user-state")
def daily_user_state(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    solved = (
        db.query(DailyUserSolved.test_id)
        .filter(DailyUserSolved.user_id == int(current_user.id))
        .all()
    )
    favorites = (
        db.query(DailyUserFavorite.test_id)
        .filter(DailyUserFavorite.user_id == int(current_user.id))
        .all()
    )
    return {
        "solved": [t[0] for t in solved],
        "favorites": [t[0] for t in favorites],
    }


@app.post("/api/v1/daily/tests/{tid}/favorite")
def daily_favorite_toggle(tid: str, payload: FavoriteToggle, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    uid = int(current_user.id)
    existing = (
        db.query(DailyUserFavorite)
        .filter(DailyUserFavorite.user_id == uid, DailyUserFavorite.test_id == tid)
        .first()
    )
    try:
        if payload.favorite:
            if not existing:
                db.add(DailyUserFavorite(user_id=uid, test_id=tid))
                db.commit()
        else:
            if existing:
                db.delete(existing)
                db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update favorite")
    return {"test_id": tid, "favorite": payload.favorite}


@app.post("/api/v1/daily/tests/{tid}/solved")
def daily_mark_solved(tid: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    uid = int(current_user.id)
    exists = (
        db.query(DailyUserSolved)
        .filter(DailyUserSolved.user_id == uid, DailyUserSolved.test_id == tid)
        .first()
    )
    try:
        if not exists:
            db.add(DailyUserSolved(user_id=uid, test_id=tid))
            db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to mark solved")
    return {"test_id": tid, "solved": True}


# --------------------------- 
# Daily: import seed data from JSON files (admin)
# --------------------------- 
class ImportDailyPayload(BaseModel):
    path: Optional[str] = None  # Optional override path


@app.post("/api/v1/daily/import")
def daily_import(payload: ImportDailyPayload | None = None, db: Session = Depends(get_db)):
    root = Path(payload.path) if (payload and payload.path) else (Path(__file__).resolve().parent / "data" / "daily")
    if not root.exists() or not root.is_dir():
        raise HTTPException(status_code=400, detail=f"Import path not found: {root}")
    import json
    created = 0
    skipped = 0
    for jf in sorted(root.glob("*.json")):
        try:
            obj = json.loads(jf.read_text(encoding="utf-8"))
            title = obj.get("title")
            category = (obj.get("category") or "").lower() or None
            questions = obj.get("questions") or []
            if not title or not questions:
                skipped += 1
                continue
            exists = db.query(DailyTest).filter(DailyTest.title == title).first()
            if exists:
                skipped += 1
                continue
            # ensure ids
            for idx, q in enumerate(questions, start=1):
                if not q.get("id"):
                    q["id"] = f"q{idx}"
            row = DailyTest(title=title, questions_json=json.dumps(questions), category=category)
            db.add(row)
            db.commit()
            created += 1
        except Exception:
            db.rollback()
            skipped += 1
            continue
    return {"created": created, "skipped": skipped}