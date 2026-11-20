import httpx
import logging
import xml.etree.ElementTree as ET
from typing import List
from app.connectors.base import BaseConnector
from app.schemas.recommendation import RecommendationItem
from app.utils.helpers import generate_item_id, get_iso_now
from app.utils.validators import is_valid_url

logger = logging.getLogger("recomind.connector.arxiv")

class ArxivConnector(BaseConnector):
    name: str = "arXiv"
    category: str = "articles"
    is_keyless: bool = True
    requires_key: bool = False
    attribution_url: str = "https://arxiv.org"
    description: str = "Open-access archive for 2+ million scientific papers in AI, CS, and science"

    async def search(self, query: str, limit: int = 10, **kwargs) -> List[RecommendationItem]:
        results: List[RecommendationItem] = []
        clean_q = query.replace("papers", "").replace("research", "").replace("articles", "").strip() or query
        url = "https://export.arxiv.org/api/query"
        params = {
            "search_query": f"all:{clean_q}",
            "start": 0,
            "max_results": limit,
            "sortBy": "relevance",
            "sortOrder": "descending"
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.get(url, params=params)
                if resp.status_code == 200:
                    root = ET.fromstring(resp.text)
                    ns = {"atom": "http://www.w3.org/2005/Atom"}
                    
                    for entry in root.findall("atom:entry", ns):
                        title_el = entry.find("atom:title", ns)
                        summary_el = entry.find("atom:summary", ns)
                        id_el = entry.find("atom:id", ns)
                        published_el = entry.find("atom:published", ns)
                        
                        if title_el is None or id_el is None:
                            continue

                        title = " ".join(title_el.text.split())
                        summary = " ".join((summary_el.text or "").split())
                        if len(summary) > 230:
                            summary = summary[:227] + "..."
                        
                        paper_url = id_el.text.strip()
                        if not is_valid_url(paper_url):
                            continue
                        
                        authors = [a.find("atom:name", ns).text for a in entry.findall("atom:author", ns) if a.find("atom:name", ns) is not None]
                        author_str = ", ".join(authors[:2]) if authors else "Researchers"
                        
                        results.append(
                            RecommendationItem(
                                id=generate_item_id("arxiv", paper_url),
                                title=title,
                                description=f"{summary} (By {author_str})",
                                category="articles",
                                source="arXiv Research",
                                url=paper_url,
                                image_url="https://static.arxiv.org/static/browse/0.3.4/images/arxiv-logo-web.png",
                                rating=4.8,
                                price="Free / Open Access",
                                tags=["Research", "Scientific Paper", "Peer Reviewed"],
                                published_date=published_el.text[:10] if published_el is not None and published_el.text else None,
                                author_or_channel=author_str,
                                level="Advanced",
                                retrieved_at=get_iso_now()
                            )
                        )
                    self.record_success()
        except Exception as e:
            logger.error(f"arXiv connector error: {e}")
            self.record_failure()

        return results[:limit]
