from __future__ import annotations

from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
import os
from jose import jwt, JWTError
from passlib.context import CryptContext
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from .db import SessionLocal, User, init_db


SECRET_KEY = os.getenv("SECRET_KEY", "dev-insecure-secret")
ALGORITHM = "HS256"
# Idle timeout for JWT (sliding session)
INACTIVITY_EXPIRE_SECONDS = int(os.getenv("INACTIVITY_EXPIRE_SECONDS", "1800"))  # 30 minutes by default
# Cookie settings
COOKIE_MAX_AGE_SECONDS = int(os.getenv("COOKIE_MAX_AGE_SECONDS", "86400"))  # 1 day default
COOKIE_SECURE = os.getenv("COOKIE_SECURE", "false").lower() == "true"
COOKIE_SAMESITE = os.getenv("COOKIE_SAMESITE", "lax")
COOKIE_NAME = os.getenv("COOKIE_NAME", "access_token")

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")
# Optional bearer for fallback to cookie when header absent
oauth2_optional = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(seconds=INACTIVITY_EXPIRE_SECONDS))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_token_from_request(request: Request, bearer_token: str | None = Depends(oauth2_optional)) -> str:
    """Extract token from Authorization header or HttpOnly cookie."""
    if bearer_token:
        return bearer_token
    cookie_token = request.cookies.get(COOKIE_NAME)
    if not cookie_token:
        # Trigger 401 in downstream dependency
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    return cookie_token


async def get_current_user(token: str = Depends(get_token_from_request), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("id")
        user_role: str = payload.get("role")
        user_is_active: bool = payload.get("is_active")
        if user_id is None or user_role is None or user_is_active is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
    # Check if user is active
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="계정이 활성화되지 않았습니다. 관리자의 승인 후 이용 가능합니다.")
    return user


async def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required")
    return current_user


class RegisterPayload(BaseModel):
    username: str
    password: str
    email: str


class LoginPayload(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


router = APIRouter(tags=["auth"])


@router.on_event("startup")
def _startup():
    init_db()


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(payload: RegisterPayload, db: Session = Depends(get_db)):
    exists = db.query(User).filter(User.username == payload.username).first()
    if exists:
        raise HTTPException(status_code=400, detail="이미 사용 중인 사용자 이름입니다.")
    exists = db.query(User).filter(User.email == payload.email).first()
    if exists:
        raise HTTPException(status_code=400, detail="이미 사용 중인 이메일입니다.")
    user = User(
        username=payload.username,
        email=payload.email,
        password_hash=get_password_hash(payload.password),
        is_active=False,  # admin 승인 대기
        role="user",
    )
    try:
        db.add(user)
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        # DB 수준 unique 제약 위반 등
        raise HTTPException(status_code=400, detail="이미 사용 중인 사용자 이름 또는 이메일입니다.")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"회원가입 처리 중 오류: {type(e).__name__}")
    return {"id": user.id, "username": user.username, "email": user.email, "is_active": user.is_active, "role": user.role}


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginPayload, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="아이디 또는 비밀번호가 올바르지 않습니다.")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="계정이 활성화되지 않았습니다. 관리자의 승인 후 이용 가능합니다.")
    token = create_access_token(
        {"sub": user.email, "username": user.username, "id": str(user.id), "role": user.role, "is_active": user.is_active},
        expires_delta=timedelta(seconds=INACTIVITY_EXPIRE_SECONDS),
    )
    # Set HttpOnly cookie for 1 day
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        max_age=COOKIE_MAX_AGE_SECONDS,
        expires=COOKIE_MAX_AGE_SECONDS,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        path="/",
    )
    return TokenResponse(access_token=token)


@router.post("/logout", status_code=status.HTTP_200_OK)
def logout(response: Response):
    """Invalidate auth cookie on client by clearing it."""
    response.delete_cookie(COOKIE_NAME, path="/")
    return {"message": "logged out"}
