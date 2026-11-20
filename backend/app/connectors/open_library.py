import httpx
import logging
from typing import List
from app.connectors.base import BaseConnector
from app.schemas.recommendation import RecommendationItem
from app.utils.helpers import generate_item_id, get_iso_now
from app.utils.validators import is_valid_url

logger = logging.getLogger("recomind.connector.openlibrary")

class OpenLibraryConnector(BaseConnector):
    name: str = "Open Library"
    category: str = "books"
    is_keyless: bool = True
    requires_key: bool = False
    attribution_url: str = "https://openlibrary.org"
    description: str = "Open, editable library catalog of millions of books"

    async def search(self, query: str, limit: int = 10, **kwargs) -> List[RecommendationItem]:
        results: List[RecommendationItem] = []
        clean_q = query.replace("best books", "").replace("books", "").strip() or query
        url = "https://openlibrary.org/search.json"
        params = {"q": clean_q, "limit": limit}
        headers = {"User-Agent": "RecoMindAI/1.0"}

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.get(url, headers=headers, params=params)
                if resp.status_code == 200:
                    data = resp.json()
                    for doc in data.get("docs", []):
                        key = doc.get("key")
                        title = doc.get("title")
                        if not key or not title:
                            continue
                        
                        book_url = f"https://openlibrary.org{key}"
                        authors = doc.get("author_name", [])
                        author_str = ", ".join(authors[:2]) if authors else "Unknown Author"
                        
                        cover_id = doc.get("cover_i")
                        cover_url = f"https://covers.openlibrary.org/b/id/{cover_id}-M.jpg" if cover_id else None
                        
                        rating_avg = doc.get("ratings_average")
                        pub_year = doc.get("first_publish_year")
                        
                        subjects = doc.get("subject", [])[:4]
                        tags = ["Book"] + subjects
                        
                        results.append(
                            RecommendationItem(
                                id=generate_item_id("openlibrary", key),
                                title=title,
                                description=f"By {author_str}. Published in {pub_year or 'N/A'}. A notable title in {subjects[0] if subjects else 'literature'}.",
                                category="books",
                                source="Open Library",
                                url=book_url,
                                image_url=cover_url,
                                rating=round(float(rating_avg), 1) if rating_avg else 4.2,
                                price="Free / Borrow",
                                tags=tags[:5],
                                published_date=str(pub_year) if pub_year else None,
                                author_or_channel=author_str,
                                level="All Levels",
                                retrieved_at=get_iso_now()
                            )
                        )
                    self.record_success()
        except Exception as e:
            logger.error(f"Open Library connector error: {e}")
            self.record_failure()

        return results[:limit]
