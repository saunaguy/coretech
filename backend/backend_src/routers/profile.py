
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List

from ..db import SessionLocal, Question, Comment, Post, User
from ..auth import get_current_user

router = APIRouter(tags=["profile"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/api/v1/profile")
def get_user_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    # Fetch user's questions
    questions = db.query(Question).filter(Question.author_id == current_user.id).order_by(Question.created_at.desc()).all()

    # Fetch user's comments/answers
    comments = db.query(Comment).options(joinedload(Comment.question)).filter(Comment.user_id == current_user.id).order_by(Comment.created_at.desc()).all()

    # Fetch user's board posts
    posts = db.query(Post).filter(Post.user_id == current_user.id).order_by(Post.created_at.desc()).all()

    # Basic user info
    user_info = {
        "username": current_user.username,
        "email": current_user.email,
        "created_at": current_user.created_at.isoformat(),
        "role": current_user.role
    }

    return {
        "user": user_info,
        "questions": [q.title for q in questions], # Returning titles for now for simplicity
        "answers": [c.content for c in comments], # Returning content for now
        "posts": [p.title for p in posts] # Returning titles for now
    }
