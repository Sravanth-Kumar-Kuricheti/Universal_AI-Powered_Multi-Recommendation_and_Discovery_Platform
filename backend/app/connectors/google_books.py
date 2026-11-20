import httpx
import logging
from typing import List
from app.connectors.base import BaseConnector
from app.schemas.recommendation import RecommendationItem
from app.utils.helpers import generate_item_id, get_iso_now
from app.utils.validators import is_valid_url

logger = logging.getLogger("recomind.connector.googlebooks")

class GoogleBooksConnector(BaseConnector):
    name: str = "Google Books"
    category: str = "books"
    is_keyless: bool = True
    requires_key: bool = False
    attribution_url: str = "https://books.google.com"
    description: str = "Worldwide collection of print and digital books"

    async def search(self, query: str, limit: int = 10, **kwargs) -> List[RecommendationItem]:
        results: List[RecommendationItem] = []
        clean_q = query.replace("books", "").replace("best", "").strip() or query
        url = "https://www.googleapis.com/books/v1/volumes"
        params = {"q": clean_q, "maxResults": min(limit, 20)}
        if self.api_key:
            params["key"] = self.api_key

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.get(url, params=params)
                if resp.status_code == 200:
                    data = resp.json()
                    for item in data.get("items", []):
                        v_info = item.get("volumeInfo", {})
                        title = v_info.get("title")
                        info_link = v_info.get("infoLink") or v_info.get("previewLink")
                        if not title or not is_valid_url(info_link):
                            continue

                        authors = v_info.get("authors", [])
                        author_str = ", ".join(authors[:2]) if authors else "Author"
                        desc = v_info.get("description") or f"A comprehensive book on {title} by {author_str}."
                        # Truncate description cleanly
                        if len(desc) > 220:
                            desc = desc[:217] + "..."

                        img_links = v_info.get("imageLinks", {})
                        thumbnail = img_links.get("thumbnail") or img_links.get("smallThumbnail")
                        if thumbnail and thumbnail.startswith("http://"):
                            thumbnail = thumbnail.replace("http://", "https://")

                        rating = v_info.get("averageRating")
                        cats = v_info.get("categories", [])
                        tags = ["Book"] + cats

                        results.append(
                            RecommendationItem(
                                id=generate_item_id("gbooks", item.get("id")),
                                title=title,
                                description=desc,
                                category="books",
                                source="Google Books",
                                url=info_link,
                                image_url=thumbnail,
                                rating=round(float(rating), 1) if rating else 4.4,
                                price="Preview Available",
                                tags=tags[:5],
                                published_date=v_info.get("publishedDate"),
                                author_or_channel=author_str,
                                level="All Levels",
                                retrieved_at=get_iso_now()
                            )
                        )
                    self.record_success()
        except Exception as e:
            logger.error(f"Google Books connector error: {e}")
            self.record_failure()

        return results[:limit]
