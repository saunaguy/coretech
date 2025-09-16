from __future__ import annotations

from fastapi import FastAPI, HTTPException, Query, status, Depends
from fastapi.middleware.cors import CORSMiddleware
import os
from pydantic import BaseModel
from typing import Dict, Tuple, List, Optional
from sqlalchemy.orm import Session
from .db import (
    SessionLocal,
    init_db,
    Post as DBPost,
    Question as DBQuestion,
    DailyTest as DBDailyTest,
    Notice as DBNotice,
    ProgressUser as DBProgressUser,
    engine as DBEngine,
    Comment as DBComment,
    Like as DBLike,
    User,
)
from .auth import get_current_user


app = FastAPI(title="CoreTech API", version="0.1.0")

# CORS for Next.js dev
cors_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
from .auth import router as auth_router
from .routers import likes_and_comments

app.include_router(auth_router, prefix="/api/v1/auth")
app.include_router(likes_and_comments.router)


@app.on_event("startup")
def _startup_main():
    try:
        init_db()
        from .seed import seed_posts
        seed_posts()
        # Seed a test user for local testing (email: test@test.com / password: 1212)
        try:
            from .db import SessionLocal, User
            from .auth import get_password_hash
            db = SessionLocal()
            try:
                u = db.query(User).filter(User.email == "test@test.com").first()
                if not u:
                    u = User(
                        username="test",
                        email="test@test.com",
                        password_hash=get_password_hash("1212"),
                    )
                    db.add(u)
                    db.commit()
                else:
                    # Ensure password matches the requested testing value
                    u.password_hash = get_password_hash("1212")
                    db.commit()
            finally:
                db.close()
        except Exception:
            # seeding test user is best-effort only
            pass
        # seed daily tests from JSON files; dedupe by title so it can run repeatedly
        db = SessionLocal()
        try:
            import json
            from pathlib import Path

            data_dir = Path(__file__).with_name("data") / "daily"
            if data_dir.exists():
                for f in sorted(data_dir.glob("*.json")):
                    try:
                        payload = json.loads(f.read_text(encoding="utf-8"))
                        title = payload.get("title")
                        category = (payload.get("category") or "").lower() or None
                        questions = payload.get("questions") or []
                        if not title or not questions:
                            continue
                        exists = db.query(DBDailyTest).filter(DBDailyTest.title == title).first()
                        if exists:
                            continue
                        row = DBDailyTest(title=title, category=category, questions_json=json.dumps(questions))
                        db.add(row)
                    except Exception:
                        continue
                db.commit()
        finally:
            db.close()
    except Exception:
        # In container, DB may not be ready immediately; compose healthcheck will stabilize
        pass


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
        {"id": "linux", "title": "Linux", "description": "리눅스 학습 트랙"},
        {"id": "network", "title": "Network", "description": "네트워크 기초"},
        {"id": "docker", "title": "Docker", "description": "도커/컨테이너"},
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
        {"id": "q1", "question": "ls 옵션 중 숨김파일?", "options": ["-l", "-a", "-t", "-h"], "answer": 1},
        {"id": "q2", "question": "현재 디렉터리 변경 명령?", "options": ["pwd", "mv", "cd", "cp"], "answer": 2},
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


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


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
def list_questions(db: Session = Depends(get_db)):
    rows = db.query(DBQuestion).order_by(DBQuestion.created_at.desc()).all()
    def to_dict(r: DBQuestion):
        return {"id": r.id, "title": r.title, "body": r.body}
    return [to_dict(r) for r in rows]


@app.get("/api/v1/qna/questions/{qid}")
def get_question(qid: int, db: Session = Depends(get_db)):
    q = db.query(DBQuestion).get(qid)
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")

    comments = db.query(DBComment).filter(DBComment.parent_id == qid, DBComment.parent_type == 'question').all()
    likes = db.query(DBLike).filter(DBLike.parent_id == qid, DBLike.parent_type == 'question').count()

    tags = q.tags_text.split(",") if q.tags_text else []
    return {"id": q.id, "title": q.title, "body": q.body, "tags": tags, "comments": comments, "likes": likes}


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
    p = DBPost(title=payload.title, body=payload.body, author_id=int(current_user.id))
    db.add(p)
    db.commit()
    db.refresh(p)
    return {"id": p.id, "title": p.title, "author": getattr(current_user, "username", None)}


def comments_count(db: Session, post_id: int) -> int:
    return db.query(DBComment).filter(DBComment.parent_id == post_id, DBComment.parent_type == 'post').count()

@app.get("/api/v1/board/posts")
def list_posts(sort: str = "latest", db: Session = Depends(get_db)):
    q = db.query(DBPost)
    if sort == "popular":
        q = q.order_by(DBPost.likes.desc(), DBPost.views.desc())
    else:
        q = q.order_by(DBPost.created_at.desc())
    rows = q.limit(50).all()

    def author_name(author_id: int | None) -> str | None:
        if author_id is None:
            return None
        u = db.query(User).get(author_id)
        return u.username if u else None

    return [
        {
            "id": r.id,
            "title": r.title,
            "views": r.views,
            "likes": r.likes,
            "createdAt": r.created_at.isoformat(),
            "author": author_name(getattr(r, "author_id", None)),
            "comments_count": comments_count(db, r.id),
        }
        for r in rows
    ]


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
    return {
        "id": p.id,
        "title": p.title,
        "body": p.body,
        "views": p.views,
        "likes": likes,
        "createdAt": p.created_at.isoformat(),
        "author": author_name,
        "comments": comments,
    }


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
    q = db.query(DBDailyTest)
    if category:
        cat = category.lower()
        q = q.filter(or_(DBDailyTest.category == cat, DBDailyTest.title.ilike(f"%{cat}%")))
    rows = q.order_by(DBDailyTest.created_at.desc()).limit(50).all()
    return [
        {"id": r.id, "title": r.title, "category": r.category, "createdAt": r.created_at.isoformat()}
        for r in rows
    ]


@app.get("/api/v1/daily/tests/{tid}")
def daily_detail(tid: int, db: Session = Depends(get_db)):
    row = db.query(DBDailyTest).get(tid)
    if not row:
        raise HTTPException(status_code=404, detail="Daily test not found")
    import json

    questions = json.loads(row.questions_json)
    # do not expose answers in detail
    redacted = [
        {"id": q["id"], "question": q["question"], "options": q["options"]}
        for q in questions
    ]
    return {"id": row.id, "title": row.title, "questions": redacted}


class DailySubmit(BaseModel):
    answers: Dict[str, int]


@app.post("/api/v1/daily/tests/{tid}/submit")
def daily_submit(tid: int, payload: DailySubmit, db: Session = Depends(get_db)):
    row = db.query(DBDailyTest).get(tid)
    if not row:
        raise HTTPException(status_code=404, detail="Daily test not found")
    import json

    questions = {q["id"]: q for q in json.loads(row.questions_json)}
    total = len(questions)
    correct = sum(
        1 for qid, ans in payload.answers.items() if qid in questions and questions[qid]["answer"] == ans
    )
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
    row = DBDailyTest(
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

    row = db.query(DBDailyTest).get(tid)
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
    row = db.query(DBDailyTest).get(tid)
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
