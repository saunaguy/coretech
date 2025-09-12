import sys
from pathlib import Path

# Ensure we can import backend package
ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT / "backend"))

from backend_src.db import SessionLocal, User, init_db  # type: ignore
from backend_src.auth import get_password_hash  # type: ignore


def upsert_user(username: str, email: str, password: str) -> None:
    init_db()
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if user:
            user.username = username
            user.password_hash = get_password_hash(password)
        else:
            user = User(username=username, email=email, password_hash=get_password_hash(password))
            db.add(user)
        db.commit()
        db.refresh(user)
        print(f"created_or_updated_user: id={user.id}, email={user.email}")
    finally:
        db.close()


if __name__ == "__main__":
    # Default test user
    upsert_user("test", "test@test.com", "1212")
