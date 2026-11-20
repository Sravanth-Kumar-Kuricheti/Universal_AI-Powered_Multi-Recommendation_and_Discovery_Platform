from typing import Optional, List, Any
from pydantic import BaseModel, Field

class RecommendationItem(BaseModel):
    id: str = Field(..., description="Unique deterministic identifier")
    title: str = Field(..., description="Title of the recommended resource")
    description: Optional[str] = Field(default=None, description="Detailed or summary description")
    category: str = Field(..., description="Normalized category: courses, videos, articles, books, tools, jobs, projects, communities, products, other")
    source: str = Field(..., description="Original provider name e.g. GitHub, YouTube, Open Library")
    url: str = Field(..., description="Direct clickable source link")
    image_url: Optional[str] = Field(default=None, description="Direct thumbnail/cover image link")
    video_url: Optional[str] = Field(default=None, description="Direct playable video link if applicable")
    rating: Optional[float] = Field(default=None, description="Official provider rating out of 5.0 or 10.0 if available")
    price: Optional[str] = Field(default=None, description="Official pricing e.g. Free, Paid, Freemium, or exact amount")
    tags: List[str] = Field(default_factory=list, description="Categorical or topic tags")
    match_score: Optional[int] = Field(default=None, description="Calculated RecoMind match score (0-100%)")
    match_reason: Optional[str] = Field(default=None, description="Explanation for why this fits the user's query")
    published_date: Optional[str] = Field(default=None, description="Publication or release date")
    duration: Optional[str] = Field(default=None, description="Course length, video duration, or reading time")
    level: Optional[str] = Field(default=None, description="Beginner, Intermediate, Advanced, All Levels")
    author_or_channel: Optional[str] = Field(default=None, description="Creator, author, instructor, or channel name")
    location: Optional[str] = Field(default=None, description="City, country, or remote status if applicable")
    retrieved_at: Optional[str] = Field(default=None, description="ISO timestamp of data retrieval")

class SearchSuggestions(BaseModel):
    summary: str = Field(..., description="AI search summary of findings")
    alternatives: List[str] = Field(default_factory=list, description="Alternative queries or angles")
    related_queries: List[str] = Field(default_factory=list, description="Clickable related search chips")
    follow_up_questions: List[str] = Field(default_factory=list, description="Conversational prompt chips")
