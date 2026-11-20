import io
import csv
from typing import List
from app.schemas.recommendation import RecommendationItem

def export_items_to_csv(items: List[RecommendationItem]) -> str:
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Headers
    writer.writerow([
        "Title",
        "Source",
        "Category",
        "RecoMind Match Score",
        "Official Rating",
        "Price",
        "Level",
        "Duration",
        "URL",
        "Description"
    ])
    
    for it in items:
        writer.writerow([
            it.title or "",
            it.source or "",
            it.category or "",
            f"{it.match_score}%" if it.match_score else "",
            it.rating or "",
            it.price or "",
            it.level or "",
            it.duration or "",
            it.url or "",
            (it.description or "").replace("\n", " ")
        ])
        
    return output.getvalue()
