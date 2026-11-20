import re
import logging
from typing import List
from app.schemas.search import SearchIntent
from app.services.groq_service import groq_service

logger = logging.getLogger("recomind.query_analyzer")

CATEGORY_KEYWORDS = {
    "courses": ["course", "courses", "learn", "learning", "tutorial", "certification", "class", "training", "degree", "curriculum", "study", "bootcamp"],
    "videos": ["video", "videos", "watch", "youtube", "lecture", "talk", "demo", "stream", "visual tutorial"],
    "books": ["book", "books", "read", "author", "novel", "textbook", "paperback", "audiobook", "library"],
    "tools": ["tool", "tools", "software", "app", "utility", "platform", "ide", "editor", "extension", "framework", "library"],
    "projects": ["project", "projects", "github", "repo", "repository", "code", "open source", "source code", "script"],
    "articles": ["article", "articles", "paper", "research", "arxiv", "documentation", "blog", "guide", "news"],
    "movies": ["movie", "movies", "film", "films", "cinema", "series", "tv", "show", "watch", "actor", "hollywood", "netflix"],
    "travel": ["travel", "visit", "place", "city", "country", "destination", "tourism", "hotel", "explore", "vacation"],
    "jobs": ["job", "jobs", "career", "hiring", "salary", "internship", "vacancy", "role", "fresher", "remote"],
    "products": ["laptop", "laptops", "phone", "phones", "mobile", "camera", "headphone", "monitor", "gadget", "price", "under", "buy", "specs", "product", "shoe", "brand"]
}

class QueryAnalyzer:
    async def analyze(self, query: str, user_category: str = "all") -> SearchIntent:
        clean_q = query.strip()
        
        # 1. Try Groq AI Query Analysis
        if groq_service.is_available():
            system_prompt = (
                "You are the RecoMind AI Query Understanding Engine. Analyze the user's natural language query and output a JSON object with: "
                "query (string), intent (string e.g. learning_recommendation, product_discovery, entertainment, technical_research), "
                "categories (array of strings from: courses, videos, articles, books, tools, jobs, projects, communities, products, travel, movies, other), "
                "keywords (array of key extracted entities/nouns), price ('free', 'paid', or null), level ('beginner', 'intermediate', 'advanced', or null), "
                "location (string or null), include_videos (boolean)."
            )
            user_prompt = f"User query: '{clean_q}'"
            ai_data = await groq_service.generate_json(system_prompt, user_prompt)
            if ai_data and "intent" in ai_data and "categories" in ai_data:
                cats = ai_data.get("categories", [])
                if user_category and user_category != "all" and user_category not in cats:
                    cats.insert(0, user_category)
                return SearchIntent(
                    query=clean_q,
                    intent=ai_data.get("intent", "general_discovery"),
                    categories=cats if cats else ["other"],
                    keywords=ai_data.get("keywords", [w for w in clean_q.split() if len(w) > 3]),
                    price=ai_data.get("price"),
                    level=ai_data.get("level"),
                    location=ai_data.get("location"),
                    include_videos=bool(ai_data.get("include_videos", False))
                )

        # 2. Deterministic Query Parsing Engine Fallback
        q_lower = clean_q.lower()
        detected_categories: List[str] = []
        
        if user_category and user_category != "all":
            detected_categories.append(user_category)

        for cat, keywords in CATEGORY_KEYWORDS.items():
            if any(re.search(rf"\b{re.escape(k)}\b", q_lower) for k in keywords):
                if cat not in detected_categories:
                    detected_categories.append(cat)

        if not detected_categories:
            if any(w in q_lower for w in ["laptop", "phone", "price", "under", "buy", "cost", "gadget", "specs", "review"]):
                detected_categories = ["products", "articles", "other"]
            else:
                detected_categories = ["articles", "tools", "other"]

        # Detect price constraint
        price = None
        if "free" in q_lower or "zero cost" in q_lower or "without paying" in q_lower:
            price = "free"
        elif "paid" in q_lower or "premium" in q_lower:
            price = "paid"
        elif "under" in q_lower or "below" in q_lower or "₹" in q_lower or "$" in q_lower:
            price = "budget_constrained"

        # Detect skill level
        level = None
        if "beginner" in q_lower or "fresher" in q_lower or "starter" in q_lower or "intro" in q_lower:
            level = "beginner"
        elif "intermediate" in q_lower or "mid" in q_lower:
            level = "intermediate"
        elif "advanced" in q_lower or "expert" in q_lower or "senior" in q_lower or "master" in q_lower:
            level = "advanced"

        # Detect video preference
        include_videos = "video" in q_lower or "watch" in q_lower or "youtube" in q_lower or "courses" in detected_categories

        # Detect location
        location = None
        loc_match = re.search(r'\bin\s+([A-Za-z\s]+)$', clean_q)
        if loc_match:
            location = loc_match.group(1).strip()

        # Extract meaningful keywords
        stopwords = {"best", "the", "for", "with", "and", "under", "in", "of", "a", "an", "to", "like", "how"}
        words = re.findall(r'\b[A-Za-z0-9+#.-]+\b', clean_q)
        keywords = [w for w in words if w.lower() not in stopwords and len(w) > 2]

        return SearchIntent(
            query=clean_q,
            intent="learning_recommendation" if "courses" in detected_categories else "general_discovery",
            categories=detected_categories,
            keywords=keywords,
            price=price,
            level=level,
            location=location,
            include_videos=include_videos
        )

query_analyzer = QueryAnalyzer()
