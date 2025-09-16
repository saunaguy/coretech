from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from backend_src.db import get_db, Like, Post, Question, User
from backend_src.schemas.like_schema import LikeCreate, LikeResponse
from backend_src.auth import get_current_user # 인증된 사용자 정보를 가져오는 함수

router = APIRouter(
    prefix="/api/v1",
    tags=["likes"]
)

@router.post("/likes", response_model=LikeResponse, status_code=status.HTTP_201_CREATED)
def toggle_like(
    like_data: LikeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # parent_type에 따라 Post 또는 Question 존재 여부 확인
    if like_data.parent_type == "post":
        parent_item = db.query(Post).filter(Post.id == like_data.parent_id).first()
    elif like_data.parent_type == "question":
        parent_item = db.query(Question).filter(Question.id == like_data.parent_id).first()
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid parent_type")

    if not parent_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{like_data.parent_type.capitalize()} not found")

    # 이미 추천했는지 확인
    existing_like = db.query(Like).filter(
        Like.parent_id == like_data.parent_id,
        Like.parent_type == like_data.parent_type,
        Like.user_id == current_user.id
    ).first()

    if existing_like:
        # 이미 추천했으면 추천 취소 (삭제)
        db.delete(existing_like)
        # 해당 게시글/질문의 likes 카운트 감소
        if like_data.parent_type == "post":
            parent_item.likes = func.max(0, parent_item.likes - 1) # likes가 음수가 되지 않도록
        elif like_data.parent_type == "question":
            # Q&A 질문에는 likes 필드가 없으므로, 필요하다면 추가해야 합니다。
            # 현재는 Post에만 likes 필드가 있으므로, Question에 대한 처리는 생략하거나,
            # Question 모델에 likes 필드를 추가해야 합니다。
            pass
        db.commit()
        raise HTTPException(status_code=status.HTTP_200_OK, detail="Like removed")
    else:
        # 추천하지 않았으면 추천 (생성)
        db_like = Like(
            parent_id=like_data.parent_id,
            parent_type=like_data.parent_type,
            user_id=current_user.id
        )
        db.add(db_like)
        # 해당 게시글/질문의 likes 카운트 증가
        if like_data.parent_type == "post":
            parent_item.likes += 1
        elif like_data.parent_type == "question":
            # Q&A 질문에는 likes 필드가 없으므로, 필요하다면 추가해야 합니다。
            pass
        db.commit()
        db.refresh(db_like)
        return db_like
