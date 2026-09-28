import httpx
import hmac
import hashlib
import json
import os
from datetime import datetime, timezone

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super_secret_offline_key_for_hackathon")

# Mock webhook registry for the offline hackathon. 
# In a real environment, this would be a database table of subscribed URLs.
REGISTERED_WEBHOOKS = ["http://localhost:8000/api/audit/mock_webhook_receiver"]

async def dispatch_webhook(event_type: str, payload: dict):
    """
    Dispatches a lightweight webhook asynchronously.
    Fulfills the T4 Webhook requirement.
    """
    data = {
        "event": event_type,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "data": payload
    }
    
    async with httpx.AsyncClient() as client:
        for url in REGISTERED_WEBHOOKS:
            try:
                # We use a short timeout since it's local offline execution
                await client.post(url, json=data, timeout=2.0)
                print(f"[Webhook] Successfully delivered '{event_type}' to {url}")
            except Exception as e:
                print(f"[Webhook Error] Failed to deliver to {url}: {e}")

def generate_judge_certificate(judge_email: str, projects_scored: int) -> dict:
    """
    Generates a verifiable, cryptographically signed JSON blob.
    Fulfills the T4 Auditability requirement without relying on external PDF services.
    """
    payload = {
        "judge": judge_email,
        "projects_scored": projects_scored,
        "issued_at": datetime.now(timezone.utc).isoformat(),
        "issuer": "Dogfood Hackathon 2026 Platform"
    }
    
    # Create HMAC-SHA256 signature using the server's secret key
    payload_str = json.dumps(payload, sort_keys=True)
    signature = hmac.new(
        SECRET_KEY.encode(), 
        payload_str.encode(), 
        hashlib.sha256
    ).hexdigest()
    
    return {
        "certificate": payload,
        "signature": signature
    }
