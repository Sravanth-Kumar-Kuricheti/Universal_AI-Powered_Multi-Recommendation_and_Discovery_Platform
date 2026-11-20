import json
import asyncio
from fastapi import APIRouter, Query, Response, Depends
from sse_starlette.sse import EventSourceResponse
from app.schemas.search import SearchRequest, SearchResponse
from app.services.search_orchestrator import search_orchestrator
from app.services.suggestion_engine import suggestion_engine
from app.services.query_analyzer import query_analyzer
from app.services.export_service import export_items_to_csv
from app.database import get_db
from app.models.search_history import SearchHistory
from sqlalchemy.orm import Session

router = APIRouter(tags=["Search"])

@router.post("/search", response_model=SearchResponse)
async def search_endpoint(request: SearchRequest, db: Session = Depends(get_db)):
    response = await search_orchestrator.execute_search(request)
    
    # Save search query in local history table
    try:
        history_entry = SearchHistory(
            query=request.query,
            category=request.category or "all",
            results_count=response.total_results
        )
        db.add(history_entry)
        db.commit()
    except Exception:
        db.rollback()

    return response

@router.post("/search/stream")
async def search_stream(request: SearchRequest):
    async def event_generator():
        # Step 1: Query analysis
        yield {"event": "status", "data": json.dumps({"step": "analyzing", "message": f"Analyzing query '{request.query}'..."})}
        await asyncio.sleep(0.1)
        intent = await query_analyzer.analyze(request.query, request.category or "all")
        yield {"event": "intent", "data": intent.model_dump_json()}

        # Step 2: Querying multi-source connectors
        yield {"event": "status", "data": json.dumps({"step": "fetching", "message": "Querying verified internet sources concurrently..."})}
        response = await search_orchestrator.execute_search(request)

        # Step 3: Yield structured response
        yield {"event": "complete", "data": response.model_dump_json()}

    return EventSourceResponse(event_generator())

@router.get("/search/suggestions")
async def get_suggestions(q: str = Query(..., min_length=1)):
    intent = await query_analyzer.analyze(q)
    suggestions = await suggestion_engine.generate_suggestions(q, intent, [])
    return suggestions

@router.get("/export/csv")
async def export_csv(q: str = Query(..., min_length=1), category: str = Query("all")):
    req = SearchRequest(query=q, category=category, page=1, page_size=50)
    response = await search_orchestrator.execute_search(req)
    csv_data = export_items_to_csv(response.results)
    
    filename = f"recomind_results_{q.replace(' ', '_')[:20]}.csv"
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
