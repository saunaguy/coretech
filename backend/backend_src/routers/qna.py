from sqlalchemy.orm import Session, joinedload, subqueryload
from typing import List, Literal
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from ..db import SessionLocal, Question, User, Comment
from ..auth import get_current_user
from ..schemas.qna_schema import QuestionResponse, QuestionListResponse # Import QuestionResponse and QuestionListResponse

router = APIRouter(tags=["qna"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class QuestionCreate(BaseModel):
    title: str
    body: str
    tags: List[str] | None = None
    category: Literal["server", "network", "others"] | None = None


class QuestionUpdate(BaseModel):
    title: str | None = None
    body: str | None = None
    tags: List[str] | None = None
    category: Literal["server", "network", "others"] | None = None


@router.post("/api/v1/qna/questions", status_code=status.HTTP_201_CREATED)
def create_question(payload: QuestionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not payload.title.strip() or not payload.body.strip():
        raise HTTPException(status_code=400, detail="제목과 내용은 필수입니다.")
    tags_text = ",".join(payload.tags or [])
    category = (payload.category or "others").lower()
    if category not in ("server", "network", "others"):
        raise HTTPException(status_code=400, detail="invalid category")
    q = Question(
        title=payload.title.strip(),
        body=payload.body.strip(),
        author_id=current_user.id,
        tags_text=tags_text,
        category=category,
    )
    db.add(q)
    db.commit()
    db.refresh(q)
    return {
        "id": q.id,
        "title": q.title,
        "body": q.body,
        "views": q.views,
        "answered": bool(getattr(q, "answered", 0)),
        "created_at": q.created_at,
        "createdAt": q.created_at.isoformat() if q.created_at else None,
        "tags": [t for t in (q.tags_text or "").split(",") if t],
        "author": {"id": current_user.id, "username": current_user.username},
        "category": q.category,
    }


@router.get("/api/v1/qna/questions", response_model=List[QuestionListResponse])
def list_questions(
    sort: str = Query("latest", enum=["latest", "views"]),
    category: str | None = Query(None, description="server|network|others"),
    status: str | None = Query(None, description="waiting|done"),
    db: Session = Depends(get_db),
):
    q = db.query(Question).options(joinedload(Question.author))
    if category:
        q = q.filter(Question.category == category)
    if status == "waiting":
        q = q.filter(Question.answered == 0)
    elif status == "done":
        q = q.filter(Question.answered != 0)
    if sort == "views":
        q = q.order_by(Question.views.desc())
    else:
        q = q.order_by(Question.created_at.desc())
    rows = q.all()
    return rows


@router.get("/api/v1/qna/questions/{question_id}", response_model=QuestionResponse)
def get_question(question_id: int, db: Session = Depends(get_db)):
    q = db.query(Question).options(joinedload(Question.author), subqueryload(Question.comments).joinedload(Comment.user)).filter(Question.id == question_id).first()


class QuestionStatusUpdate(BaseModel):
    answered: bool


@router.patch("/api/v1/qna/questions/{question_id}/status", status_code=status.HTTP_200_OK)
def update_question_status(
    question_id: int,
    payload: QuestionStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(Question).filter(Question.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    # author or admin only
    if current_user.id != q.author_id and getattr(current_user, "role", "user") != "admin":
        raise HTTPException(status_code=403, detail="Not allowed")
    q.answered = 1 if payload.answered else 0
    db.commit()
    return {"ok": True, "answered": bool(q.answered)}


@router.put("/api/v1/qna/questions/{question_id}")
def update_question(
    question_id: int,
    payload: QuestionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(Question).filter(Question.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    if current_user.id != q.author_id and getattr(current_user, "role", "user") != "admin":
        raise HTTPException(status_code=403, detail="Not allowed")
    if payload.title is not None:
        title = payload.title.strip()
        if not title:
            raise HTTPException(status_code=400, detail="제목은 필수입니다.")
        q.title = title
    if payload.body is not None:
        body = payload.body.strip()
        if not body:
            raise HTTPException(status_code=400, detail="내용은 필수입니다.")
        q.body = body
    if payload.tags is not None:
        q.tags_text = ",".join(payload.tags)
    if payload.category is not None:
        q.category = payload.category
    db.commit()
    db.refresh(q)
    return {"ok": True, "id": q.id}


@router.delete("/api/v1/qna/questions/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_question(
    question_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(Question).filter(Question.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    if current_user.id != q.author_id and getattr(current_user, "role", "user") != "admin":
        raise HTTPException(status_code=403, detail="Not allowed")
    db.delete(q)
    db.commit()
    return

