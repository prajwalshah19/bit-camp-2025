from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.sqlite import BLOB
from sqlalchemy.sql import func
from app.core.database import Base
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    access_level = Column(String, default="user")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    files = relationship("FileMetadata", back_populates="submitter")


class FileMetadata(Base):
    __tablename__ = "files"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    filename = Column(String, index=True)
    submitter_id = Column(String, ForeignKey("users.id"), nullable=False)
    submitter = relationship("User", back_populates="files")
    similarity_score = Column(Float)
    status = Column(String, default="pending")
    upload_time = Column(DateTime(timezone=True), server_default=func.now())
    