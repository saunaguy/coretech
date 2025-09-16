
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import db
from ..schemas import likes_and_comments as schemas
from ..auth import get_current_user
from ..db import Comment, Like, User

router = APIRouter()

def get_db():
    database = db.SessionLocal()
    try:
        yield database
    finally:
        database.close()

@router.post("/api/v1/likes", response_model=schemas.Like)
def toggle_like(like: schemas.LikeCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_like = db.query(Like).filter(
        Like.parent_id == like.parent_id,
        Like.parent_type == like.parent_type,
        Like.user_id == current_user.id
    ).first()

    if db_like:
        db.delete(db_like)
        db.commit()
        return {"detail": "Like removed"}
    else:
        new_like = Like(**like.dict(), user_id=current_user.id)
        db.add(new_like)
        db.commit()
        db.refresh(new_like)
        return new_like

@router.get("/api/v1/{parent_type}/{parent_id}/comments", response_model=List[schemas.Comment])
def get_comments(parent_type: str, parent_id: int, db: Session = Depends(get_db)):
    comments = db.query(Comment).filter(
        Comment.parent_type == parent_type,
        Comment.parent_id == parent_id
    ).all()
    return comments

@router.post("/api/v1/comments", response_model=schemas.Comment)
def create_comment(comment: schemas.CommentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_comment = Comment(**comment.dict(), user_id=current_user.id)
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment
