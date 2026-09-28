from fastapi import APIRouter, Depends, HTTPException, Request, status, BackgroundTasks
from sqlalchemy.orm import Session
from uuid import UUID

import models, schemas
from database import get_db
from auth import get_current_user
from security import limiter, allow_admins_only, allow_all_authenticated
from webhooks import dispatch_webhook

router = APIRouter(prefix="/api", tags=["core"])

# --- EVENT ENDPOINTS (T1 Core) ---
# SECURED: Only Admins and Organizers can create events
@router.post("/events", response_model=schemas.EventResponse)
def create_event(
    event: schemas.EventCreate, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(allow_admins_only) # strictly isolated
):
    new_event = models.Event(**event.model_dump())
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event

# --- USER ENDPOINTS (T1 Core) ---
@router.patch("/users/{user_id}")
def update_user_role(user_id: UUID, req: schemas.UserUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(allow_admins_only)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    try:
        user.role = models.RoleEnum(req.role.upper())
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid role")
    db.commit()
    return {"status": "success"}

@router.delete("/users/{user_id}")
def delete_user(user_id: UUID, db: Session = Depends(get_db), current_user: models.User = Depends(allow_admins_only)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"status": "success"}

# --- TEAM ENDPOINTS (T1 Core) ---
@router.post("/teams/create", response_model=schemas.TeamResponse)
def create_team(
    req: schemas.TeamCreate, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(allow_all_authenticated)
):
    if current_user.team_id:
        raise HTTPException(status_code=400, detail="User already in a team")
    
    import secrets
    invite_code = secrets.token_hex(4).upper()
    team = models.Team(name=req.name, invite_code=invite_code)
    db.add(team)
    db.commit()
    db.refresh(team)
    
    current_user.team_id = team.id
    db.commit()
    return team

# SECURED: Any authenticated user can join, but rate-limited to prevent brute-forcing invite codes
@router.post("/teams/join", response_model=schemas.UserResponse)
@limiter.limit("5/minute")
def join_team(
    request: Request, # Required by slowapi limiter
    req: schemas.TeamJoinRequest, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(allow_all_authenticated)
):
    team = db.query(models.Team).filter(models.Team.invite_code == req.invite_code).first()
    if not team:
        raise HTTPException(status_code=404, detail="Invalid invite code")
    if current_user.team_id:
        raise HTTPException(status_code=400, detail="User already in a team")
    
    current_user.team_id = team.id
    db.commit()
    db.refresh(current_user)
    return current_user

# SECURED: Only Admins can delete teams
@router.delete("/teams/{team_id}")
def delete_team(
    team_id: UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(allow_admins_only)
):
    team = db.query(models.Team).filter(models.Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    # Nullify team_id for all members
    for member in team.members:
        member.team_id = None
        
    db.delete(team)
    db.commit()
    return {"status": "success", "message": "Team deleted"}

@router.patch("/teams/{team_id}")
def update_team(
    team_id: UUID,
    req: schemas.TeamUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(allow_admins_only)
):
    team = db.query(models.Team).filter(models.Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    team.name = req.name
    db.commit()
    return {"status": "success"}


# --- SUBMISSION ENDPOINTS (T1 Core) ---
# SECURED: Rate-limited to prevent spamming the database with huge draft payloads
@router.post("/submissions", response_model=schemas.SubmissionResponse)
@limiter.limit("10/minute")
def submit_project(
    request: Request,
    sub: schemas.SubmissionCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(allow_all_authenticated)
):
    if not current_user.team_id:
        raise HTTPException(status_code=400, detail="Must be part of a team to submit")
    
    existing_sub = db.query(models.ProjectSubmission).filter(models.ProjectSubmission.team_id == current_user.team_id).first()
    
    if existing_sub:
        for key, value in sub.model_dump().items():
            setattr(existing_sub, key, value)
        db.commit()
        db.refresh(existing_sub)
        
        # Trigger Webhook
        background_tasks.add_task(dispatch_webhook, "project.updated", {"title": existing_sub.title})
        return existing_sub
    
    new_sub = models.ProjectSubmission(**sub.model_dump(), team_id=current_user.team_id)
    db.add(new_sub)
    db.commit()
    db.refresh(new_sub)
    
    # Trigger Webhook
    background_tasks.add_task(dispatch_webhook, "project.submitted", {"title": new_sub.title})
    return new_sub
