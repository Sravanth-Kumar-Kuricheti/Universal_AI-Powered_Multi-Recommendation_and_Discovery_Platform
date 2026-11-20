import httpx
import logging
from typing import List
from app.connectors.base import BaseConnector
from app.schemas.recommendation import RecommendationItem
from app.utils.helpers import generate_item_id, get_iso_now, extract_domain
from app.utils.validators import is_valid_url

logger = logging.getLogger("recomind.connector.news")

class NewsConnector(BaseConnector):
    name: str = "Hacker News & Tech Pulse"
    category: str = "articles"
    is_keyless: bool = True
    requires_key: bool = False
    attribution_url: str = "https://news.ycombinator.com"
    description: str = "Real-time tech articles, discussions, launches, and industry breakthroughs"

    async def search(self, query: str, limit: int = 10, **kwargs) -> List[RecommendationItem]:
        results: List[RecommendationItem] = []
        clean_q = query.strip()
        url = "https://hn.algolia.com/api/v1/search"
        params = {"query": clean_q, "tags": "story", "hitsPerPage": limit}

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.get(url, params=params)
                if resp.status_code == 200:
                    data = resp.json()
                    for hit in data.get("hits", []):
                        story_url = hit.get("url") or f"https://news.ycombinator.com/item?id={hit.get('objectID')}"
                        if not is_valid_url(story_url):
                            continue
                        
                        title = hit.get("title")
                        if not title:
                            continue
                        
                        points = hit.get("points", 0)
                        author = hit.get("author", "Community")
                        num_comments = hit.get("num_comments", 0)
                        domain = extract_domain(story_url)
                        
                        rating_val = min(5.0, round(3.8 + (points / 200.0) * 1.2, 1)) if points > 0 else 4.0

                        results.append(
                            RecommendationItem(
                                id=generate_item_id("hn", str(hit.get("objectID"))),
                                title=title,
                                description=f"Discussion and deep dive: {points} points, {num_comments} comments on Hacker News. Source: {domain}",
                                category="articles",
                                source=f"{domain.capitalize() if domain else 'Hacker News'}",
                                url=story_url,
                                image_url="https://news.ycombinator.com/favicon.ico",
                                rating=rating_val,
                                price="Free",
                                tags=["Tech News", "Discussion", domain] if domain else ["Tech News"],
                                published_date=hit.get("created_at", "")[:10],
                                author_or_channel=author,
                                retrieved_at=get_iso_now()
                            )
                        )
                    self.record_success()
        except Exception as e:
            logger.error(f"Hacker News connector error: {e}")
            self.record_failure()

        return results[:limit]
