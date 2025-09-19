
from .db import SessionLocal, Post, User, Question

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


def seed_qna():
    db = SessionLocal()
    try:
        # Ensure an active user exists to own questions
        from .auth import get_password_hash
        user = db.query(User).filter(User.email == "qna@test.com").first()
        if not user:
            user = User(
                username="qnauser",
                email="qna@test.com",
                password_hash=get_password_hash("qnapassword"),
                role="user",
                is_active=True,
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        # Seed only if table is empty (idempotent)
        if db.query(Question).count() == 0:
            qs = [
                Question(
                    title="서버 설정이 자주 초기화됩니다",
                    body="재부팅 후 /etc 설정이 일부 사라집니다. 어떤 로그나 설정을 확인해야 할까요?",
                    author_id=user.id,
                    tags_text="linux,server,config",
                    category="server",
                    views=5,
                    answered=0,
                ),
                Question(
                    title="네트워크 지연 이슈 디버깅",
                    body="간헐적으로 RTT가 300ms 이상으로 튑니다. mtr, tcpdump 외 어떤 지표 보면 좋을까요?",
                    author_id=user.id,
                    tags_text="network,latency,troubleshooting",
                    category="network",
                    views=12,
                    answered=1,
                ),
                Question(
                    title="기타: 셸 스크립트 배열 처리",
                    body="bash에서 공백이 포함된 인자를 안전하게 배열로 다루는 패턴이 궁금합니다.",
                    author_id=user.id,
                    tags_text="bash,shell,arrays",
                    category="others",
                    views=3,
                    answered=0,
                ),
            ]
            db.add_all(qs)
            db.commit()
    finally:
        db.close()
