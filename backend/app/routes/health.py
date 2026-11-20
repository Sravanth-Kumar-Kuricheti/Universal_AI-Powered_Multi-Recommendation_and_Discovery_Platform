from fastapi import APIRouter
from app.config import settings
from app.utils.helpers import get_iso_now

router = APIRouter(tags=["Health"])

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "timestamp": get_iso_now(),
        "ai_status": "groq_connected" if settings.GROQ_API_KEY else "deterministic_engine_active"
    }
