from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional

from ..db import SessionLocal, Notice, User
from ..auth import get_current_user, require_admin


router = APIRouter(prefix="/api/v1/notice", tags=["notice"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class NoticeCreate(BaseModel):
    title: str
    body_md: str
    label: Optional[str] = None
    is_pinned: Optional[bool] = False


class NoticeItem(BaseModel):
    id: int
    title: str
    label: Optional[str] = None
    author: Optional[str] = None
    created_at: Optional[str] = None


class NoticeDetail(BaseModel):
    id: int
    title: str
    body_md: str
    label: Optional[str] = None
    is_pinned: bool = False
    author: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


@router.get("", response_model=List[NoticeItem])
def list_notices(limit: int = Query(20, ge=1, le=200), db: Session = Depends(get_db)):
    q = db.query(Notice).order_by(Notice.is_pinned.desc(), Notice.created_at.desc())
    items: List[Notice] = q.limit(limit).all()
    # Resolve author names best-effort
    author_names: dict[int, str] = {}
    for n in items:
        if getattr(n, "author_id", None) and n.author_id not in author_names:
            u = db.query(User).filter(User.id == n.author_id).first()
            if u:
                author_names[n.author_id] = u.username
    return [
        {
            "id": n.id,
            "title": n.title,
            "label": n.label,
            "author": author_names.get(getattr(n, "author_id", 0)),
            "created_at": n.created_at.isoformat() if getattr(n, "created_at", None) else None,
        }
        for n in items
    ]


@router.get("/{notice_id}", response_model=NoticeDetail)
def get_notice(notice_id: int, db: Session = Depends(get_db)):
    n: Notice | None = db.query(Notice).filter(Notice.id == notice_id).first()
    if not n:
        raise HTTPException(status_code=404, detail="Notice not found")
    # Optionally resolve author name later
    username: Optional[str] = None
    if getattr(n, "author_id", None):
        u = db.query(User).filter(User.id == n.author_id).first()
        if u:
            username = u.username
    return {
        "id": n.id,
        "title": n.title,
        "body_md": n.body_md,
        "label": n.label,
        "is_pinned": bool(getattr(n, "is_pinned", False)),
        "author": username,
        "created_at": n.created_at.isoformat() if getattr(n, "created_at", None) else None,
        "updated_at": n.updated_at.isoformat() if getattr(n, "updated_at", None) else None,
    }


@router.post("", status_code=status.HTTP_201_CREATED, response_model=NoticeDetail)
def create_notice(payload: NoticeCreate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    if not payload.title.strip() or not payload.body_md.strip():
        raise HTTPException(status_code=400, detail="제목과 내용은 필수입니다.")
    allowed_labels = {"공지", "중요", "업데이트", "이벤트"}
    if payload.label and payload.label not in allowed_labels:
        raise HTTPException(status_code=400, detail="허용되지 않은 라벨입니다.")
    n = Notice(
        title=payload.title.strip(),
        body_md=payload.body_md,
        label=(payload.label or None),
        is_pinned=bool(payload.is_pinned),
        author_id=current_user.id,
    )
    db.add(n)
    db.commit()
    db.refresh(n)
    return {
        "id": n.id,
        "title": n.title,
        "body_md": n.body_md,
        "label": n.label,
        "is_pinned": bool(getattr(n, "is_pinned", False)),
        "author": current_user.username,
        "created_at": n.created_at.isoformat() if getattr(n, "created_at", None) else None,
        "updated_at": n.updated_at.isoformat() if getattr(n, "updated_at", None) else None,
    }


@router.delete("/{notice_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_notice(notice_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    n: Notice | None = db.query(Notice).filter(Notice.id == notice_id).first()
    if not n:
        raise HTTPException(status_code=404, detail="Notice not found")
    db.delete(n)
    db.commit()
    return
