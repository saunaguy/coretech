from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List
from ..db import SessionLocal, Question, User
from ..auth import get_current_user

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


@router.post("/api/v1/qna/questions", status_code=status.HTTP_201_CREATED)
def create_question(payload: QuestionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not payload.title.strip() or not payload.body.strip():
        raise HTTPException(status_code=400, detail="제목과 내용은 필수입니다.")
    tags_text = ",".join(payload.tags or [])
    q = Question(title=payload.title.strip(), body=payload.body.strip(), author_id=current_user.id, tags_text=tags_text)
    db.add(q)
    db.commit()
    db.refresh(q)
    return {"id": q.id, "title": q.title, "body": q.body, "views": q.views, "created_at": q.created_at}


@router.get("/api/v1/qna/questions")
def list_questions(db: Session = Depends(get_db)):
    qs = db.query(Question).order_by(Question.created_at.desc()).all()
    return [
        {
            "id": q.id,
            "title": q.title,
            "body": q.body,
            "views": q.views,
            "created_at": q.created_at.isoformat() if q.created_at else None,
        }
        for q in qs
    ]

