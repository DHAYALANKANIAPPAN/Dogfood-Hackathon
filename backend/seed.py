import os
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext

from database import engine, SessionLocal, Base
from models import User, RoleEnum, Event, Track, Team, ProjectSubmission

# Password hashing setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def seed_data():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if we already seeded the data
    if db.query(User).filter(User.email == "admin@dogfood.com").first():
        print("Database already seeded. Skipping fixture injection.")
        db.close()
        return

    print("Injecting Fixture Data...")

    # 1. Create Users
    admin = User(email="admin@dogfood.com", hashed_password=get_password_hash("admin123"), full_name="Alice Admin", role=RoleEnum.ADMIN)
    organizer = User(email="org@dogfood.com", hashed_password=get_password_hash("org123"), full_name="Oscar Organizer", role=RoleEnum.ORGANIZER)
    judge1 = User(email="judge1@dogfood.com", hashed_password=get_password_hash("judge123"), full_name="Judy One", role=RoleEnum.JUDGE)
    judge2 = User(email="judge2@dogfood.com", hashed_password=get_password_hash("judge123"), full_name="Judy Two", role=RoleEnum.JUDGE)
    
    p1 = User(email="p1@dogfood.com", hashed_password=get_password_hash("p123"), full_name="Pat Participant", role=RoleEnum.PARTICIPANT)
    p2 = User(email="p2@dogfood.com", hashed_password=get_password_hash("p123"), full_name="Pam Participant", role=RoleEnum.PARTICIPANT)

    db.add_all([admin, organizer, judge1, judge2, p1, p2])
    db.commit()

    # 2. Create Event & Track
    now = datetime.now(timezone.utc)
    event = Event(
        name="Dogfood 2026", 
        description="The hackathon that judges itself.",
        start_date=now - timedelta(days=1),
        end_date=now + timedelta(days=2)
    )
    db.add(event)
    db.commit()

    track = Track(name="Main Track", description="Everyone builds the same platform.", event_id=event.id)
    db.add(track)
    db.commit()

    # 3. Create Teams
    team1 = Team(name="Team Alpha", invite_code="ALPHA_2026")
    team2 = Team(name="Team Beta", invite_code="BETA_2026")
    db.add_all([team1, team2])
    db.commit()

    # Assign participants to teams
    p1.team_id = team1.id
    p2.team_id = team2.id
    db.commit()

    # 4. Create Submissions
    sub1 = ProjectSubmission(
        team_id=team1.id,
        track_id=track.id,
        title="AlphaHack Platform",
        description="A robust hackathon platform with ML normalization.",
        repo_url="https://github.com/team-alpha/dogfood",
        is_draft=False
    )
    sub2 = ProjectSubmission(
        team_id=team2.id,
        track_id=track.id,
        title="Beta Judge",
        description="Offline-first hackathon UI.",
        repo_url="https://github.com/team-beta/dogfood",
        is_draft=True
    )
    db.add_all([sub1, sub2])
    db.commit()

    print("Fixture Data successfully injected!")
    db.close()

if __name__ == "__main__":
    seed_data()
