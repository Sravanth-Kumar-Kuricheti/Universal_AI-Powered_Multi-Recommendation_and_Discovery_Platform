import httpx
import logging
from typing import List
from app.connectors.base import BaseConnector
from app.schemas.recommendation import RecommendationItem
from app.utils.helpers import generate_item_id, extract_domain, get_iso_now
from app.utils.validators import is_valid_url, clean_html

logger = logging.getLogger("recomind.connector.brave")

class BraveSearchConnector(BaseConnector):
    name: str = "Brave Search"
    category: str = "other"
    is_keyless: bool = True
    requires_key: bool = False
    attribution_url: str = "https://search.brave.com"
    description: str = "Web search engine providing real-time web results"

    async def search(self, query: str, limit: int = 10, **kwargs) -> List[RecommendationItem]:
        results: List[RecommendationItem] = []
        headers = {
            "Accept": "application/json",
            "User-Agent": "RecoMindAI/1.0 (Universal Recommendation Platform)"
        }
        
        # 1. If official Brave API Key is provided
        if self.api_key:
            headers["X-Subscription-Token"] = self.api_key
            url = "https://api.search.brave.com/res/v1/web/search"
            params = {"q": query, "count": limit}
            try:
                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    resp = await client.get(url, headers=headers, params=params)
                    if resp.status_code == 200:
                        data = resp.json()
                        web_results = data.get("web", {}).get("results", [])
                        for item in web_results:
                            link = item.get("url")
                            if not is_valid_url(link):
                                continue
                            domain = extract_domain(link)
                            results.append(
                                RecommendationItem(
                                    id=generate_item_id("brave", link),
                                    title=clean_html(item.get("title", "")),
                                    description=clean_html(item.get("description", "")),
                                    category="articles" if "article" in link or "blog" in link else "other",
                                    source=f"{domain.capitalize() if domain else 'Web'}",
                                    url=link,
                                    image_url=item.get("thumbnail", {}).get("src"),
                                    tags=[domain] if domain else ["web"],
                                    published_date=item.get("page_age"),
                                    retrieved_at=get_iso_now()
                                )
                            )
                        self.record_success()
                        return results[:limit]
            except Exception as e:
                logger.warning(f"Brave API key call failed, falling back to keyless search: {e}")
                self.record_failure()

        # 2. Keyless Public Web Discovery Fallback (DuckDuckGo instant answer / keyless API)
        try:
            ddg_url = "https://api.duckduckgo.com/"
            params = {"q": query, "format": "json", "no_html": 1, "skip_disambig": 1}
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.get(ddg_url, headers=headers, params=params)
                if resp.status_code == 200:
                    data = resp.json()
                    # Check RelatedTopics
                    topics = data.get("RelatedTopics", [])
                    for t in topics:
                        if isinstance(t, dict) and "FirstURL" in t and "Text" in t:
                            link = t["FirstURL"]
                            if not is_valid_url(link):
                                continue
                            text = t["Text"]
                            title = text.split(" - ")[0] if " - " in text else text[:60]
                            desc = text.split(" - ")[1] if " - " in text else text
                            icon = t.get("Icon", {}).get("URL")
                            img_url = f"https://duckduckgo.com{icon}" if icon and icon.startswith("/") else icon
                            domain = extract_domain(link)
                            results.append(
                                RecommendationItem(
                                    id=generate_item_id("web", link),
                                    title=title,
                                    description=desc,
                                    category="articles" if any(w in link for w in ["blog", "article", "news"]) else "other",
                                    source=domain.capitalize() if domain else "Web",
                                    url=link,
                                    image_url=img_url if is_valid_url(img_url) else None,
                                    tags=[domain] if domain else ["web"],
                                    retrieved_at=get_iso_now()
                                )
                            )
                    self.record_success()
        except Exception as e:
            logger.error(f"Keyless web search error: {e}")
            self.record_failure()

        return results[:limit]
