from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.schema import FileMetadata
import uuid
from fastapi.security import OAuth2PasswordBearer
from app.api.dependencies import get_current_admin, get_current_user
from app.models.schema import User


router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/send")
async def send_file(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    content = await file.read()
    
    similarity_score = 0.45  # Placeholder -> should use engine from engine/engine.py to find similarity via ML model

    new_file = FileMetadata(
        id=str(uuid.uuid4()),
        filename=file.filename,
        submitter_id=current_user.id,
        similarity_score=similarity_score,
        status="pending"
    )
    
    db.add(new_file)
    db.commit()
    db.refresh(new_file)

    return JSONResponse(content={"message": "File received", "score": similarity_score})

@router.get("/review")
async def get_all_files(current_admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    files = db.query(FileMetadata).all()
    return {"files": files}

@router.post("/decision/{file_id}")
async def decide_on_file(file_id: str, action: str = Form(...), current_admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    file_record = db.query(FileMetadata).filter(FileMetadata.id == file_id).first()
    if file_record:
        file_record.status = "approved" if action.lower() == "approve" else "denied"
        db.commit()
        return {"message": f"{action.upper()} decision recorded for {file_record.filename}"}
    return JSONResponse(status_code=404, content={"error": "File not found"})


