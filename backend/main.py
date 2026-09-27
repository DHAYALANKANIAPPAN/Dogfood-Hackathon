from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Dogfood Hackathon API",
    description="Offline-first hackathon submission and judging platform API.",
    version="1.0.0"
)

# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Since it's local offline, allowing all is fine for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Dogfood API is running securely offline."}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
