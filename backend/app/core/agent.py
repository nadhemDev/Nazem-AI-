from langchain_ollama import ChatOllama
from langchain_core.tools import tool
from langchain_core.messages import HumanMessage, AIMessage
from langgraph.prebuilt import create_react_agent
from app.core.config import settings
from app.core.fs_tools import read_file, write_file, list_tree, apply_diff
import os

WORKSPACE_ROOT = os.path.abspath(os.path.join(os.getcwd(), ".."))

SYSTEM_MESSAGE = (
    "You are Nazem, an expert AI coding assistant. "
    "You have access to the user's local workspace. "
    "Use the available tools to read, write, and edit files. "
    "Always explain what you are doing before calling a tool. "
    "Respond in the same language as the user."
)

@tool
def tool_list_tree() -> str:
    """Lists all files and folders in the current workspace."""
    return str(list_tree(WORKSPACE_ROOT))

@tool
def tool_read_file(filepath: str) -> str:
    """Reads the content of a file. Provide its relative path from the workspace root."""
    full_path = os.path.join(WORKSPACE_ROOT, filepath)
    return read_file(full_path)

@tool
def tool_write_file(filepath: str, content: str) -> str:
    """Creates or completely overwrites a file with the given content."""
    full_path = os.path.join(WORKSPACE_ROOT, filepath)
    success = write_file(full_path, content)
    return "File written successfully." if success else "ERROR: Failed to write file."

@tool
def tool_apply_diff(filepath: str, search_content: str, replace_content: str) -> str:
    """Replaces an exact block of text in a file. Use for targeted edits."""
    full_path = os.path.join(WORKSPACE_ROOT, filepath)
    success = apply_diff(full_path, search_content, replace_content)
    return "Diff applied successfully." if success else "ERROR: Could not find the search block in the file."

tools = [tool_list_tree, tool_read_file, tool_write_file, tool_apply_diff]

def get_agent(model_name: str = "qwen2.5-coder:1.5b"):
    llm = ChatOllama(
        base_url=settings.OLLAMA_BASE_URL,
        model=model_name,
        temperature=0.1,
    )
    return create_react_agent(llm, tools, prompt=SYSTEM_MESSAGE)
