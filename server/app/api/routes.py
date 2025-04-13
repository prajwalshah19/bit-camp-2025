from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.schema import FileMetadata
import uuid
from fastapi.security import OAuth2PasswordBearer
from app.api.dependencies import get_current_admin, get_current_user
from app.models.schema import User
from app.models.user_schemas import FileSimple
from app.engine.semantic_matcher import SemanticMatcher

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/protected")
def protected_route(current_user: dict = Depends(get_current_user)):
    return {"message": "You are authenticated", "user": current_user}

@router.post("/send")
async def send_file(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    topics = "apple, mountain, bicycle, galaxy, pencil, skyscraper, sandwich, violin, mirror, library, rocket, treasure, perfume, balloon, lamp, guitar, forest, astronaut, cinema, notebook, elephant, waterfall, castle, telescope, rainbow, octopus, cactus, submarine, tornado, pancake, carousel, clock, hammock, lantern, window, compass, kite, volcano, camera, skateboard, puzzle, sandwich, skyscraper, galaxy, robot, pillow, chalk, notebook, ocean"
    content = await file.read()
    print(content)
    sm = SemanticMatcher(topics, str(content))
    
    similarity_score = sm.score()  # Placeholder -> should use engine from engine/engine.py to find similarity via ML model

    print(similarity_score)

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

@router.get("/review/{file_id}", response_model=FileSimple)
def read_file(
    file_id: str,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin), 
):
    file = db.query(FileMetadata).filter(FileMetadata.id == file_id).first()
    if not file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
async def decide_on_file(file_id: str, action: str = Form(...), current_admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    file_record = db.query(FileMetadata).filter(FileMetadata.id == file_id).first()
    if file_record:
        file_record.status = "approved" if action.lower() == "approved" else "denied"
        db.commit()
        return {"data": file_record,"message": f"{action.upper()} decision recorded for {file_record.filename}"}
    return JSONResponse(status_code=404, content={"error": "File not found"})


