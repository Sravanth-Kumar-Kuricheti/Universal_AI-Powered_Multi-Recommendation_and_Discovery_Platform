import httpx
import logging
from typing import List
from app.connectors.base import BaseConnector
from app.schemas.recommendation import RecommendationItem
from app.utils.helpers import generate_item_id, get_iso_now
from app.utils.validators import is_valid_url

logger = logging.getLogger("recomind.connector.wikipedia")

class WikipediaConnector(BaseConnector):
    name: str = "Wikipedia"
    category: str = "articles"
    is_keyless: bool = True
    requires_key: bool = False
    attribution_url: str = "https://en.wikipedia.org"
    description: str = "Free encyclopedia articles and knowledge references"

    async def search(self, query: str, limit: int = 10, **kwargs) -> List[RecommendationItem]:
        results: List[RecommendationItem] = []
        url = "https://en.wikipedia.org/w/api.php"
        params = {
            "action": "opensearch",
            "search": query,
            "limit": limit,
            "namespace": 0,
            "format": "json"
        }
        headers = {"User-Agent": "RecoMindAI/1.0 (info@recomind.ai)"}

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.get(url, headers=headers, params=params)
                if resp.status_code == 200:
                    data = resp.json()
                    # data is [query, [titles], [descriptions], [urls]]
                    if len(data) >= 4:
                        titles = data[1]
                        descriptions = data[2]
                        urls = data[3]
                        for title, desc, link in zip(titles, descriptions, urls):
                            if not is_valid_url(link) or "may refer to:" in desc:
                                continue
                            
                            results.append(
                                RecommendationItem(
                                    id=generate_item_id("wikipedia", title),
                                    title=title,
                                    description=desc or f"Comprehensive overview on {title}",
                                    category="articles",
                                    source="Wikipedia",
                                    url=link,
                                    image_url="https://upload.wikimedia.org/wikipedia/commons/8/80/Wikipedia-logo-v2.svg",
                                    rating=4.5,
                                    price="Free",
                                    tags=["Encyclopedia", "Reference", "Knowledge"],
                                    retrieved_at=get_iso_now()
                                )
                            )
                    self.record_success()
        except Exception as e:
            logger.error(f"Wikipedia connector error: {e}")
            self.record_failure()

        return results[:limit]
