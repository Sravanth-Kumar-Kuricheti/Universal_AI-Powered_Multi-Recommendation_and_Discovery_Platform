import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import init_db
from app.utils.error_handler import global_exception_handler
from app.routes import (
    health_router,
    providers_router,
    search_router,
    recommendations_router,
    categories_router,
    videos_router,
    compare_router,
    assistant_router,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("recomind.main")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Universal AI-Powered Multi-Recommendation & Discovery Platform API"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
app.add_exception_handler(Exception, global_exception_handler)

# Register API routers
app.include_router(health_router, prefix=settings.API_V1_PREFIX)
app.include_router(providers_router, prefix=settings.API_V1_PREFIX)
app.include_router(search_router, prefix=settings.API_V1_PREFIX)
app.include_router(recommendations_router, prefix=settings.API_V1_PREFIX)
app.include_router(categories_router, prefix=settings.API_V1_PREFIX)
app.include_router(videos_router, prefix=settings.API_V1_PREFIX)
app.include_router(compare_router, prefix=settings.API_V1_PREFIX)
app.include_router(assistant_router, prefix=settings.API_V1_PREFIX)

@app.on_event("startup")
async def on_startup():
    logger.info("Initializing RecoMind AI database and connectors...")
    try:
        init_db()
        logger.info("Database initialized successfully.")
    except Exception as e:
        logger.error(f"Error initializing database: {e}")

@app.get("/")
async def root():
    return {
        "service": settings.PROJECT_NAME,
        "tagline": "Discover Everything. Find What Fits You.",
        "docs": "/docs",
        "api_health": f"{settings.API_V1_PREFIX}/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
