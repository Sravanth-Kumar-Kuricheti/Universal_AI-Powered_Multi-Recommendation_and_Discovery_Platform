from fastapi import Request
from fastapi.responses import JSONResponse
import logging

logger = logging.getLogger("recomind")

async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception on {request.url}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "An internal error occurred. Our discovery engine continues to operate with active sources.",
            "error_type": exc.__class__.__name__
        }
    )
