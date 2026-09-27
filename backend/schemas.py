from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from models import RoleEnum

# --- Auth & Users ---
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: RoleEnum = RoleEnum.PARTICIPANT

class UserResponse(BaseModel):
    id: UUID
    email: str
    full_name: str
    role: RoleEnum
    team_id: Optional[UUID]

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

# --- Events ---
class EventCreate(BaseModel):
    name: str
    description: Optional[str] = None
    start_date: datetime
    end_date: datetime

class EventResponse(EventCreate):
    id: UUID

    class Config:
        from_attributes = True

# --- Teams ---
class TeamJoinRequest(BaseModel):
    invite_code: str

class TeamResponse(BaseModel):
    id: UUID
    name: str
    invite_code: str

    class Config:
        from_attributes = True

# --- Submissions ---
class SubmissionCreate(BaseModel):
    track_id: UUID
    title: str
    description: Optional[str] = None
    repo_url: Optional[str] = None
    demo_url: Optional[str] = None
    is_draft: bool = True

class SubmissionResponse(SubmissionCreate):
    id: UUID
    team_id: UUID

    class Config:
        from_attributes = True
