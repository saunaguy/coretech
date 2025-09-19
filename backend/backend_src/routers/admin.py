from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel # New import
from datetime import datetime # New import
from ..db import SessionLocal, User, AdminAudit, ManagedPage # Modified import
from ..auth import require_admin

router = APIRouter(tags=["admin"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/admin/pending-users")
def get_pending_users(db: Session = Depends(get_db), admin_user: User = Depends(require_admin)):
    pending_users = db.query(User).filter(User.is_active == False).all()
    return [
        {"id": user.id, "username": user.username, "email": user.email, "created_at": user.created_at}
        for user in pending_users
    ]


class ApproveUserPayload(BaseModel):
    user_id: int
    approve: bool


@router.post("/test-approve")
def approve_user(payload: ApproveUserPayload, db: Session = Depends(get_db), admin_user: User = Depends(require_admin)):
    user_to_approve = db.query(User).get(payload.user_id)
    if not user_to_approve:
        raise HTTPException(status_code=404, detail="User not found")

    if payload.approve:
        user_to_approve.is_active = True
        db.add(AdminAudit(admin_user_id=admin_user.id, action="approve_user", target_type="user", target_id=payload.user_id))
    else:
        db.delete(user_to_approve)
        db.add(AdminAudit(admin_user_id=admin_user.id, action="reject_user", target_type="user", target_id=payload.user_id))
    db.commit()
    return {"ok": True}


class ManagedPageUpdatePayload(BaseModel):
    title: str
    content: str


@router.put("/admin/pages/{slug}")
def update_managed_page(slug: str, payload: ManagedPageUpdatePayload, db: Session = Depends(get_db), admin_user: User = Depends(require_admin)):
    page = db.query(ManagedPage).filter(ManagedPage.slug == slug).first()
    if not page:
        # If page doesn't exist, create it
        page = ManagedPage(slug=slug, title=payload.title, content=payload.content, updated_by=admin_user.id)
        db.add(page)
        action = "create_page"
    else:
        page.title = payload.title
        page.content = payload.content
        page.updated_by = admin_user.id
        page.updated_at = datetime.utcnow()
        action = "update_page"
    db.commit()
    db.refresh(page)

    db.add(AdminAudit(admin_user_id=admin_user.id, action=action, target_type="page", target_id=page.id, details={"slug": slug, "title": payload.title}))
    db.commit()
    return {"ok": True, "id": page.id, "slug": page.slug}





@router.get("/admin/pages/{slug}")
def get_managed_page_for_admin(slug: str, db: Session = Depends(get_db), admin_user: User = Depends(require_admin)):
    page = db.query(ManagedPage).filter(ManagedPage.slug == slug).first()
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return {
        "id": page.id,
        "slug": page.slug,
        "title": page.title,
        "content": page.content,
        "updated_by": page.updated_by,
        "updated_at": page.updated_at.isoformat() if page.updated_at else None,
    }
