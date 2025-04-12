from sqlalchemy import Column, String, Float, DateTime
from sqlalchemy.dialects.sqlite import BLOB
from sqlalchemy.sql import func
from app.core.database import Base
import uuid

class FileMetadata(Base):
    __tablename__ = "files"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    filename = Column(String, index=True)
    submitter = Column(String, index=True)
    similarity_score = Column(Float)
    status = Column(String, default="pending")
    upload_time = Column(DateTime(timezone=True), server_default=func.now())
    # Optional fields: matches, admin_notes, etc.
