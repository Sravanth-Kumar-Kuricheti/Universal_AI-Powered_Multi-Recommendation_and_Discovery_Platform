import logging
from typing import List
from app.schemas.recommendation import SearchSuggestions, RecommendationItem
from app.schemas.search import SearchIntent
from app.services.groq_service import groq_service

logger = logging.getLogger("recomind.suggestion_engine")

class SuggestionEngine:
    async def generate_suggestions(
        self,
        query: str,
        intent: SearchIntent,
        top_items: List[RecommendationItem]
    ) -> SearchSuggestions:
        # 1. Try Groq AI generation
        if groq_service.is_available():
            item_titles = [f"'{it.title}' ({it.source})" for it in top_items[:4]]
            system_prompt = (
                "You are the RecoMind AI Recommendation Analyst. Based on the user's search and top recommendations found, "
                "produce a JSON object with: "
                "summary (1-2 sentences summarizing what was discovered across sources), "
                "alternatives (3-4 concise alternative recommendations or approaches), "
                "related_queries (4-5 clickable related search queries), "
                "follow_up_questions (3-4 insightful questions the user might ask next)."
            )
            user_prompt = f"Query: '{query}'\nTop items: {', '.join(item_titles)}"
            ai_data = await groq_service.generate_json(system_prompt, user_prompt)
            if ai_data and "summary" in ai_data:
                return SearchSuggestions(
                    summary=ai_data.get("summary", ""),
                    alternatives=ai_data.get("alternatives", []),
                    related_queries=ai_data.get("related_queries", []),
                    follow_up_questions=ai_data.get("follow_up_questions", [])
                )

        # 2. Deterministic High-Quality Generation Fallback
        q = query.strip()
        category = intent.categories[0] if intent.categories else "resources"
        sources_found = list({it.source for it in top_items if it.source})[:3]
        sources_str = ", ".join(sources_found) if sources_found else "multiple internet providers"
        
        summary = (
            f"Found verified recommendations for '{q}' aggregated from {sources_str}. "
            f"Items are ranked by relevance, community rating, and depth of coverage."
        )

        alternatives = [
            f"Free and open-source alternatives to {q}",
            f"Comprehensive beginner roadmap for {q}",
            f"Top hands-on projects and tutorials for {q}",
            f"Advanced industry case studies and deep dives"
        ]

        related_queries = [
            f"Best free {q} certifications",
            f"{q} cheat sheet and roadmap",
            f"{q} vs alternatives comparison",
            f"Hands-on {q} tutorials for beginners",
            f"Top open source {q} repositories"
        ]

        follow_up_questions = [
            f"Which of these recommendations is best for beginners?",
            f"Show me only 100% free resources with certificates.",
            f"What prerequisites do I need before starting {q}?",
            f"Compare the top 3 recommendations side-by-side."
        ]

        return SearchSuggestions(
            summary=summary,
            alternatives=alternatives,
            related_queries=related_queries,
            follow_up_questions=follow_up_questions
        )

suggestion_engine = SuggestionEngine()
