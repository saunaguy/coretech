from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..db import SessionLocal, User
from ..auth import get_current_user, require_admin
from ..schemas.admin import UserResponse, UserRoleUpdate, UserApproval

router = APIRouter(tags=["admin"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/users", response_model=List[UserResponse])
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    users = db.query(User).all()
    return users

@router.post("/approve-user", status_code=status.HTTP_200_OK)
def approve_user(
    payload: UserApproval,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    user_to_update = db.query(User).filter(User.id == payload.user_id).first()
    if not user_to_update:
        raise HTTPException(status_code=404, detail="User not found")

    if payload.approve:
        user_to_update.is_active = True
        if user_to_update.role != "admin": # Ensure admin role is not downgraded by approval
            user_to_update.role = "user"
        db.commit()
        db.refresh(user_to_update)
        return {"message": f"User {payload.user_id} approved successfully."}
    else:
        db.delete(user_to_update)
        db.commit()
        return {"message": f"User {payload.user_id} rejected and deleted successfully."}

@router.get("/pending-users", response_model=List[UserResponse])
def get_pending_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    pending_users = db.query(User).filter(User.is_active == False).all()
    return pending_users

@router.post("/users/{user_id}/role", status_code=status.HTTP_200_OK)
def update_user_role(
    user_id: int,
    payload: UserRoleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    user_to_update = db.query(User).filter(User.id == user_id).first()
    if not user_to_update:
        raise HTTPException(status_code=404, detail="User not found")
    
    if payload.role not in ["admin", "user"]:
        raise HTTPException(status_code=400, detail="Invalid role specified. Role must be 'admin' or 'user'.")

    user_to_update.role = payload.role
    db.commit()
    db.refresh(user_to_update)
    return {"message": f"User {user_id} role updated to {payload.role}."}

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    user_to_delete = db.query(User).filter(User.id == user_id).first()
    if not user_to_delete:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user_to_delete)
    db.commit()
    return