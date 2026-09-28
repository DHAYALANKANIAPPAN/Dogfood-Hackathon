from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from database import get_db
from models import HelpRequest, HelpRequestStatus, User, Team, RoleEnum
from auth import get_current_user
from datetime import datetime, timezone
import uuid

router = APIRouter()

class HelpRequestCreate(BaseModel):
    issue_description: str
    location: str

class HelpRequestResponse(BaseModel):
    id: uuid.UUID
    team_name: str
    issue_description: str
    location: str
    status: HelpRequestStatus
    created_at: datetime
    
    class Config:
        orm_mode = True

@router.post("/", response_model=HelpRequestResponse)
def create_help_request(request: HelpRequestCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.team_id:
        raise HTTPException(status_code=400, detail="Must be part of a team to request help")
        
    team = db.query(Team).filter(Team.id == current_user.team_id).first()
    
    help_req = HelpRequest(
        team_id=team.id,
        issue_description=request.issue_description,
        location=request.location
    )
    db.add(help_req)
    db.commit()
    db.refresh(help_req)
    
    return {
        "id": help_req.id,
        "team_name": team.name,
        "issue_description": help_req.issue_description,
        "location": help_req.location,
        "status": help_req.status,
        "created_at": help_req.created_at
    }

@router.get("/", response_model=List[HelpRequestResponse])
def get_help_requests(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role in [RoleEnum.ADMIN, RoleEnum.ORGANIZER, RoleEnum.JUDGE]:
        requests = db.query(HelpRequest).order_by(HelpRequest.created_at.desc()).all()
    else:
        if not current_user.team_id:
            return []
        requests = db.query(HelpRequest).filter(HelpRequest.team_id == current_user.team_id).order_by(HelpRequest.created_at.desc()).all()
        
    result = []
    for req in requests:
        team = db.query(Team).filter(Team.id == req.team_id).first()
        result.append({
            "id": req.id,
            "team_name": team.name if team else "Unknown",
            "issue_description": req.issue_description,
            "location": req.location,
            "status": req.status,
            "created_at": req.created_at
        })
    return result

@router.put("/{request_id}/status")
def update_request_status(request_id: uuid.UUID, status: HelpRequestStatus, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role not in [RoleEnum.ADMIN, RoleEnum.ORGANIZER, RoleEnum.JUDGE]:
        raise HTTPException(status_code=403, detail="Not authorized to update help requests")
        
    req = db.query(HelpRequest).filter(HelpRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Help request not found")
        
    req.status = status
    if status == HelpRequestStatus.RESOLVED:
        req.resolved_at = datetime.now(timezone.utc)
        req.resolved_by_id = current_user.id
        
    db.commit()
    return {"message": "Status updated successfully"}

@router.delete("/{request_id}")
def delete_help_request(request_id: uuid.UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role not in [RoleEnum.ADMIN, RoleEnum.ORGANIZER]:
        raise HTTPException(status_code=403, detail="Not authorized to delete help requests")
        
    req = db.query(HelpRequest).filter(HelpRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Help request not found")
        
    db.delete(req)
    db.commit()
    return {"message": "Deleted successfully"}
