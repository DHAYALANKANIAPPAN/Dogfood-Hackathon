from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from database import get_db
from models import Announcement, User, RoleEnum
from auth import get_current_user
from datetime import datetime
import uuid

router = APIRouter()

class AnnouncementCreate(BaseModel):
    title: str
    content: str
    is_urgent: bool = False

class AnnouncementResponse(BaseModel):
    id: uuid.UUID
    title: str
    content: str
    is_urgent: bool
    created_at: datetime
    author_name: str
    
    class Config:
        orm_mode = True

@router.post("/", response_model=AnnouncementResponse)
def create_announcement(request: AnnouncementCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role not in [RoleEnum.ADMIN, RoleEnum.ORGANIZER]:
        raise HTTPException(status_code=403, detail="Not authorized to create announcements")
        
    announcement = Announcement(
        title=request.title,
        content=request.content,
        is_urgent=request.is_urgent,
        author_id=current_user.id
    )
    db.add(announcement)
    db.commit()
    db.refresh(announcement)
    
    return {
        "id": announcement.id,
        "title": announcement.title,
        "content": announcement.content,
        "is_urgent": announcement.is_urgent,
        "created_at": announcement.created_at,
        "author_name": current_user.full_name
    }

@router.get("/", response_model=List[AnnouncementResponse])
def get_announcements(db: Session = Depends(get_db)):
    announcements = db.query(Announcement).order_by(Announcement.created_at.desc()).all()
    
    result = []
    for ann in announcements:
        author = db.query(User).filter(User.id == ann.author_id).first()
        result.append({
            "id": ann.id,
            "title": ann.title,
            "content": ann.content,
            "is_urgent": ann.is_urgent,
            "created_at": ann.created_at,
            "author_name": author.full_name if author else "System"
        })
    return result
