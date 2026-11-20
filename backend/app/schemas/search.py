from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from app.schemas.recommendation import RecommendationItem, SearchSuggestions

class SearchFilters(BaseModel):
    category: Optional[str] = Field(default="all")
    price: Optional[str] = Field(default=None, description="free, paid, freemium, trial")
    level: Optional[str] = Field(default=None, description="beginner, intermediate, advanced")
    min_rating: Optional[float] = Field(default=None)
    source: Optional[str] = Field(default=None)
    location: Optional[str] = Field(default=None)

class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=1000)
    category: Optional[str] = Field(default="all")
    filters: Optional[SearchFilters] = Field(default_factory=SearchFilters)
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=12, ge=1, le=100)
    sort: Optional[str] = Field(default="relevance", description="relevance, match, rating, date")

class SearchIntent(BaseModel):
    query: str
    intent: str
    categories: List[str]
    keywords: List[str]
    price: Optional[str] = None
    level: Optional[str] = None
    location: Optional[str] = None
    include_videos: bool = False

class SearchResponse(BaseModel):
    query: str
    intent: SearchIntent
    categories: List[str]
    results: List[RecommendationItem]
    category_counts: Dict[str, int] = Field(default_factory=dict)
    total_results: int
    page: int
    page_size: int
    total_pages: int
    sources: List[str] = Field(default_factory=list)
    provider_status: Dict[str, str] = Field(default_factory=dict)
    suggestions: SearchSuggestions
    retrieval_timestamp: str
