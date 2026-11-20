import httpx
import logging
from typing import List
from app.connectors.base import BaseConnector
from app.schemas.recommendation import RecommendationItem
from app.utils.helpers import generate_item_id, get_iso_now
from app.utils.validators import is_valid_url

logger = logging.getLogger("recomind.connector.github")

class GitHubConnector(BaseConnector):
    name: str = "GitHub"
    category: str = "projects"
    is_keyless: bool = True
    requires_key: bool = False
    attribution_url: str = "https://github.com"
    description: str = "Global open source repositories, projects, and developer tools"

    async def search(self, query: str, limit: int = 10, **kwargs) -> List[RecommendationItem]:
        results: List[RecommendationItem] = []
        headers = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "RecoMindAI/1.0"
        }
        if self.api_key:
            headers["Authorization"] = f"token {self.api_key}"

        url = "https://api.github.com/search/repositories"
        # Optimize query for github search
        clean_q = query.replace("projects", "").replace("best", "").strip() or query
        params = {"q": clean_q, "sort": "stars", "order": "desc", "per_page": limit}

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.get(url, headers=headers, params=params)
                if resp.status_code == 200:
                    data = resp.json()
                    for item in data.get("items", []):
                        html_url = item.get("html_url")
                        if not is_valid_url(html_url):
                            continue
                        
                        stars = item.get("stargazers_count", 0)
                        lang = item.get("language")
                        topics = item.get("topics", [])
                        tags = [t for t in ([lang] + topics) if t][:5]
                        
                        rating_score = min(5.0, round(3.5 + (stars / 10000.0) * 1.5, 1)) if stars > 0 else 4.0
                        owner = item.get("owner", {})
                        avatar = owner.get("avatar_url")
                        
                        desc = item.get("description") or f"Open source repository for {query}"
                        
                        results.append(
                            RecommendationItem(
                                id=generate_item_id("github", str(item.get("id"))),
                                title=item.get("full_name") or item.get("name"),
                                description=f"{desc} (★ {stars:,} stars)",
                                category="projects",
                                source="GitHub",
                                url=html_url,
                                image_url=avatar if is_valid_url(avatar) else None,
                                rating=rating_score,
                                price="Free",
                                tags=tags if tags else ["Open Source", "Code"],
                                published_date=item.get("updated_at", "")[:10] if item.get("updated_at") else None,
                                author_or_channel=owner.get("login"),
                                level="Intermediate",
                                retrieved_at=get_iso_now()
                            )
                        )
                    self.record_success()
                elif resp.status_code == 403:
                    logger.warning("GitHub rate limit reached.")
                    self.record_failure()
        except Exception as e:
            logger.error(f"GitHub connector error: {e}")
            self.record_failure()

        return results[:limit]
