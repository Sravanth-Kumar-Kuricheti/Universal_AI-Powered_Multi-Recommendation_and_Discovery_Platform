from fastapi import APIRouter
from typing import Dict, List, Any
from app.schemas.comparison import CompareRequest, CompareResponse, ComparisonFeature, ComparisonAnalysis
from app.services.groq_service import groq_service

router = APIRouter(tags=["Compare"])

@router.post("/compare", response_model=CompareResponse)
async def compare_items(request: CompareRequest):
    items = request.items
    
    # Build comparison features table
    feature_keys = [
        ("Source", lambda x: x.source or "N/A"),
        ("Category", lambda x: (x.category or "N/A").capitalize()),
        ("RecoMind Match", lambda x: f"{x.match_score}%" if x.match_score else "N/A"),
        ("Official Rating", lambda x: f"{x.rating} / 5.0" if x.rating else "Not Rated"),
        ("Price / Access", lambda x: x.price or "Standard Access"),
        ("Level", lambda x: x.level or "All Levels"),
        ("Duration / Format", lambda x: x.duration or "Self-paced"),
        ("Creator / Author", lambda x: x.author_or_channel or "Community / Platform"),
    ]
    
    features: List[ComparisonFeature] = []
    for f_name, f_func in feature_keys:
        vals: Dict[str, Any] = {}
        for it in items:
            vals[it.id] = f_func(it)
        features.append(ComparisonFeature(feature_name=f_name, values=vals))

    # Advantages and Limitations analysis
    advantages: Dict[str, List[str]] = {}
    limitations: Dict[str, List[str]] = {}
    
    for it in items:
        adv = []
        lim = []
        if it.match_score and it.match_score >= 90:
            adv.append(f"Exceptionally high query match ({it.match_score}%)")
        if it.price and "free" in it.price.lower():
            adv.append("Free or open access")
        elif it.price and "paid" in it.price.lower():
            lim.append("Requires paid enrollment or purchase")
        if it.rating and it.rating >= 4.7:
            adv.append(f"Outstanding community rating ({it.rating}★)")
        elif not it.rating:
            lim.append("No public community rating score available")
        if it.author_or_channel:
            adv.append(f"Produced by reputable creator: {it.author_or_channel}")
        if not adv:
            adv.append(f"Comprehensive resource from {it.source}")
        if not lim:
            lim.append("May require prior foundational knowledge")
            
        advantages[it.id] = adv
        limitations[it.id] = lim

    # Identify best overall and best value
    best_overall = max(items, key=lambda x: (x.match_score or 0) + (x.rating or 0) * 10).id
    best_value = next((it.id for it in items if it.price and "free" in it.price.lower()), items[0].id)

    summary = (
        f"Comparing {len(items)} resources across {', '.join(set(it.source for it in items))}. "
        f"Each option offers distinct trade-offs between depth, accessibility, and format."
    )

    analysis = ComparisonAnalysis(
        summary=summary,
        best_overall_id=best_overall,
        best_value_id=best_value,
        advantages=advantages,
        limitations=limitations
    )

    return CompareResponse(
        items=items,
        features=features,
        analysis=analysis
    )
