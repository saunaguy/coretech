from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session, joinedload
from typing import List
from ..db import SessionLocal, Post, User
from ..auth import get_current_user

router = APIRouter(tags=["board"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class PostCreate(BaseModel):
    title: str
    body: str


@router.post("/api/v1/board/posts", status_code=status.HTTP_201_CREATED)
def create_post(payload: PostCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not payload.title.strip() or not payload.body.strip():
        raise HTTPException(status_code=400, detail="제목과 내용은 필수입니다.")
    post = Post(title=payload.title.strip(), body=payload.body.strip(), user_id=current_user.id)
    db.add(post)
    db.commit()
    db.refresh(post)
    return {
        "id": post.id,
        "title": post.title,
        "body": post.body,
        "views": post.views,
        "likes": post.likes,
        "created_at": post.created_at,
        "author": {"id": current_user.id, "username": current_user.username},
    }


@router.get("/api/v1/board/posts")
def list_posts(sort: str = Query("latest", enum=["latest", "views", "likes"]), db: Session = Depends(get_db)):
    q = db.query(Post).options(joinedload(Post.author))
    if sort == "views":
        q = q.order_by(Post.views.desc())
    elif sort == "likes":
        q = q.order_by(Post.likes.desc())
    else:
        q = q.order_by(Post.created_at.desc())
    posts: List[Post] = q.all()
    return [
        {
            "id": p.id,
            "title": p.title,
            "views": p.views,
            "likes": p.likes,
            "createdAt": p.created_at.isoformat() if p.created_at else None,
            "author": {"id": p.author.id, "username": p.author.username} if p.author else None,
        }
        for p in posts
    ]

