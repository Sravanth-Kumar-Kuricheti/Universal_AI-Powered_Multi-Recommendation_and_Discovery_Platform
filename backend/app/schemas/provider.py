from typing import Optional, List, Dict
from pydantic import BaseModel, Field

class ProviderInfo(BaseModel):
    name: str
    category: str
    status: str # "ready", "missing_key", "error", "rate_limited"
    is_keyless: bool
    requires_key: bool
    description: str
    attribution_url: str

class ProvidersStatusResponse(BaseModel):
    total_providers: int
    active_providers: int
    providers: List[ProviderInfo]
