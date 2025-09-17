
from .db import SessionLocal, Post, User

def seed_posts():
    db = SessionLocal()
    try:
        # Check if there are any posts already
        if db.query(Post).count() == 0:
            # Create a dummy user for the posts
            from .auth import get_password_hash
            user = db.query(User).filter(User.email == "test@test.com").first()
            if not user:
                user = User(username="test", email="test@test.com", password_hash=get_password_hash("testpassword"))
                db.add(user)
                db.commit()
                db.refresh(user) # 비밀번호를 "testpassword"로 설정하고 해싱
                db.add(user)
                db.commit()
                db.refresh(user)

            posts = [
                Post(title="첫 번째 게시물", body="첫 번째 게시물 내용입니다.", author_id=user.id),
                Post(title="두 번째 게시물", body="두 번째 게시물 내용입니다.", author_id=user.id),
                Post(title="세 번째 게시물", body="세 번째 게시물 내용입니다.", author_id=user.id),
            ]
            db.add_all(posts)
            db.commit()
    finally:
        db.close()
