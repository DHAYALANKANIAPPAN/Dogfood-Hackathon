from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Dict

import models
from database import get_db
from security import allow_admins_only, allow_judges_and_admins
from auth import get_current_user

from algorithms.assignment import assign_judges_to_submissions
from algorithms.scoring import calculate_weighted_score

router = APIRouter(prefix="/api/judging", tags=["judging"])

@router.post("/run-assignments")
def trigger_judge_assignments(
    reviews_per_project: int = 3, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(allow_admins_only)
):
    """
    T2: Batch/Algorithmic Judge Assignment.
    Only Admins and Organizers can trigger this.
    """
    result = assign_judges_to_submissions(db, reviews_per_project)
    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    return result

@router.post("/submit-rubric/{assignment_id}")
def submit_rubric_scores(
    assignment_id: UUID,
    raw_scores: Dict[str, float] = Body(..., example={"design": 8, "technical": 9}),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(allow_judges_and_admins)
):
    """
    T2: Weighted and configurable judging rubrics.
    Judges submit their raw rubric scores here. The backend applies configured event weights.
    """
    assignment = db.query(models.JudgeAssignment).filter(models.JudgeAssignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
        
    # Strictly enforce role isolation: Judges can only score their own assigned projects
    if current_user.role == models.RoleEnum.JUDGE and assignment.judge_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only score your own assignments.")

    # In a real scenario, weights would be fetched from the Event/Track model.
    # For hackathon demonstration, we use a fixed configurable dictionary.
    configured_weights = {
        "design": 0.3,
        "technical": 0.5,
        "pitch": 0.2
    }
    
    # Calculate base score mathematically
    base_score = calculate_weighted_score(raw_scores, configured_weights)
    
    # Save the scores to the DB JSON column so BHAVA can use them for Normalization later
    assignment.criteria_scores = {
        "raw": raw_scores,
        "weights_applied": configured_weights,
        "calculated_base_score": base_score
    }
    assignment.is_submitted = True
    
    db.commit()
    db.refresh(assignment)
    
    return {"status": "success", "base_score": base_score}

@router.get("/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    """
    Fetch all projects and their average scores to render the live leaderboard.
    """
    submissions = db.query(models.ProjectSubmission).filter(models.ProjectSubmission.is_draft == False).all()
    leaderboard = []
    
    for sub in submissions:
        assignments = db.query(models.JudgeAssignment).filter(
            models.JudgeAssignment.submission_id == sub.id,
            models.JudgeAssignment.is_submitted == True
        ).all()
        
        total_score = 0
        valid_reviews = 0
        for a in assignments:
            if a.criteria_scores and "calculated_base_score" in a.criteria_scores:
                total_score += a.criteria_scores["calculated_base_score"]
                valid_reviews += 1
                
        avg_score = total_score / valid_reviews if valid_reviews > 0 else 0
        
        leaderboard.append({
            "id": str(sub.id),
            "title": sub.title,
            "team_name": sub.team.name if sub.team else "Unknown Team",
            "score": round(avg_score, 2),
            "reviews": valid_reviews
        })
        
    # Sort by score descending
    leaderboard.sort(key=lambda x: x["score"], reverse=True)
    return leaderboard
