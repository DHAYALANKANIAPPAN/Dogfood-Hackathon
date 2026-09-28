import statistics
from sqlalchemy.orm import Session
import models

def calculate_z_score(score: float, mean: float, stdev: float) -> float:
    if stdev == 0:
        return 0.0 # Avoid division by zero if all scores are identical
    return (score - mean) / stdev

def normalize_all_scores(db: Session):
    """
    T2: Cross-Judge Score Normalization.
    Calculates the mean and standard deviation for each individual judge.
    Applies the Z-Score formula to their raw scores to mathematically flatten bias.
    Maps the Z-Score to a readable 0-100 scale and saves it to the DB.
    """
    judges = db.query(models.User).filter(models.User.role == models.RoleEnum.JUDGE).all()
    
    for judge in judges:
        assignments = db.query(models.JudgeAssignment).filter(
            models.JudgeAssignment.judge_id == judge.id,
            models.JudgeAssignment.is_submitted == True
        ).all()
        
        if not assignments:
            continue
            
        # Extract the base scores from the JSON column
        scores = [
            a.criteria_scores.get("calculated_base_score", 0.0) 
            for a in assignments if a.criteria_scores
        ]
        
        if len(scores) < 2:
            # Cannot calculate standard deviation with less than 2 scores
            # Assign a neutral normalized score (50 on a 0-100 mapped scale)
            for a in assignments:
                a.normalized_score = 50
            continue
            
        judge_mean = statistics.mean(scores)
        judge_stdev = statistics.stdev(scores)
        
        for a in assignments:
            base_score = a.criteria_scores.get("calculated_base_score", 0.0) if a.criteria_scores else 0.0
            z_score = calculate_z_score(base_score, judge_mean, judge_stdev)
            
            # Map Z-Score to a readable 0-100 scale (Assuming Z=-3 is 0, Z=3 is 100)
            # Formula: 50 + (Z * 16.66)
            mapped_score = int(50 + (z_score * 16.66))
            mapped_score = max(0, min(100, mapped_score)) # Clamp between 0 and 100
            
            # Write the mathematically normalized score directly into DHAYA's database schema
            a.normalized_score = mapped_score
            
    db.commit()
    return {"status": "success", "message": "All scores mathematically normalized via Z-Score."}
