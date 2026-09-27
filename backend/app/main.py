from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import workspace, chat

app = FastAPI(
    title="NAZEM.AI API",
    description="Backend API for NAZEM.AI Local Coding Assistant",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(workspace.router, prefix="/workspace", tags=["Workspace"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])

@app.get("/")
async def root():
    return {"message": "Welcome to NAZEM.AI API"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}

