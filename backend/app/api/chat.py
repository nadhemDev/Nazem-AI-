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
    """
    Receives a user message, invokes the LangGraph ReAct agent, and streams the response back.
    Streams token-by-token using astream_events.
    """
    agent = get_agent(req.model)

    async def event_generator():
        try:
            full_response = ""
            async for event in agent.astream_events(
                {"messages": [HumanMessage(content=req.message)]},
                version="v2"
            ):
                kind = event.get("event", "")
                # Stream AI message tokens
                if kind == "on_chat_model_stream":
                    chunk = event.get("data", {}).get("chunk")
                    if chunk and hasattr(chunk, "content") and chunk.content:
                        token = chunk.content
                        full_response += token
                        yield f"data: {json.dumps({'token': token, 'done': False})}\n\n"

            # Signal completion
            yield f"data: {json.dumps({'token': '', 'done': True, 'full': full_response})}\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'token': f'Erreur: {str(e)}', 'done': True, 'full': f'Erreur: {str(e)}'})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        }
    )
