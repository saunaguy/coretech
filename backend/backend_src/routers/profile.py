
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List

from ..db import SessionLocal, Question, Comment, Post, User, ProgressUser
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

    # Fetch user's comments/answers, and join with the parent question to get its title
    comments = (
        db.query(Comment)
        .options(joinedload(Comment.question))
        .filter(Comment.user_id == current_user.id)
        .order_by(Comment.created_at.desc())
        .all()
    )

    # Fetch user's board posts
    posts = db.query(Post).filter(Post.user_id == current_user.id).order_by(Post.created_at.desc()).all()

    # Fetch user's daily progress
    progress_records = db.query(ProgressUser).filter(ProgressUser.user_id == current_user.id).all()
    # Get the latest progress for each category
    progress = {}
    for p in progress_records:
        if p.category not in progress or p.created_at > progress[p.category].created_at:
            progress[p.category] = p

    # Basic user info
    user_info = {
        "username": current_user.username,
        "email": current_user.email,
        "created_at": current_user.created_at.isoformat(),
        "role": current_user.role,
    }

    return {
        "user": user_info,
        "questions": [
            {
                "id": q.id,
                "title": q.title,
                "created_at": q.created_at.isoformat(),
                "views": q.views,
                "answered": q.answered,
            }
            for q in questions
        ],
        "answers": [
            {
                "id": c.id,
                "content": c.content,
                "created_at": c.created_at.isoformat(),
                "parent_id": c.parent_id,
                "parent_title": c.question.title if c.question else "Unknown Question",
            }
            for c in comments
        ],
        "posts": [
            {"id": p.id, "title": p.title, "created_at": p.created_at.isoformat(), "views": p.views}
            for p in posts
        ],
        "progress": [
            {"category": cat, "percent": p.percent} for cat, p in progress.items()
        ],
    }
