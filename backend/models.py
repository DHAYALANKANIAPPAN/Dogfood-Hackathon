import enum
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, DateTime, Enum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from database import Base

class RoleEnum(str, enum.Enum):
    ADMIN = "ADMIN"
    ORGANIZER = "ORGANIZER"
    JUDGE = "JUDGE"
    PARTICIPANT = "PARTICIPANT"

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.PARTICIPANT, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id"), nullable=True)
    team = relationship("Team", back_populates="members")
    judge_assignments = relationship("JudgeAssignment", back_populates="judge")

class Event(Base):
    __tablename__ = "events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(String)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    
    tracks = relationship("Track", back_populates="event")

class Track(Base):
    __tablename__ = "tracks"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_id = Column(UUID(as_uuid=True), ForeignKey("events.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String)

    event = relationship("Event", back_populates="tracks")
    submissions = relationship("ProjectSubmission", back_populates="track")

class Team(Base):
    __tablename__ = "teams"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, nullable=False)
    invite_code = Column(String, unique=True, nullable=False) # For team formation
    
    members = relationship("User", back_populates="team")
    submission = relationship("ProjectSubmission", back_populates="team", uselist=False)

class ProjectSubmission(Base):
    __tablename__ = "project_submissions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id"), unique=True, nullable=False)
    track_id = Column(UUID(as_uuid=True), ForeignKey("tracks.id"), nullable=True)
    
    title = Column(String, nullable=False)
    description = Column(String)
    repo_url = Column(String)
    demo_url = Column(String)
    is_draft = Column(Boolean, default=True) # T1 Requirement: Draft/Edit capability
    
    team = relationship("Team", back_populates="submission")
    track = relationship("Track", back_populates="submissions")
    assignments = relationship("JudgeAssignment", back_populates="submission")

class JudgeAssignment(Base):
    __tablename__ = "judge_assignments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    judge_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    submission_id = Column(UUID(as_uuid=True), ForeignKey("project_submissions.id"), nullable=False)
    
    # Store rubrics as JSON for BHAVA to do complex math (e.g. {"design": 8, "tech": 9})
    criteria_scores = Column(JSON, nullable=True) 
    normalized_score = Column(Integer, nullable=True) # Written by BHAVA's algorithm later
    is_submitted = Column(Boolean, default=False)

    judge = relationship("User", back_populates="judge_assignments")
    submission = relationship("ProjectSubmission", back_populates="assignments")
