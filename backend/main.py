from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
import auth
import api
import audit
from security import limiter

app = FastAPI(
    title="Dogfood Hackathon API",
    description="Offline-first hackathon submission and judging platform API.",
    version="1.0.0"
)

# Apply Anti-Abuse Rate Limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Since it's local offline, allowing all is fine for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth.router)
app.include_router(api.router)
app.include_router(audit.router)
import judging_api
app.include_router(judging_api.router)
import data_api
app.include_router(data_api.router)
from routers import helpdesk
app.include_router(helpdesk.router, prefix="/api/help-requests", tags=["helpdesk"])

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Dogfood API is running securely offline."}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
