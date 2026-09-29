from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import PlainTextResponse
import csv
import io
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
from uuid import UUID

import models, schemas
from database import get_db
from security import allow_admins_only, allow_judges_and_admins, allow_all_authenticated
from auth import get_current_user

router = APIRouter(prefix="/api/data", tags=["data"])

@router.get("/public/users")
def get_public_users(db: Session = Depends(get_db)):
    users = db.query(models.User).filter(models.User.role == models.RoleEnum.PARTICIPANT).all()
    return [{"id": str(u.id), "name": u.full_name} for u in users]

@router.get("/public/teams")
def get_public_teams(db: Session = Depends(get_db)):
    teams = db.query(models.Team).options(joinedload(models.Team.members)).all()
    return [{
        "id": str(t.id),
        "name": t.name,
        "members": [{"name": m.full_name} for m in t.members]
    } for t in teams]

@router.get("/public/problems")
def get_public_problems(db: Session = Depends(get_db)):
    problems = db.query(models.ProblemStatement).order_by(models.ProblemStatement.created_at.desc()).all()
    return [{"id": str(p.id), "title": p.title, "description": p.description, "created_at": p.created_at} for p in problems]

@router.post("/problems")
def create_problem(
    title: str, 
    description: str,
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(allow_admins_only)
):
    problem = models.ProblemStatement(
        title=title,
        description=description,
        author_id=current_user.id
    )
    db.add(problem)
    db.commit()
    db.refresh(problem)
    return {"id": str(problem.id)}

@router.delete("/problems/{problem_id}")
def delete_problem(
    problem_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(allow_admins_only)
):
    problem = db.query(models.ProblemStatement).filter(models.ProblemStatement.id == problem_id).first()
    if problem:
        db.delete(problem)
        db.commit()
    return {"status": "ok"}

@router.get("/users")
def get_users(db: Session = Depends(get_db), current_user: models.User = Depends(allow_admins_only)):
    users = db.query(models.User).all()
    return [{"id": str(u.id), "name": u.full_name, "email": u.email, "role": u.role.value.lower() if hasattr(u.role, 'value') else str(u.role).lower().replace('roleenum.','')} for u in users]

@router.get("/projects")
def get_projects(db: Session = Depends(get_db), current_user: models.User = Depends(allow_all_authenticated)):
    projects = db.query(models.ProjectSubmission).options(joinedload(models.ProjectSubmission.team)).all()
    return [{
        "id": str(p.id),
        "name": p.title,
        "team": p.team.name if p.team else "Unknown",
        "description": p.description,
        "repo_url": p.repo_url,
        "status": "Draft" if p.is_draft else "Submitted",
        "demo_url": p.demo_url
    } for p in projects]

@router.get("/assignments")
def get_assignments(db: Session = Depends(get_db), current_user: models.User = Depends(allow_judges_and_admins)):
    if current_user.role.value.upper() == 'ADMIN':
        assignments = db.query(models.JudgeAssignment).options(joinedload(models.JudgeAssignment.submission).joinedload(models.ProjectSubmission.team)).all()
    else:
        assignments = db.query(models.JudgeAssignment).options(joinedload(models.JudgeAssignment.submission).joinedload(models.ProjectSubmission.team)).filter(models.JudgeAssignment.judge_id == current_user.id).all()
        
    return [{
        "assignment_id": str(a.id),
        "project_id": str(a.submission.id),
        "name": a.submission.title,
        "team": a.submission.team.name if a.submission.team else "Unknown",
        "is_submitted": a.is_submitted,
        "repo_url": a.submission.repo_url,
        "score": a.criteria_scores.get("calculated_base_score") if a.criteria_scores else None
    } for a in assignments]

@router.get("/teams")
def get_teams(db: Session = Depends(get_db), current_user: models.User = Depends(allow_all_authenticated)):
    teams = db.query(models.Team).options(joinedload(models.Team.members)).all()
    return [{
        "id": str(t.id),
        "name": t.name,
        "invite_code": t.invite_code,
        "members": [{"id": str(m.id), "name": m.full_name, "email": m.email} for m in t.members]
    } for t in teams]

@router.get("/tracks")
def get_tracks(db: Session = Depends(get_db)):
    tracks = db.query(models.Track).all()
    return [{"id": str(t.id), "name": t.name, "description": t.description} for t in tracks]


# --- EXPORT ENDPOINTS (T2 & T4 Core Requirements) ---

@router.get("/export/users", response_class=PlainTextResponse)
def export_users_csv(db: Session = Depends(get_db), current_user: models.User = Depends(allow_admins_only)):
    users = db.query(models.User).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Email", "Full Name", "Role", "Team ID"])
    for u in users:
        writer.writerow([str(u.id), u.email, u.full_name, u.role.value, str(u.team_id) if u.team_id else ""])
    return PlainTextResponse(output.getvalue(), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=users_export.csv"})

@router.get("/export/projects", response_class=PlainTextResponse)
def export_projects_csv(db: Session = Depends(get_db), current_user: models.User = Depends(allow_admins_only)):
    projects = db.query(models.ProjectSubmission).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Team ID", "Track ID", "Title", "Status", "Repo URL"])
    for p in projects:
        writer.writerow([str(p.id), str(p.team_id), str(p.track_id), p.title, "Draft" if p.is_draft else "Submitted", p.repo_url])
    return PlainTextResponse(output.getvalue(), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=projects_export.csv"})

@router.get("/export/assignments", response_class=PlainTextResponse)
def export_assignments_csv(db: Session = Depends(get_db), current_user: models.User = Depends(allow_admins_only)):
    assignments = db.query(models.JudgeAssignment).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Assignment ID", "Judge ID", "Submission ID", "Is Submitted", "Normalized Score"])
    for a in assignments:
        writer.writerow([str(a.id), str(a.judge_id), str(a.submission_id), str(a.is_submitted), str(a.normalized_score) if a.normalized_score else ""])
    return PlainTextResponse(output.getvalue(), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=judging_export.csv"})
