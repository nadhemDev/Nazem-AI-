import os
import shutil

IGNORED_DIRS = {".git", "node_modules", "venv", "__pycache__", ".next", "dist", "build"}

def list_tree(directory: str) -> dict:
    """Scan l'arborescence du projet."""
    if not os.path.isdir(directory):
        return {"error": "Directory not found"}
    
    tree = {"name": os.path.basename(directory), "type": "directory", "children": []}
    
    try:
        for entry in os.scandir(directory):
            if entry.name in IGNORED_DIRS:
                continue
            
            if entry.is_dir():
                tree["children"].append({
                    "name": entry.name,
                    "type": "directory",
                    "path": entry.path
                })
            else:
                tree["children"].append({
                    "name": entry.name,
                    "type": "file",
                    "path": entry.path
                })
    except PermissionError:
        pass
        
    return tree

def read_file(filepath: str) -> str:
    """Lit le contenu d'un fichier."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        return f"Error reading file: {str(e)}"

def write_file(filepath: str, content: str) -> bool:
    """Ecrit ou ecrase un fichier complet."""
    try:
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    except Exception:
        return False

def apply_diff(filepath: str, search_content: str, replace_content: str) -> bool:
    """Applique une modification partielle via Search & Replace."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            original = f.read()
            
        if search_content not in original:
            return False
            
        updated = original.replace(search_content, replace_content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(updated)
        return True
    except Exception:
        return False
