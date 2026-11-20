import httpx
import logging
from typing import List
from app.connectors.base import BaseConnector
from app.schemas.recommendation import RecommendationItem
from app.utils.helpers import generate_item_id, get_iso_now
from app.utils.validators import is_valid_url

logger = logging.getLogger("recomind.connector.youtube")

class YouTubeConnector(BaseConnector):
    name: str = "YouTube"
    category: str = "videos"
    is_keyless: bool = True
    requires_key: bool = False
    attribution_url: str = "https://youtube.com"
    description: str = "Global video tutorials, lectures, reviews and demonstrations"

    async def search(self, query: str, limit: int = 10, **kwargs) -> List[RecommendationItem]:
        results: List[RecommendationItem] = []
        clean_q = query.strip()

        # 1. Official YouTube Data API v3 if API key configured
        if self.api_key:
            url = "https://www.googleapis.com/youtube/v3/search"
            params = {
                "key": self.api_key,
                "q": clean_q,
                "part": "snippet",
                "type": "video",
                "maxResults": limit
            }
            try:
                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    resp = await client.get(url, params=params)
                    if resp.status_code == 200:
                        data = resp.json()
                        for item in data.get("items", []):
                            video_id = item.get("id", {}).get("videoId")
                            if not video_id:
                                continue
                            snippet = item.get("snippet", {})
                            title = snippet.get("title", "")
                            channel = snippet.get("channelTitle", "")
                            desc = snippet.get("description", "")
                            thumbnails = snippet.get("thumbnails", {})
                            thumb_url = thumbnails.get("high", {}).get("url") or thumbnails.get("medium", {}).get("url")
                            video_url = f"https://www.youtube.com/watch?v={video_id}"
                            
                            results.append(
                                RecommendationItem(
                                    id=generate_item_id("youtube", video_id),
                                    title=title,
                                    description=desc or f"Video by {channel} covering {clean_q}",
                                    category="videos",
                                    source="YouTube",
                                    url=video_url,
                                    video_url=video_url,
                                    image_url=thumb_url,
                                    rating=4.7,
                                    price="Free",
                                    tags=["Video", "Tutorial", channel],
                                    published_date=snippet.get("publishedAt", "")[:10],
                                    author_or_channel=channel,
                                    duration="Video Tutorial",
                                    level="All Levels",
                                    retrieved_at=get_iso_now()
                                )
                            )
                        self.record_success()
                        return results[:limit]
            except Exception as e:
                logger.warning(f"YouTube official API failed: {e}")
                self.record_failure()

        # 2. Keyless Public Discovery via Invidious / Piped API instance
        invidious_instances = [
            "https://vid.puffyan.us",
            "https://inv.nadeko.net",
            "https://invidious.nerdvpn.de"
        ]
        
        for instance in invidious_instances:
            try:
                url = f"{instance}/api/v1/search"
                params = {"q": clean_q, "type": "video"}
                async with httpx.AsyncClient(timeout=5.0) as client:
                    resp = await client.get(url, params=params)
                    if resp.status_code == 200:
                        data = resp.json()
                        for item in data[:limit]:
                            video_id = item.get("videoId")
                            if not video_id:
                                continue
                            title = item.get("title", "")
                            channel = item.get("author", "")
                            desc = item.get("description", "")
                            thumb = f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg"
                            video_url = f"https://www.youtube.com/watch?v={video_id}"
                            length_sec = item.get("lengthSeconds", 0)
                            duration_str = f"{length_sec // 60}m {length_sec % 60}s" if length_sec else "Video"

                            results.append(
                                RecommendationItem(
                                    id=generate_item_id("youtube", video_id),
                                    title=title,
                                    description=desc[:200] if desc else f"Watch {title} on YouTube by {channel}",
                                    category="videos",
                                    source="YouTube",
                                    url=video_url,
                                    video_url=video_url,
                                    image_url=thumb,
                                    rating=4.8,
                                    price="Free",
                                    tags=["Video", "YouTube", channel],
                                    published_date=item.get("publishedText"),
                                    author_or_channel=channel,
                                    duration=duration_str,
                                    level="All Levels",
                                    retrieved_at=get_iso_now()
                                )
                            )
                        if results:
                            self.record_success()
                            return results[:limit]
            except Exception:
                continue

        return results[:limit]
