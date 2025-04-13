from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str 

class UserRead(BaseModel):
    id: str
    email: EmailStr
    access_level: str

    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class FileSimple(BaseModel):
    id: str
    filename: str
    similarity_score: Optional[float]
    status: str
    upload_time: datetime
    submitter_id: str

    class Config:
        orm_mode = True
