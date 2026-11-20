from fastapi import APIRouter
from app.schemas.provider import ProvidersStatusResponse, ProviderInfo
from app.services.search_orchestrator import search_orchestrator

router = APIRouter(tags=["Providers"])

@router.get("/providers/status", response_model=ProvidersStatusResponse)
async def get_providers_status():
    provider_list = []
    active_count = 0
    for name, conn in search_orchestrator.connectors.items():
        is_avail = conn.is_available()
        if is_avail:
            active_count += 1
        status = "ready" if is_avail else ("missing_key" if conn.requires_key else "offline")
        provider_list.append(
            ProviderInfo(
                name=conn.name,
                category=conn.category,
                status=status,
                is_keyless=conn.is_keyless,
                requires_key=conn.requires_key,
                description=conn.description,
                attribution_url=conn.attribution_url
            )
        )
    return ProvidersStatusResponse(
        total_providers=len(provider_list),
        active_providers=active_count,
        providers=provider_list
    )
