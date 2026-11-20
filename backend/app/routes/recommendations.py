from fastapi import APIRouter, Query
from typing import List
from app.schemas.recommendation import RecommendationItem
from app.schemas.search import SearchRequest
from app.services.search_orchestrator import search_orchestrator

router = APIRouter(tags=["Recommendations"])

@router.get("/recommendations/{item_id}/similar", response_model=List[RecommendationItem])
async def get_similar_recommendations(
    item_id: str,
    query: str = Query(..., description="Original item title or context"),
    category: str = Query("all")
):
    req = SearchRequest(query=f"similar to {query}", category=category, page=1, page_size=6)
    response = await search_orchestrator.execute_search(req)
    # Exclude original item if present
    similar = [it for it in response.results if it.id != item_id][:6]
    return similar
