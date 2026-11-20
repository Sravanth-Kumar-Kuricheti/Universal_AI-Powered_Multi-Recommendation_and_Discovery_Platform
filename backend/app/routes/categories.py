from fastapi import APIRouter
from typing import List, Dict, Any

router = APIRouter(tags=["Categories"])

CATEGORIES_META = [
    {"id": "courses", "name": "Courses & Learning", "icon": "GraduationCap", "description": "Accredited online courses, certifications, and university degrees"},
    {"id": "products", "name": "Products & Shopping", "icon": "ShoppingBag", "description": "Electronics, laptops, gadgets, and consumer goods"},
    {"id": "movies", "name": "Movies & Entertainment", "icon": "Film", "description": "Feature films, TV shows, streaming reviews, and cinema"},
    {"id": "books", "name": "Books & Reading", "icon": "BookOpen", "description": "Global libraries, literature, textbooks, and reading guides"},
    {"id": "jobs", "name": "Jobs & Careers", "icon": "Briefcase", "description": "Career opportunities, fresher roles, and remote work"},
    {"id": "tools", "name": "AI Tools & Resources", "icon": "Sparkles", "description": "AI utilities, machine learning platforms, and productivity software"},
    {"id": "travel", "name": "Travel & Places", "icon": "Compass", "description": "Destinations, city guides, attractions, and cultural landmarks"},
    {"id": "food", "name": "Food & Restaurants", "icon": "Utensils", "description": "Cuisine guides, culinary discoveries, and dining experiences"},
    {"id": "videos", "name": "Videos & Tutorials", "icon": "Video", "description": "High-definition video lectures, tutorials, and walkthroughs"},
    {"id": "projects", "name": "Developer Resources", "icon": "Code", "description": "Open source GitHub repositories, SDKs, and engineering tools"},
    {"id": "articles", "name": "Research & Articles", "icon": "FileText", "description": "arXiv papers, technical encyclopedias, and news analyses"},
]

@router.get("/categories")
async def get_categories():
    return {"categories": CATEGORIES_META}
