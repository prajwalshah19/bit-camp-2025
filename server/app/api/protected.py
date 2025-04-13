from fastapi import APIRouter, Depends
from app.api.dependencies import get_current_admin
from app.models.schema import User 

router = APIRouter(prefix="/admin", tags=["admin"])

# This file doesn't do anything yet, could be needed in the future if more admin routes are added.
@router.get("/dashboard")
def admin_dashboard(current_admin: User = Depends(get_current_admin)):
    return {"message": f"Welcome, admin {current_admin.email}!"}