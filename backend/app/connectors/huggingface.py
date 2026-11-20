import httpx
import logging
from typing import List
from app.connectors.base import BaseConnector
from app.schemas.recommendation import RecommendationItem
from app.utils.helpers import generate_item_id, get_iso_now
from app.utils.validators import is_valid_url

logger = logging.getLogger("recomind.connector.huggingface")

class HuggingFaceConnector(BaseConnector):
    name: str = "Hugging Face"
    category: str = "tools"
    is_keyless: bool = True
    requires_key: bool = False
    attribution_url: str = "https://huggingface.co"
    description: str = "State-of-the-art AI models, weights, datasets and Spaces"

    async def search(self, query: str, limit: int = 10, **kwargs) -> List[RecommendationItem]:
        results: List[RecommendationItem] = []
        headers = {"User-Agent": "RecoMindAI/1.0"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        url = "https://huggingface.co/api/models"
        clean_q = query.replace("ai tools", "").replace("best", "").strip() or query
        params = {"search": clean_q, "limit": limit, "full": "true"}

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.get(url, headers=headers, params=params)
                if resp.status_code == 200:
                    models = resp.json()
                    for m in models:
                        model_id = m.get("id") or m.get("modelId")
                        if not model_id:
                            continue
                        model_url = f"https://huggingface.co/{model_id}"
                        downloads = m.get("downloads", 0)
                        likes = m.get("likes", 0)
                        pipeline_tag = m.get("pipeline_tag") or "machine-learning"
                        tags = [pipeline_tag] + (m.get("tags", [])[:4])
                        
                        desc = f"Open AI model: {pipeline_tag}. Downloads: {downloads:,} | Likes: {likes:,}"
                        rating_val = min(5.0, round(4.0 + (likes / 500.0), 1)) if likes > 0 else 4.2
                        
                        results.append(
                            RecommendationItem(
                                id=generate_item_id("hf", model_id),
                                title=model_id,
                                description=desc,
                                category="tools",
                                source="Hugging Face",
                                url=model_url,
                                image_url="https://huggingface.co/front/assets/huggingface_logo-noborder.svg",
                                rating=rating_val,
                                price="Free",
                                tags=tags,
                                published_date=m.get("lastModified", "")[:10] if m.get("lastModified") else None,
                                author_or_channel=model_id.split("/")[0] if "/" in model_id else "Community",
                                level="Advanced",
                                retrieved_at=get_iso_now()
                            )
                        )
                    self.record_success()
        except Exception as e:
            logger.error(f"Hugging Face connector error: {e}")
            self.record_failure()

        return results[:limit]
