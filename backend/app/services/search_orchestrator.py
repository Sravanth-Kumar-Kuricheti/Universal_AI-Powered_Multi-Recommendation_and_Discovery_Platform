import asyncio
import logging
from typing import List, Dict, Any, Tuple
from app.config import settings
from app.connectors import (
    BaseConnector,
    BraveSearchConnector,
    GitHubConnector,
    HuggingFaceConnector,
    YouTubeConnector,
    OpenLibraryConnector,
    GoogleBooksConnector,
    WikipediaConnector,
    ArxivConnector,
    TMDBConnector,
    CourseConnector,
    TravelConnector,
    PexelsConnector,
    MediaSearchConnector,
    TavilySearchConnector,
    NewsConnector
)
from app.schemas.recommendation import RecommendationItem
from app.schemas.search import SearchRequest, SearchResponse, SearchIntent, SearchFilters
from app.services.query_analyzer import query_analyzer
from app.services.suggestion_engine import suggestion_engine
from app.recommender.hybrid_recommender import hybrid_recommender
from app.recommender.diversity_ranker import diversity_ranker
from app.utils.validators import is_valid_url
from app.utils.helpers import get_iso_now

logger = logging.getLogger("recomind.orchestrator")

class SearchOrchestrator:
    def __init__(self):
        # Initialize connectors with optional API credentials
        self.connectors: Dict[str, BaseConnector] = {
            "tavily": TavilySearchConnector(api_key=settings.TAVILY_API_KEY),
            "brave": BraveSearchConnector(api_key=settings.BRAVE_API_KEY),
            "media": MediaSearchConnector(
                unsplash_key=settings.UNSPLASH_ACCESS_KEY,
                pixabay_key=settings.PIXABAY_API_KEY,
                pexels_key=settings.PEXELS_API_KEY
            ),
            "github": GitHubConnector(api_key=settings.GITHUB_TOKEN),
            "huggingface": HuggingFaceConnector(api_key=settings.HUGGINGFACE_TOKEN),
            "youtube": YouTubeConnector(api_key=settings.YOUTUBE_API_KEY),
            "open_library": OpenLibraryConnector(),
            "google_books": GoogleBooksConnector(),
            "wikipedia": WikipediaConnector(),
            "arxiv": ArxivConnector(),
            "tmdb": TMDBConnector(api_key=settings.TMDB_API_KEY),
            "courses": CourseConnector(),
            "travel": TravelConnector(),
            "pexels": PexelsConnector(api_key=settings.PEXELS_API_KEY),
            "news": NewsConnector(),
        }

    def select_connectors(self, intent: SearchIntent, requested_cat: str) -> List[Tuple[str, BaseConnector]]:
        selected: List[Tuple[str, BaseConnector]] = []
        cats = [c.lower() for c in intent.categories]
        if requested_cat and requested_cat != "all":
            cats.insert(0, requested_cat.lower())

        q_lower = intent.query.lower()

        # Specific category routing
        if "courses" in cats or "learning" in q_lower or "tutorial" in q_lower:
            selected.extend([("courses", self.connectors["courses"]), ("youtube", self.connectors["youtube"]), ("github", self.connectors["github"]), ("wikipedia", self.connectors["wikipedia"])])
        
        if "projects" in cats or "tools" in cats or "code" in q_lower or "python" in q_lower:
            selected.extend([("github", self.connectors["github"]), ("huggingface", self.connectors["huggingface"]), ("news", self.connectors["news"])])

        if "books" in cats or "reading" in q_lower:
            selected.extend([("open_library", self.connectors["open_library"]), ("google_books", self.connectors["google_books"]), ("wikipedia", self.connectors["wikipedia"])])

        if "movies" in cats or "entertainment" in q_lower or "film" in q_lower:
            selected.extend([("tmdb", self.connectors["tmdb"]), ("youtube", self.connectors["youtube"]), ("wikipedia", self.connectors["wikipedia"])])

        if "articles" in cats or "research" in q_lower or "paper" in q_lower:
            selected.extend([("arxiv", self.connectors["arxiv"]), ("news", self.connectors["news"]), ("wikipedia", self.connectors["wikipedia"])])

        if "travel" in cats or "places" in q_lower or "visit" in q_lower:
            selected.extend([("travel", self.connectors["travel"]), ("wikipedia", self.connectors["wikipedia"]), ("media", self.connectors["media"])])

        if "videos" in cats or intent.include_videos:
            selected.append(("youtube", self.connectors["youtube"]))

        if "images" in cats:
            selected.append(("media", self.connectors["media"]))

        # Always include web discovery and general fallback
        selected.append(("tavily", self.connectors["tavily"]))
        selected.append(("brave", self.connectors["brave"]))
        selected.append(("wikipedia", self.connectors["wikipedia"]))
        selected.append(("media", self.connectors["media"]))

        # Deduplicate while preserving order
        seen = set()
        deduped = []
        for name, conn in selected:
            if name not in seen and conn.is_available():
                seen.add(name)
                deduped.append((name, conn))
        return deduped

    async def execute_search(self, request: SearchRequest) -> SearchResponse:
        query = request.query.strip()
        requested_cat = (request.category or "all").lower()

        # 1. Analyze query intent
        intent = await query_analyzer.analyze(query, requested_cat)
        
        # 2. Select targeted connectors
        active_connectors = self.select_connectors(intent, requested_cat)

        # 3. Execute concurrent API queries with timeout bounds
        tasks = []
        connector_names = []
        for name, connector in active_connectors:
            connector_names.append(name)
            tasks.append(asyncio.wait_for(connector.search(query, limit=12), timeout=8.0))

        results_by_provider = await asyncio.gather(*tasks, return_exceptions=True)

        raw_items: List[RecommendationItem] = []
        provider_status: Dict[str, str] = {}

        for name, res in zip(connector_names, results_by_provider):
            if isinstance(res, Exception):
                logger.warning(f"Provider {name} returned error: {res}")
                provider_status[name] = "error"
            elif isinstance(res, list):
                if res:
                    provider_status[name] = f"success ({len(res)} items)"
                    raw_items.extend(res)
                else:
                    provider_status[name] = "no_results"
            else:
                provider_status[name] = "unavailable"

        # 4. Filter by valid URLs and sanitize
        valid_items = [it for it in raw_items if is_valid_url(it.url)]

        # 5. Apply Hybrid Recommendation Ranking & Scoring
        scored_items = hybrid_recommender.rank_and_score(query, valid_items, intent, request.filters)

        # 6. Apply Diversity & Deduplication
        diversified_items = diversity_ranker.re_rank(scored_items)

        # 7. Compute actual category counts
        category_counts: Dict[str, int] = {"all": len(diversified_items)}
        for it in diversified_items:
            cat = it.category.lower() if it.category else "other"
            category_counts[cat] = category_counts.get(cat, 0) + 1

        # 8. Filter by requested category tab if not 'all'
        filtered_items = diversified_items
        if requested_cat and requested_cat != "all":
            filtered_items = [it for it in filtered_items if it.category.lower() == requested_cat]

        # 9. Apply dynamic user filters
        if request.filters:
            f = request.filters
            if f.price:
                filtered_items = [it for it in filtered_items if it.price and f.price.lower() in it.price.lower()]
            if f.level:
                filtered_items = [it for it in filtered_items if it.level and f.level.lower() in it.level.lower()]
            if f.min_rating:
                filtered_items = [it for it in filtered_items if it.rating and it.rating >= f.min_rating]
            if f.source:
                filtered_items = [it for it in filtered_items if it.source and f.source.lower() in it.source.lower()]

        # 10. Apply sorting
        sort_mode = request.sort or "relevance"
        if sort_mode == "rating":
            filtered_items.sort(key=lambda x: (x.rating or 0), reverse=True)
        elif sort_mode == "match":
            filtered_items.sort(key=lambda x: (x.match_score or 0), reverse=True)
        elif sort_mode == "date":
            filtered_items.sort(key=lambda x: (x.published_date or ""), reverse=True)

        # 11. Pagination
        total_results = len(filtered_items)
        page = request.page
        page_size = request.page_size
        total_pages = max(1, (total_results + page_size - 1) // page_size)
        start_idx = (page - 1) * page_size
        paginated_items = filtered_items[start_idx : start_idx + page_size]

        # 12. Generate AI Suggestions & Explanations
        suggestions = await suggestion_engine.generate_suggestions(query, intent, diversified_items[:5])

        sources = list({it.source for it in diversified_items if it.source})

        return SearchResponse(
            query=query,
            intent=intent,
            categories=intent.categories,
            results=paginated_items,
            category_counts=category_counts,
            total_results=total_results,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
            sources=sources,
            provider_status=provider_status,
            suggestions=suggestions,
            retrieval_timestamp=get_iso_now()
        )

search_orchestrator = SearchOrchestrator()
