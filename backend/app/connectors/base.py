import abc
import httpx
import logging
from typing import List, Optional
from app.schemas.recommendation import RecommendationItem

logger = logging.getLogger("recomind.connector")

class BaseConnector(abc.ABC):
    name: str = "BaseConnector"
    category: str = "other"
    is_keyless: bool = False
    requires_key: bool = False
    attribution_url: str = "https://example.com"
    description: str = "Base connector interface"

    def __init__(self, api_key: Optional[str] = None, timeout: float = 6.0):
        self.api_key = api_key or ""
        self.timeout = timeout
        self.failed_attempts = 0

    def is_available(self) -> bool:
        if self.requires_key and not self.api_key:
            return False
        return True

    def record_failure(self):
        self.failed_attempts += 1

    def record_success(self):
        self.failed_attempts = 0

    @abc.abstractmethod
    async def search(self, query: str, limit: int = 10, **kwargs) -> List[RecommendationItem]:
        """Perform search and return normalized RecommendationItem instances."""
        pass
