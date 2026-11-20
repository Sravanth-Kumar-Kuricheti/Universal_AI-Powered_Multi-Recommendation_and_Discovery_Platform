import httpx
import logging
from typing import List
from app.connectors.base import BaseConnector
from app.schemas.recommendation import RecommendationItem
from app.utils.helpers import generate_item_id, get_iso_now
from app.utils.validators import is_valid_url

logger = logging.getLogger("recomind.connector.travel")

class TravelConnector(BaseConnector):
    name: str = "OpenStreetMap & Travel"
    category: str = "travel"
    is_keyless: bool = True
    requires_key: bool = False
    attribution_url: str = "https://www.openstreetmap.org"
    description: str = "Global geographic discovery, tourist places, landmarks, and live climate"

    async def search(self, query: str, limit: int = 10, **kwargs) -> List[RecommendationItem]:
        results: List[RecommendationItem] = []
        clean_q = query.replace("best places to visit in", "").replace("places in", "").replace("visit", "").strip() or query
        url = "https://nominatim.openstreetmap.org/search"
        params = {"q": clean_q, "format": "json", "addressdetails": "1", "limit": min(limit, 8)}
        headers = {"User-Agent": "RecoMindAI/1.0 (travel@recomind.ai)"}

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.get(url, headers=headers, params=params)
                if resp.status_code == 200:
                    data = resp.json()
                    for item in data:
                        display_name = item.get("display_name", "")
                        osm_type = item.get("type", "attraction")
                        place_class = item.get("class", "place")
                        lat = item.get("lat")
                        lon = item.get("lon")
                        osm_id = item.get("osm_id")
                        
                        map_url = f"https://www.openstreetmap.org/#map=14/{lat}/{lon}" if lat and lon else "https://www.openstreetmap.org"
                        title = display_name.split(",")[0]
                        desc = f"{osm_type.capitalize()} ({place_class}). Location: {display_name}"
                        if len(desc) > 220:
                            desc = desc[:217] + "..."

                        results.append(
                            RecommendationItem(
                                id=generate_item_id("osm", str(osm_id or title)),
                                title=title,
                                description=desc,
                                category="travel",
                                source="OpenStreetMap",
                                url=map_url,
                                image_url="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&auto=format&fit=crop&q=80",
                                rating=4.8,
                                price="Open Public Destination",
                                tags=["Travel", "Destination", osm_type.capitalize()],
                                location=display_name.split(",")[-1].strip() if "," in display_name else "Global",
                                duration="Recommended Visit: 1-3 Days",
                                retrieved_at=get_iso_now()
                            )
                        )
                    self.record_success()
        except Exception as e:
            logger.error(f"Travel connector error: {e}")
            self.record_failure()

        return results[:limit]
