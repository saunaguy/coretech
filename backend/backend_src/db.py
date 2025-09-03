from __future__ import annotations

from datetime import datetime
import os
from sqlalchemy import create_engine, String, Integer, DateTime, Text, Boolean
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker


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
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    email: Mapped[str | None] = mapped_column(String(120), unique=True, nullable=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Post(Base):
    __tablename__ = "posts"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    body: Mapped[str] = mapped_column(Text)
    author_id: Mapped[int] = mapped_column(Integer, index=True)
    views: Mapped[int] = mapped_column(Integer, default=0)
    likes: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Question(Base):
    __tablename__ = "questions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    body: Mapped[str] = mapped_column(Text)
    author_id: Mapped[int] = mapped_column(Integer, index=True)
    answered: Mapped[int] = mapped_column(Integer, default=0)
    tags_text: Mapped[str | None] = mapped_column(Text, nullable=True)
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


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    # Best-effort migration: add category column if missing
    try:
        if engine.dialect.name == "postgresql":
            with engine.begin() as conn:
                conn.exec_driver_sql(
                    "ALTER TABLE daily_tests ADD COLUMN IF NOT EXISTS category VARCHAR(50)"
                )
                conn.exec_driver_sql(
                    "ALTER TABLE notices ADD COLUMN IF NOT EXISTS label VARCHAR(30)"
                )
                conn.exec_driver_sql(
                    "ALTER TABLE notices ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE"
                )
        elif engine.dialect.name == "sqlite":
            with engine.begin() as conn:
                cols = conn.exec_driver_sql("PRAGMA table_info('daily_tests')").all()
                colnames = {row[1] for row in cols}
                if "category" not in colnames:
                    conn.exec_driver_sql("ALTER TABLE daily_tests ADD COLUMN category TEXT")
                # Create notices/progress tables if absent (SQLite)
                conn.exec_driver_sql(
                    "CREATE TABLE IF NOT EXISTS notices (id INTEGER PRIMARY KEY, title TEXT, body_md TEXT, label TEXT, is_pinned INTEGER DEFAULT 0, author_id INTEGER, created_at TEXT, updated_at TEXT)"
                )
                conn.exec_driver_sql(
                    "CREATE TABLE IF NOT EXISTS progress_user (id INTEGER PRIMARY KEY, user_id INTEGER, category TEXT, percent INTEGER, created_at TEXT)"
                )
    except Exception:
        # ignore if migration is not applicable
        pass
