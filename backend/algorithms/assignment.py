import random
from sqlalchemy.orm import Session
import models

def assign_judges_to_submissions(db: Session, reviews_per_project: int = 3) -> dict:
    """
    Algorithmic Judge Assignment:
    Ensures every non-draft project gets exactly `reviews_per_project` reviews.
    Randomly load-balances assignments across available judges.
    """
    judges = db.query(models.User).filter(models.User.role == models.RoleEnum.JUDGE).all()
    submissions = db.query(models.ProjectSubmission).filter(models.ProjectSubmission.is_draft == False).all()
    
    if not judges:
        return {"status": "error", "message": "No judges available in the system."}
    if not submissions:
        return {"status": "error", "message": "No finalized submissions to judge."}
        
    assignments_made = 0
    
    for sub in submissions:
        # Check how many assignments this project already has
        current_assignments = db.query(models.JudgeAssignment).filter(
            models.JudgeAssignment.submission_id == sub.id
        ).count()
        
        needed = reviews_per_project - current_assignments
        if needed <= 0:
            continue
            
        # Get IDs of judges already assigned to this project to avoid duplicates
        existing_assignments = db.query(models.JudgeAssignment).filter(
            models.JudgeAssignment.submission_id == sub.id
        ).all()
        assigned_judge_ids = {a.judge_id for a in existing_assignments}
        
        # Filter available judges
        available_judges = [j for j in judges if j.id not in assigned_judge_ids]
        
        if not available_judges:
            continue
            
        # Select random judges to fulfill the needed quota
        selected_judges = random.sample(available_judges, min(needed, len(available_judges)))
        
        for judge in selected_judges:
            new_assignment = models.JudgeAssignment(
                judge_id=judge.id,
                submission_id=sub.id
            )
            db.add(new_assignment)
            assignments_made += 1
            
    db.commit()
    return {"status": "success", "assignments_made": assignments_made}
