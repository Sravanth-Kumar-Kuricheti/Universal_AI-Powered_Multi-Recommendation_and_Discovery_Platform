import httpx
import logging
from typing import List
from app.connectors.base import BaseConnector
from app.schemas.recommendation import RecommendationItem
from app.utils.helpers import generate_item_id, extract_domain, get_iso_now
from app.utils.validators import is_valid_url, clean_html

logger = logging.getLogger("recomind.connector.tavily")

class TavilySearchConnector(BaseConnector):
    name: str = "Tavily AI Search"
    category: str = "other"
    is_keyless: bool = False
    requires_key: bool = True
    attribution_url: str = "https://tavily.com"
    description: str = "AI-optimized web search engine (1,000 free searches/month)"

    async def search(self, query: str, limit: int = 10, **kwargs) -> List[RecommendationItem]:
        results: List[RecommendationItem] = []
        if not self.api_key:
            return results

        url = "https://api.tavily.com/search"
        payload = {
            "api_key": self.api_key,
            "query": query,
            "search_depth": "basic",
            "include_images": True,
            "max_results": limit
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.post(url, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    images = data.get("images", [])
                    img_idx = 0
                    for item in data.get("results", []):
                        link = item.get("url")
                        if not is_valid_url(link):
                            continue
                        
                        domain = extract_domain(link)
                        title = clean_html(item.get("title", ""))
                        content = clean_html(item.get("content", ""))
                        
                        # Match image if available
                        img_url = images[img_idx] if img_idx < len(images) else None
                        img_idx += 1

                        # Determine dynamic category for rich filtering
                        link_lower = link.lower()
                        title_lower = title.lower()
                        if any(w in link_lower or w in title_lower for w in ["laptop", "phone", "mobile", "tv", "camera", "price", "buy", "product", "gadget", "amazon", "flipkart", "specs", "review"]):
                            item_cat = "products"
                        elif any(w in link_lower or w in title_lower for w in ["article", "blog", "guide", "news", "post"]):
                            item_cat = "articles"
                        elif any(w in link_lower or w in title_lower for w in ["course", "tutorial", "curriculum", "learn"]):
                            item_cat = "courses"
                        elif any(w in link_lower or w in title_lower for w in ["job", "career", "hiring", "salary"]):
                            item_cat = "jobs"
                        elif any(w in link_lower or w in title_lower for w in ["tool", "software", "app", "platform"]):
                            item_cat = "tools"
                        elif any(w in link_lower or w in title_lower for w in ["movie", "film", "cinema", "show", "series"]):
                            item_cat = "movies"
                        elif any(w in link_lower or w in title_lower for w in ["book", "novel", "author", "read"]):
                            item_cat = "books"
                        else:
                            item_cat = "other"

                        results.append(
                            RecommendationItem(
                                id=generate_item_id("tavily", link),
                                title=title or f"Web Resource from {domain}",
                                description=content[:240] if content else f"Web discovery result for {query}",
                                category=item_cat,
                                source=f"{domain.capitalize() if domain else 'Web'}",
                                url=link,
                                image_url=img_url,
                                rating=4.5,
                                price="Free / Open Web",
                                tags=[domain] if domain else ["Web"],
                                retrieved_at=get_iso_now()
                            )
                        )
                    self.record_success()
                    return results[:limit]
                else:
                    logger.warning(f"Tavily API responded with status {resp.status_code}")
                    self.record_failure()
        except Exception as e:
            logger.error(f"Tavily connector error: {e}")
            self.record_failure()

        return results[:limit]
