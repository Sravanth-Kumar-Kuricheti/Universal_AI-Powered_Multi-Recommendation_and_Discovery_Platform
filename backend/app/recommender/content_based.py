import logging
from typing import List
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.schemas.recommendation import RecommendationItem

logger = logging.getLogger("recomind.recommender.content")

class ContentBasedScorer:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))

    def compute_similarity(self, query: str, items: List[RecommendationItem]) -> List[float]:
        if not items:
            return []
        
        # Build text corpus: query is index 0, followed by each item's title, description, and tags
        corpus = [query]
        for item in items:
            tags_str = " ".join(item.tags or [])
            text = f"{item.title} {item.description or ''} {item.source or ''} {tags_str}"
            corpus.append(text)

        try:
            tfidf_matrix = self.vectorizer.fit_transform(corpus)
            query_vector = tfidf_matrix[0:1]
            item_vectors = tfidf_matrix[1:]
            
            sim_scores = cosine_similarity(query_vector, item_vectors)[0]
            return [float(s) for s in sim_scores]
        except Exception as e:
            logger.warning(f"TF-IDF similarity fallback: {e}")
            # Fallback simple token overlap
            q_tokens = set(query.lower().split())
            scores = []
            for item in items:
                item_text = f"{item.title} {item.description or ''}".lower()
                overlap = sum(1 for t in q_tokens if t in item_text)
                scores.append(min(1.0, overlap / max(len(q_tokens), 1)))
            return scores

content_scorer = ContentBasedScorer()
