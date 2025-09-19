
from .db import SessionLocal, Post, User

def seed_posts():
    db = SessionLocal()
    try:
        # Create an admin user if not exists
        from .auth import get_password_hash
        admin_user = db.query(User).filter(User.email == "admin@example.com").first()
        if not admin_user:
            admin_user = User(
                username="admin",
                email="admin@example.com",
                password_hash=get_password_hash("adminpassword"),
                role="admin",
                is_active=True
            )
            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)

        # Create a pending user for testing approval
        pending_user = db.query(User).filter(User.email == "pending@example.com").first()
        if not pending_user:
            pending_user = User(
                username="pendinguser",
                email="pending@example.com",
                password_hash=get_password_hash("pendingpassword"),
                role="user",
                is_active=False  # This is the key part
            )
            db.add(pending_user)
            db.commit()
            db.refresh(pending_user)

        # Check if there are any posts already
        if db.query(Post).count() == 0:
            # Create a dummy user for the posts (if not already created by admin_user logic)
            user = db.query(User).filter(User.email == "test@test.com").first()
            if not user:
                user = User(username="test", email="test@test.com", password_hash=get_password_hash("testpassword"), is_active=True) # Set to active for posts
                db.add(user)
                db.commit()
                db.refresh(user)

            posts = [
                Post(title="첫 번째 게시물", body="첫 번째 게시물 내용입니다.", user_id=user.id),
                Post(title="두 번째 게시물", body="두 번째 게시물 내용입니다.", user_id=user.id),
                Post(title="세 번째 게시물", body="세 번째 게시물 내용입니다.", user_id=user.id),
            ]
            db.add_all(posts)
            db.commit()
    finally:
        db.close()
