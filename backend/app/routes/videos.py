from fastapi import APIRouter, Query
from typing import List
from app.schemas.recommendation import RecommendationItem
from app.services.search_orchestrator import search_orchestrator

router = APIRouter(tags=["Videos"])

@router.get("/videos/search", response_model=List[RecommendationItem])
async def search_videos(q: str = Query(..., min_length=1), limit: int = 12):
    yt_conn = search_orchestrator.connectors.get("youtube")
    if not yt_conn:
        return []
    videos = await yt_conn.search(q, limit=limit)
    return videos
