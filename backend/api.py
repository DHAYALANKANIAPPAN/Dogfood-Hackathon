from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

import models, schemas
from database import get_db
from auth import get_current_user

router = APIRouter(prefix="/api", tags=["core"])

# --- EVENT ENDPOINTS (T1 Core) ---
@router.post("/events", response_model=schemas.EventResponse)
def create_event(event: schemas.EventCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Simple Role Isolation for now - LING will expand on this in Phase 1
    if current_user.role not in [models.RoleEnum.ADMIN, models.RoleEnum.ORGANIZER]:
        raise HTTPException(status_code=403, detail="Not authorized to create events")
    
    new_event = models.Event(**event.model_dump())
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event


# --- TEAM ENDPOINTS (T1 Core) ---
@router.post("/teams/join", response_model=schemas.UserResponse)
def join_team(req: schemas.TeamJoinRequest, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    team = db.query(models.Team).filter(models.Team.invite_code == req.invite_code).first()
    if not team:
        raise HTTPException(status_code=404, detail="Invalid invite code")
    
    current_user.team_id = team.id
    db.commit()
    db.refresh(current_user)
    return current_user


# --- SUBMISSION ENDPOINTS (T1 Core) ---
@router.post("/submissions", response_model=schemas.SubmissionResponse)
def submit_project(sub: schemas.SubmissionCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if not current_user.team_id:
        raise HTTPException(status_code=400, detail="Must be part of a team to submit")
    
    # Check if team already has a submission
    existing_sub = db.query(models.ProjectSubmission).filter(models.ProjectSubmission.team_id == current_user.team_id).first()
    
    if existing_sub:
        # Update existing submission (handling drafts vs final)
        for key, value in sub.model_dump().items():
            setattr(existing_sub, key, value)
        db.commit()
        db.refresh(existing_sub)
        return existing_sub
    
    # Create new submission
    new_sub = models.ProjectSubmission(**sub.model_dump(), team_id=current_user.team_id)
    db.add(new_sub)
    db.commit()
    db.refresh(new_sub)
    return new_sub
