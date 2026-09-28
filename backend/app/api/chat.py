from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from langchain_core.messages import HumanMessage
from app.core.agent import get_agent
import json

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    model: str = "qwen2.5-coder:1.5b"

@router.post("/message")
async def send_chat_message(req: ChatRequest):
    agent = get_agent(req.model)

    async def event_generator():
        try:
            full_response = ""
            async for event in agent.astream_events(
                {"messages": [HumanMessage(content=req.message)]},
                version="v2"
            ):
                kind = event.get("event", "")
                if kind == "on_chat_model_stream":
                    chunk = event.get("data", {}).get("chunk")
                    if not chunk:
                        continue
                    if getattr(chunk, "tool_call_chunks", None):
                        continue
                    content = getattr(chunk, "content", "")
                    if not content:
                        continue
                    full_response += content
                    yield "data: " + json.dumps({"token": content, "done": False}) + "\n\n"

            yield "data: " + json.dumps({"token": "", "done": True, "full": full_response}) + "\n\n"

        except Exception as e:
            err = str(e)
            yield "data: " + json.dumps({"token": "Erreur: " + err, "done": True, "full": "Erreur: " + err}) + "\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
