from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from database import get_db
import models
from security import allow_judges_and_admins
from webhooks import generate_judge_certificate

router = APIRouter(prefix="/api/audit", tags=["audit"])

@router.post("/mock_webhook_receiver")
async def mock_webhook_receiver(request: Request):
    """
    A local endpoint to prove our webhook dispatcher works while offline.
    """
    payload = await request.json()
    print(f"\n--- 🔔 WEBHOOK RECEIVED ---\nEvent: {payload.get('event')}\nData: {payload.get('data')}\n---------------------------\n")
    return {"status": "received"}

@router.get("/judge/certificate")
def get_participation_certificate(
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(allow_judges_and_admins)
):
    """
    Generates a cryptographically signed JSON blob proving a judge's participation.
    """
    # Count how many projects this judge has scored
    projects_scored = db.query(models.JudgeAssignment).filter(
        models.JudgeAssignment.judge_id == current_user.id,
        models.JudgeAssignment.is_submitted == True
    ).count()
    
    cert = generate_judge_certificate(current_user.email, projects_scored)
    return cert
