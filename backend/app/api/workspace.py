from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from app.core.fs_tools import list_tree, read_file, write_file, apply_diff

router = APIRouter()

# On suppose pour le moment que le workspace local est le dossier courant ou un dossier fixe
# TODO: Connecter cela dynamiquement à la session active de l'utilisateur
WORKSPACE_ROOT = os.path.abspath(os.path.join(os.getcwd(), ".."))

class WriteFileRequest(BaseModel):
    filepath: str
    content: str

class DiffRequest(BaseModel):
    filepath: str
    search: str
    replace: str

@router.get("/tree")
async def get_workspace_tree():
    return list_tree(WORKSPACE_ROOT)

@router.get("/file")
async def get_file_content(filepath: str):
    full_path = os.path.join(WORKSPACE_ROOT, filepath)
    if not os.path.exists(full_path):
        raise HTTPException(status_code=404, detail="File not found")
    content = read_file(full_path)
    if content.startswith("Error"):
        raise HTTPException(status_code=500, detail=content)
    return {"content": content}

@router.post("/file")
async def create_or_update_file(req: WriteFileRequest):
    full_path = os.path.join(WORKSPACE_ROOT, req.filepath)
    success = write_file(full_path, req.content)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to write file")
    return {"status": "success"}

@router.post("/diff")
async def apply_file_diff(req: DiffRequest):
    full_path = os.path.join(WORKSPACE_ROOT, req.filepath)
    success = apply_diff(full_path, req.search, req.replace)
    if not success:
        raise HTTPException(status_code=400, detail="Search block not found or failed to write")
    return {"status": "success"}
