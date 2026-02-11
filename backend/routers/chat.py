from fastapi import APIRouter
from models.oracle_models import ChatRequest, ChatResponse
from services.agent_dispatcher import get_response

router = APIRouter(tags=["chat"])


@router.post("/message", response_model=ChatResponse)
async def send_message(request: ChatRequest):
    return get_response(request)
