from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import workspace, chat
import httpx

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

@app.get("/ollama-status")
async def ollama_status():
    """Check if Ollama server is reachable."""
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            await client.get("http://localhost:11434/")
            return {"online": True}
    except Exception as e:
        return {"online": False, "error": str(e)}

@app.get("/models")
async def list_models():
    """Fetch installed Ollama models dynamically."""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get("http://localhost:11434/api/tags")
            data = resp.json()
            models = [
                {"name": m["name"], "size": m.get("size", 0)}
                for m in data.get("models", [])
            ]
            return {"models": models, "online": True}
    except Exception as e:
        return {"models": [], "online": False, "error": str(e)}
