import httpx
import logging
from typing import List
from app.connectors.base import BaseConnector
from app.schemas.recommendation import RecommendationItem
from app.utils.helpers import generate_item_id, get_iso_now
from app.utils.validators import is_valid_url, clean_html

logger = logging.getLogger("recomind.connector.tmdb")

class TMDBConnector(BaseConnector):
    name: str = "TMDB & Movies"
    category: str = "movies"
    is_keyless: bool = True
    requires_key: bool = False
    attribution_url: str = "https://www.themoviedb.org"
    description: str = "The Movie Database for films, TV series, actors, and ratings"

    async def search(self, query: str, limit: int = 10, **kwargs) -> List[RecommendationItem]:
        results: List[RecommendationItem] = []
        clean_q = query.replace("movies like", "").replace("movie like", "").replace("movies", "").replace("movie", "").replace("best", "").strip() or query

        # 1. Official TMDB API if key provided (2.5s timeout)
        if self.api_key:
            url = "https://api.themoviedb.org/3/search/multi"
            headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", "Accept": "application/json"}
            if len(self.api_key) > 50:
                headers["Authorization"] = f"Bearer {self.api_key}"
                params = {"query": clean_q, "include_adult": "false"}
            else:
                params = {"api_key": self.api_key, "query": clean_q, "include_adult": "false"}
            try:
                async with httpx.AsyncClient(timeout=2.5) as client:
                    resp = await client.get(url, headers=headers, params=params)
                    if resp.status_code == 200:
                        data = resp.json()
                        for item in data.get("results", []):
                            media_type = item.get("media_type")
                            if media_type not in ("movie", "tv"):
                                continue
                            title = item.get("title") or item.get("name")
                            if not title:
                                continue
                            tmdb_id = item.get("id")
                            item_url = f"https://www.themoviedb.org/{media_type}/{tmdb_id}"
                            poster_path = item.get("poster_path")
                            image_url = f"https://image.tmdb.org/t/p/w500{poster_path}" if poster_path else None
                            vote_avg = item.get("vote_average")
                            vote_count = item.get("vote_count", 0)
                            overview = item.get("overview") or f"{title} on TMDB"
                            release_date = item.get("release_date") or item.get("first_air_date")

                            results.append(
                                RecommendationItem(
                                    id=generate_item_id("tmdb", str(tmdb_id)),
                                    title=title,
                                    description=overview[:240],
                                    category="movies",
                                    source="TMDB",
                                    url=item_url,
                                    image_url=image_url,
                                    rating=round(vote_avg / 2.0, 1) if vote_avg else 4.0,
                                    price="Streaming / Rent",
                                    tags=["Movie" if media_type == "movie" else "TV Series", f"{vote_count} Votes"],
                                    published_date=release_date,
                                    duration="Feature Film" if media_type == "movie" else "Series",
                                    retrieved_at=get_iso_now()
                                )
                            )
                        if results:
                            self.record_success()
                            return results[:limit]
            except Exception as e:
                logger.warning(f"TMDB direct API unreachable: {e}")

        # 2. Keyless Public Discovery via DuckDuckGo Instant Movie Topics
        try:
            ddg_url = "https://api.duckduckgo.com/"
            params = {"q": f"{clean_q} movie", "format": "json", "no_html": 1, "skip_disambig": 1}
            async with httpx.AsyncClient(timeout=3.0) as client:
                resp = await client.get(ddg_url, params=params)
                if resp.status_code == 200:
                    data = resp.json()
                    heading = data.get("Heading")
                    abstract = data.get("AbstractText")
                    abs_url = data.get("AbstractURL")
                    abs_img = data.get("Image")
                    if heading and abstract and abs_url:
                        results.append(
                            RecommendationItem(
                                id=generate_item_id("ddg_movie", abs_url),
                                title=heading,
                                description=abstract[:240],
                                category="movies",
                                source="Film Encyclopedia",
                                url=abs_url,
                                image_url=abs_img if is_valid_url(abs_img) else None,
                                rating=4.8,
                                price="Streaming / Rent",
                                tags=["Movie", "Film", "Cinema"],
                                duration="Feature Film",
                                retrieved_at=get_iso_now()
                            )
                        )
                    for t in data.get("RelatedTopics", []):
                        if isinstance(t, dict) and "FirstURL" in t and "Text" in t:
                            link = t["FirstURL"]
                            text = t["Text"]
                            title = text.split(" - ")[0] if " - " in text else text[:50]
                            desc = text.split(" - ")[1] if " - " in text else text
                            icon = t.get("Icon", {}).get("URL")
                            img = f"https://duckduckgo.com{icon}" if icon and icon.startswith("/") else icon
                            results.append(
                                RecommendationItem(
                                    id=generate_item_id("ddg_rel_movie", link),
                                    title=title,
                                    description=desc[:240],
                                    category="movies",
                                    source="Film Discovery",
                                    url=link,
                                    image_url=img if is_valid_url(img) else None,
                                    rating=4.5,
                                    price="Streaming",
                                    tags=["Movie", "Cinema"],
                                    retrieved_at=get_iso_now()
                                )
                            )
                    if results:
                        self.record_success()
                        return results[:limit]
        except Exception as e:
            logger.warning(f"Keyless movie search warning: {e}")

        # 3. TVMaze Fallback
        try:
            tvmaze_url = "https://api.tvmaze.com/search/shows"
            params = {"q": clean_q}
            async with httpx.AsyncClient(timeout=3.0) as client:
                resp = await client.get(tvmaze_url, params=params)
                if resp.status_code == 200:
                    data = resp.json()
                    for entry in data:
                        show = entry.get("show", {})
                        title = show.get("name")
                        url = show.get("url")
                        if not title or not is_valid_url(url):
                            continue
                        summary = show.get("summary") or ""
                        desc = clean_html(summary)[:220] or f"Watch and discover {title}"
                        image = show.get("image", {})
                        poster = image.get("medium") or image.get("original") if image else None
                        rating = show.get("rating", {}).get("average")
                        genres = show.get("genres", [])
                        premiered = show.get("premiered")

                        results.append(
                            RecommendationItem(
                                id=generate_item_id("tvmaze", str(show.get("id"))),
                                title=title,
                                description=desc,
                                category="movies",
                                source="Entertainment DB",
                                url=url,
                                image_url=poster,
                                rating=round(rating / 2.0, 1) if rating else 4.3,
                                price="Subscription",
                                tags=["Entertainment"] + genres[:3],
                                published_date=premiered,
                                duration="Show / Series",
                                retrieved_at=get_iso_now()
                            )
                        )
                    if results:
                        self.record_success()
                        return results[:limit]
        except Exception as e:
            logger.error(f"TVMaze entertainment fallback error: {e}")

        self.record_success()
        return results[:limit]
