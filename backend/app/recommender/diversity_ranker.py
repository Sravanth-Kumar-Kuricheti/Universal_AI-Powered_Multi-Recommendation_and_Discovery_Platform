from typing import List, Set
from collections import defaultdict
from app.schemas.recommendation import RecommendationItem

class DiversityRanker:
    def re_rank(self, items: List[RecommendationItem], max_per_source: int = 4) -> List[RecommendationItem]:
        if not items:
            return []

        # 1. Deduplicate by URL and normalized title
        seen_urls: Set[str] = set()
        seen_titles: Set[str] = set()
        unique_items: List[RecommendationItem] = []

        for it in items:
            norm_url = it.url.rstrip("/").lower()
            norm_title = "".join(ch for ch in it.title.lower() if ch.isalnum())
            
            if norm_url in seen_urls or norm_title in seen_titles:
                continue
            
            seen_urls.add(norm_url)
            seen_titles.add(norm_title)
            unique_items.append(it)

        # 2. Source diversity balancing
        source_counts = defaultdict(int)
        diversified_top: List[RecommendationItem] = []
        overflow: List[RecommendationItem] = []

        for it in unique_items:
            src = it.source or "other"
            if source_counts[src] < max_per_source:
                source_counts[src] += 1
                diversified_top.append(it)
            else:
                overflow.append(it)

        # Append remaining overflow to preserve total count
        return diversified_top + overflow

diversity_ranker = DiversityRanker()
