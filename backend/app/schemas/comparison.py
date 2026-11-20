from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from app.schemas.recommendation import RecommendationItem

class CompareRequest(BaseModel):
    items: List[RecommendationItem] = Field(..., min_items=2, max_items=5)

class ComparisonFeature(BaseModel):
    feature_name: str
    values: Dict[str, Any]

class ComparisonAnalysis(BaseModel):
    summary: str
    best_overall_id: Optional[str] = None
    best_value_id: Optional[str] = None
    advantages: Dict[str, List[str]] = Field(default_factory=dict)
    limitations: Dict[str, List[str]] = Field(default_factory=dict)

class CompareResponse(BaseModel):
    items: List[RecommendationItem]
    features: List[ComparisonFeature]
    analysis: ComparisonAnalysis
