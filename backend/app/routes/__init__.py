from app.routes.health import router as health_router
from app.routes.providers import router as providers_router
from app.routes.search import router as search_router
from app.routes.recommendations import router as recommendations_router
from app.routes.categories import router as categories_router
from app.routes.videos import router as videos_router
from app.routes.compare import router as compare_router
from app.routes.assistant import router as assistant_router

__all__ = [
    "health_router",
    "providers_router",
    "search_router",
    "recommendations_router",
    "categories_router",
    "videos_router",
    "compare_router",
    "assistant_router",
]
