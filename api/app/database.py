# api/app/database.py
# JQ.AI Database Connection
# PostgreSQL + asyncpg + SQLAlchemy 2.0

import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import Column, String, DateTime, func

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/jqai")

# Convert standard postgresql:// to asyncpg postgresql+asyncpg://
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

async def get_db() -> AsyncSession:
    """
    Dependency that provides an async database session.
    Usage: `db: AsyncSession = Depends(get_db)`
    """
    async with AsyncSessionLocal() as session:
        yield session

# ----------------------------
# Base Model Mixins
# ----------------------------

class TimestampMixin:
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class SoftDeleteMixin:
    deleted_at = Column(DateTime, nullable=True)
