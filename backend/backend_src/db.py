from __future__ import annotations

import os
from datetime import datetime
from typing import List

from sqlalchemy import Boolean, DateTime, Integer, String, Text, create_engine, ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker, relationship # relationship 추가
from pydantic import BaseModel, ConfigDict

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./coretech.db")

# Use SQLite-specific connect_args only for sqlite
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String(150), unique=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(20), default="user")
    is_active: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    posts: Mapped[List["Post"]] = relationship(back_populates="author")


class Post(Base):
    __tablename__ = "posts"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(200))
    body: Mapped[str] = mapped_column(Text)
    views: Mapped[int] = mapped_column(Integer, default=0)
    likes: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime | None] = mapped_column(DateTime, onupdate=datetime.utcnow, nullable=True)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False)

    author: Mapped["User"] = relationship("User", back_populates="posts")


class Question(Base):
    __tablename__ = "questions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    body: Mapped[str] = mapped_column(Text)
    author_id: Mapped[int] = mapped_column(Integer, index=True)
    views: Mapped[int] = mapped_column(Integer, default=0) # views 필드 추가
    answered: Mapped[int] = mapped_column(Integer, default=0)
    tags_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    category: Mapped[str | None] = mapped_column(String(50), nullable=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class DailyTest(Base):
    __tablename__ = "daily_tests"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    questions_json: Mapped[str] = mapped_column(Text)  # JSON string of questions
    category: Mapped[str | None] = mapped_column(String(50), nullable=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Notice(Base):
    __tablename__ = "notices"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    body_md: Mapped[str] = mapped_column(Text)
    label: Mapped[str | None] = mapped_column(String(30), nullable=True)
    is_pinned: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    author_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class ProgressUser(Base):
    __tablename__ = "progress_user"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, index=True, default=0)
    category: Mapped[str] = mapped_column(String(50), index=True)
    percent: Mapped[int] = mapped_column(Integer, default=0)  # 0..100
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Comment(Base):
    __tablename__ = "comments"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    parent_id: Mapped[int] = mapped_column(Integer, index=True) # 게시글 또는 Q&A 질문 ID
    parent_type: Mapped[str] = mapped_column(String(50), index=True) # "post" 또는 "question"
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["User"] = relationship("User", backref="comments")

class Like(Base):
    __tablename__ = "likes"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    parent_id: Mapped[int] = mapped_column(Integer, index=True) # 게시글 또는 Q&A 질문 ID
    parent_type: Mapped[str] = mapped_column(String(50), index=True) # "post" 또는 "question"
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["User"] = relationship("User", backref="likes")


class AdminAudit(Base):
    __tablename__ = "admin_audit"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    admin_user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    action: Mapped[str] = mapped_column(String(100))
    target_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    target_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    details: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class ManagedPage(Base):
    __tablename__ = "managed_pages"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slug: Mapped[str] = mapped_column(String(100), unique=True)
    title: Mapped[str | None] = mapped_column(String(255), nullable=True)
    content: Mapped[str | None] = mapped_column(Text, nullable=True)
    updated_by: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    # Best-effort migration: add category column if missing
    try:
        if engine.dialect.name == "postgresql":
            with engine.begin() as conn:
                # Ensure users table has expected columns (best-effort, no-op if exists)
                conn.exec_driver_sql(
                    "ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user'"
                )
                conn.exec_driver_sql(
                    "ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT FALSE"
                )
                conn.exec_driver_sql(
                    "ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW()"
                )
                # Posts table best-effort columns (legacy DBs may miss these)
                conn.exec_driver_sql(
                    "ALTER TABLE posts ADD COLUMN IF NOT EXISTS user_id INTEGER"
                )
                conn.exec_driver_sql(
                    "ALTER TABLE posts ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0"
                )
                conn.exec_driver_sql(
                    "ALTER TABLE posts ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0"
                )
                conn.exec_driver_sql(
                    "ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE"
                )
                conn.exec_driver_sql(
                    "ALTER TABLE posts ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW()"
                )
                conn.exec_driver_sql(
                    "ALTER TABLE posts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ"
                )
                conn.exec_driver_sql(
                    "ALTER TABLE daily_tests ADD COLUMN IF NOT EXISTS category VARCHAR(50)"
                )
                conn.exec_driver_sql(
                    "ALTER TABLE notices ADD COLUMN IF NOT EXISTS label VARCHAR(30)"
                )
                conn.exec_driver_sql(
                    "ALTER TABLE notices ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE"
                )
                conn.exec_driver_sql(
                    "ALTER TABLE questions ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0"
                )
                conn.exec_driver_sql(
                    "ALTER TABLE questions ADD COLUMN IF NOT EXISTS category VARCHAR(50)"
                )
        elif engine.dialect.name == "sqlite":
            with engine.begin() as conn:
                cols = conn.exec_driver_sql("PRAGMA table_info('daily_tests')").all()
                colnames = {row[1] for row in cols}
                if "category" not in colnames:
                    conn.exec_driver_sql("ALTER TABLE daily_tests ADD COLUMN category TEXT")
                # Add views column to questions table if missing (SQLite)
                cols = conn.exec_driver_sql("PRAGMA table_info('questions')").all()
                colnames = {row[1] for row in cols}
                if "views" not in colnames:
                    conn.exec_driver_sql("ALTER TABLE questions ADD COLUMN views INTEGER DEFAULT 0")
                if "category" not in colnames:
                    conn.exec_driver_sql("ALTER TABLE questions ADD COLUMN category TEXT")
                # Posts table columns (SQLite)
                cols = conn.exec_driver_sql("PRAGMA table_info('posts')").all()
                colnames = {row[1] for row in cols}
                if "user_id" not in colnames:
                    conn.exec_driver_sql("ALTER TABLE posts ADD COLUMN user_id INTEGER")
                if "views" not in colnames:
                    conn.exec_driver_sql("ALTER TABLE posts ADD COLUMN views INTEGER DEFAULT 0")
                if "likes" not in colnames:
                    conn.exec_driver_sql("ALTER TABLE posts ADD COLUMN likes INTEGER DEFAULT 0")
                if "is_deleted" not in colnames:
                    conn.exec_driver_sql("ALTER TABLE posts ADD COLUMN is_deleted INTEGER DEFAULT 0")
                if "created_at" not in colnames:
                    conn.exec_driver_sql("ALTER TABLE posts ADD COLUMN created_at TEXT")
                if "updated_at" not in colnames:
                    conn.exec_driver_sql("ALTER TABLE posts ADD COLUMN updated_at TEXT")
                # Create notices/progress tables if absent (SQLite)
                conn.exec_driver_sql(
                    "CREATE TABLE IF NOT EXISTS notices (id INTEGER PRIMARY KEY, title TEXT, "
                    "body_md TEXT, label TEXT, is_pinned INTEGER DEFAULT 0, "
                    "author_id INTEGER, created_at TEXT, updated_at TEXT)"
                )
                conn.exec_driver_sql(
                    "CREATE TABLE IF NOT EXISTS progress_user (id INTEGER PRIMARY KEY, "
                    "user_id INTEGER, category TEXT, percent INTEGER, created_at TEXT)"
                )
                # Add comments table if absent (SQLite)
                conn.exec_driver_sql(
                    "CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY, parent_id INTEGER, "
                    "parent_type TEXT, user_id INTEGER, content TEXT, created_at TEXT)"
                )
                # Add likes table if absent (SQLite)
                conn.exec_driver_sql(
                    "CREATE TABLE IF NOT EXISTS likes (id INTEGER PRIMARY KEY, parent_id INTEGER, "
                    "parent_type TEXT, user_id INTEGER, created_at TEXT)"
                )
    except Exception:
        # ignore if migration is not applicable
        pass

# Pydantic Schemas for API responses
class UserSummary(BaseModel):
    id: int
    username: str

    model_config = ConfigDict(from_attributes=True)

class PostWithAuthor(BaseModel):
    id: int
    title: str
    views: int
    likes: int
    comments_count: int
    created_at: datetime
    author: UserSummary

    model_config = ConfigDict(from_attributes=True)
