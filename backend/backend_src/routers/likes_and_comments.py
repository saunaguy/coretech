
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from .. import db
from ..schemas import likes_and_comments as schemas
from ..auth import get_current_user
from ..db import Comment, Like, User, Question

router = APIRouter()

def get_db():
    database = db.SessionLocal()
    try:
        yield database
    finally:
        database.close()

@router.get("/api/v1/likes/status")
def get_like_status(parent_id: int = Query(...), parent_type: str = Query(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_like = db.query(Like).filter(
        Like.parent_id == parent_id,
        Like.parent_type == parent_type,
        Like.user_id == current_user.id
    ).first()
    return {"is_liked": db_like is not None}

@router.post("/api/v1/likes", response_model=schemas.Like)
def create_like(like: schemas.LikeCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_like = db.query(Like).filter(
        Like.parent_id == like.parent_id,
        Like.parent_type == like.parent_type,
        Like.user_id == current_user.id
    ).first()

    if db_like:
        # Like already exists, do nothing
        return db_like
    else:
        # Create a new like
        new_like = Like(**like.dict(), user_id=current_user.id)
        db.add(new_like)
        db.commit()
        db.refresh(new_like)
        return new_like

@router.get("/api/v1/likes", response_model=List[schemas.Like])
def get_all_likes(db: Session = Depends(get_db)):
    likes = db.query(Like).all()
    return likes

@router.get("/api/v1/comments", response_model=List[schemas.Comment])
def get_all_comments(db: Session = Depends(get_db)):
    comments = db.query(Comment).all()
    return comments

@router.get("/api/v1/{parent_type}/{parent_id}/comments", response_model=List[schemas.Comment])
def get_comments(parent_type: str, parent_id: int, db: Session = Depends(get_db)):
    comments_with_users = db.query(Comment, User).join(User, Comment.user_id == User.id).filter(
        Comment.parent_type == parent_type,
        Comment.parent_id == parent_id
    ).all()

    result = []
    for comment, user in comments_with_users:
        result.append({
            "id": comment.id,
            "content": comment.content,
            "user_id": comment.user_id,
            "created_at": comment.created_at,
            "parent_id": comment.parent_id,
            "parent_type": comment.parent_type,
            "author": {
                "id": user.id,
                "username": user.username
            }
        })
    return result

@router.post("/api/v1/comments", response_model=schemas.Comment)
def create_comment(comment: schemas.CommentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        new_comment = Comment(**comment.dict(), user_id=current_user.id)
        db.add(new_comment)
        db.commit()
        db.refresh(new_comment)

        # Auto-mark question as answered when admin/operator replies
        if comment.parent_type == "question" and getattr(current_user, "role", "user") in ("admin", "operator"):
            q = db.query(Question).filter(Question.id == comment.parent_id).first()
            if q and (q.answered or 0) == 0:
                q.answered = 1
                db.commit()
    except Exception as e:
        db.rollback() # Rollback in case of error
        raise HTTPException(status_code=500, detail=f"Failed to create comment: {e}")

    return {
        "id": new_comment.id,
        "content": new_comment.content,
        "user_id": new_comment.user_id,
        "created_at": new_comment.created_at,
        "parent_id": new_comment.parent_id,
        "parent_type": new_comment.parent_type,
        "author": {
            "id": current_user.id,
            "username": current_user.username
        }
    }
