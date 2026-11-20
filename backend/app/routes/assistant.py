from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List, Optional
from app.services.groq_service import groq_service
from app.services.query_analyzer import query_analyzer

router = APIRouter(tags=["AI Assistant"])

class ChatMessage(BaseModel):
    role: str = Field(..., description="user or assistant")
    content: str = Field(...)

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    current_query: Optional[str] = None
    category: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    suggested_searches: List[str] = Field(default_factory=list)

@router.post("/assistant/chat", response_model=ChatResponse)
async def chat_with_assistant(req: ChatRequest):
    last_user_msg = next((m.content for m in reversed(req.messages) if m.role == "user"), "")
    
    # 1. Try Groq AI conversational response
    if groq_service.is_available():
        system_prompt = (
            "You are RecoMind AI Assistant — a helpful, concise universal recommendation expert. "
            "Help the user find the best courses, tools, books, videos, movies, and products. "
            "Give direct, actionable recommendations with clear advice. Keep your response under 3 concise paragraphs."
        )
        context = f"Current active search context: '{req.current_query or 'General'}'"
        user_prompt = f"{context}\nUser says: '{last_user_msg}'"
        ai_reply = await groq_service.generate_text(system_prompt, user_prompt)
        if ai_reply:
            return ChatResponse(
                reply=ai_reply.strip(),
                suggested_searches=[
                    f"Best free {last_user_msg[:25]}",
                    f"Beginner roadmap for {last_user_msg[:25]}",
                    f"Compare top tools for {last_user_msg[:25]}"
                ]
            )

    # 2. High-quality Deterministic AI Assistant Fallback
    q = last_user_msg.strip()
    reply = (
        f"I've analyzed your question regarding **{q}**. "
        f"Based on real-world recommendation metrics, I suggest focusing on verified resources with high community ratings and open access. "
        f"You can search directly using the top search bar, or filter your results by Free access and Beginner level to get started quickly!"
    )

    suggested_searches = [
        f"Best free courses for {q[:20]}",
        f"Top video tutorials for {q[:20]}",
        f"Open source projects for {q[:20]}"
    ]

    return ChatResponse(
        reply=reply,
        suggested_searches=suggested_searches
    )
