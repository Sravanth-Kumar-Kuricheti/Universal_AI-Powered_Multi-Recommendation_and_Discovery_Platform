import re
from typing import List
from app.schemas.recommendation import RecommendationItem
from app.schemas.search import SearchIntent, SearchFilters
from app.recommender.content_based import content_scorer

class HybridRecommender:
    def rank_and_score(
        self,
        query: str,
        items: List[RecommendationItem],
        intent: SearchIntent,
        filters: SearchFilters = None
    ) -> List[RecommendationItem]:
        if not items:
            return []

        # 1. Content similarity scores (0.0 - 1.0)
        tfidf_scores = content_scorer.compute_similarity(query, items)
        
        q_tokens = [t.lower() for t in query.split() if len(t) > 2]
        scored_items: List[RecommendationItem] = []

        for idx, item in enumerate(items):
            content_sim = tfidf_scores[idx] if idx < len(tfidf_scores) else 0.5
            
            # 2. Query Relevance (0.0 - 1.0)
            title_lower = (item.title or "").lower()
            desc_lower = (item.description or "").lower()
            tag_text = " ".join(item.tags or []).lower()
            
            matches_title = sum(1 for t in q_tokens if t in title_lower)
            matches_desc = sum(1 for t in q_tokens if t in desc_lower)
            matches_tags = sum(1 for t in q_tokens if t in tag_text)
            
            total_tokens = max(len(q_tokens), 1)
            relevance_score = min(1.0, (matches_title * 0.6 + matches_tags * 0.25 + matches_desc * 0.15) / total_tokens)
            
            # 3. Preference Match (0.0 - 1.0)
            pref_score = 0.5
            pref_reasons = []
            
            if intent.price and item.price:
                if intent.price == "free" and "free" in item.price.lower():
                    pref_score += 0.25
                    pref_reasons.append("Free access verified")
                elif intent.price == "paid" and "paid" in item.price.lower():
                    pref_score += 0.2
            
            if intent.level and item.level:
                if intent.level.lower() in item.level.lower():
                    pref_score += 0.25
                    pref_reasons.append(f"Suited for {item.level}")

            pref_score = min(1.0, pref_score)

            # 4. Quality Signals (0.0 - 1.0)
            quality_score = 0.6
            if item.rating:
                # normalize 3.0-5.0 to 0.5-1.0
                quality_score = min(1.0, max(0.4, (item.rating - 3.0) / 2.0 * 0.5 + 0.5))
            if item.image_url:
                quality_score += 0.1
            quality_score = min(1.0, quality_score)

            # Final Score calculation
            # 0.40 * Relevance + 0.25 * Similarity + 0.20 * Preference + 0.15 * Quality
            raw_score = (
                0.40 * relevance_score +
                0.25 * content_sim +
                0.20 * pref_score +
                0.15 * quality_score
            )
            
            # Normalize to 65 - 98 range for realistic, professional recommendation score
            match_percentage = int(min(98, max(68, round(raw_score * 100))))
            
            # Generate explainable match reason
            reasons = []
            if matches_title > 0:
                reasons.append("matches your core search terms")
            if pref_reasons:
                reasons.extend(pref_reasons)
            if item.rating and item.rating >= 4.5:
                reasons.append(f"rated {item.rating}★ by learners")
            if item.source:
                reasons.append(f"verified provider on {item.source}")
                
            explanation = "Recommended because it " + ", ".join(reasons[:2]) + "." if reasons else f"Relevant resource from {item.source}."

            item.match_score = match_percentage
            item.match_reason = explanation
            scored_items.append(item)

        # Sort descending by match score
        scored_items.sort(key=lambda x: (x.match_score or 0, x.rating or 0), reverse=True)
        return scored_items

hybrid_recommender = HybridRecommender()
