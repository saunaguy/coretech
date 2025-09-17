from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List

from backend_src.db import get_db, Comment, Post, Question, User
from backend_src.schemas.comment_schema import CommentCreate, CommentResponse
from backend_src.auth import get_current_user # 인증된 사용자 정보를 가져오는 함수

router = APIRouter(
    prefix="/api/v1",
    tags=["comments"]
)

@router.post("/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def create_comment(
    comment: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # parent_type에 따라 Post 또는 Question 존재 여부 확인
    if comment.parent_type == "post":
        parent_item = db.query(Post).filter(Post.id == comment.parent_id).first()
    elif comment.parent_type == "question":
        parent_item = db.query(Question).filter(Question.id == comment.parent_id).first()
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid parent_type")

    if not parent_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{comment.parent_type.capitalize()} not found")

    db_comment = Comment(
        parent_id=comment.parent_id,
        parent_type=comment.parent_type,
        user_id=current_user.id, # 현재 로그인한 사용자의 ID 사용
        content=comment.content
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@router.get("/{parent_type}/{parent_id}/comments", response_model=List[CommentResponse])
def get_comments_for_parent(
    parent_type: str,
    parent_id: int,
    db: Session = Depends(get_db)
):
    if parent_type not in ["post", "question"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid parent_type")

    comments = db.query(Comment).options(joinedload(Comment.user)).filter(
        Comment.parent_type == parent_type,
        Comment.parent_id == parent_id
    ).order_by(Comment.created_at).all()
    return comments
