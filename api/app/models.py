# api/app/models.py
# JQ.AI Database Models

from sqlalchemy import Column, String, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.database import Base, TimestampMixin

class User(Base, TimestampMixin):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, nullable=False, unique=True)
    hashed_password = Column(String, nullable=False)

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}')>"

class Project(Base, TimestampMixin):
    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    created_by = Column(UUID(as_uuid=True), nullable=False)

    def __repr__(self):
        return f"<Project(id={self.id}, name='{self.name}')>"
