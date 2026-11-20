import json
import re
import time
import logging
import asyncio
from typing import Optional, Dict, Any
from app.config import settings

logger = logging.getLogger("recomind.groq")

class GroqService:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.model = settings.GROQ_MODEL or "qwen/qwen3.8-27b"
        self._client = None
        self.rate_limited_until = 0.0

        if self.api_key:
            try:
                from groq import AsyncGroq
                # AsyncGroq with max_retries=0 and non-blocking async execution
                self._client = AsyncGroq(api_key=self.api_key, max_retries=0, timeout=3.5)
            except Exception as e:
                logger.warning(f"Could not initialize Groq SDK client: {e}")

    def is_available(self) -> bool:
        if not self._client or not self.api_key:
            return False
        # If recently rate-limited (429), skip Groq temporarily to allow quota to reset
        if time.time() < self.rate_limited_until:
            return False
        return True

    def _extract_json(self, text: str) -> Optional[Dict[str, Any]]:
        """Safely extract JSON from model output even if wrapped in markdown code blocks."""
        if not text:
            return None
        text = text.strip()
        try:
            return json.loads(text)
        except Exception:
            pass
        # Try finding outermost JSON object {...}
        match = re.search(r'\{[\s\S]*\}', text)
        if match:
            try:
                return json.loads(match.group(0))
            except Exception:
                pass
        return None

    async def generate_json(self, system_prompt: str, user_prompt: str) -> Optional[Dict[str, Any]]:
        if not self.is_available():
            return None
        try:
            chat_completion = await asyncio.wait_for(
                self._client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": system_prompt + " Output ONLY a valid JSON object without markdown formatting."},
                        {"role": "user", "content": user_prompt}
                    ],
                    model=self.model,
                    temperature=0.1,
                    max_tokens=500
                ),
                timeout=3.5
            )
            content = chat_completion.choices[0].message.content
            return self._extract_json(content)
        except Exception as e:
            err_str = str(e)
            if "429" in err_str or "rate_limit" in err_str.lower():
                logger.warning("Groq free tier rate limit (429) hit. Pausing Groq calls for 30s; switching to deterministic engine.")
                self.rate_limited_until = time.time() + 30.0
            else:
                logger.warning(f"Groq API call error: {e}")
            return None

    async def generate_text(self, system_prompt: str, user_prompt: str) -> Optional[str]:
        if not self.is_available():
            return None
        try:
            chat_completion = await asyncio.wait_for(
                self._client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    model=self.model,
                    temperature=0.3,
                    max_tokens=500
                ),
                timeout=3.5
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            err_str = str(e)
            if "429" in err_str or "rate_limit" in err_str.lower():
                self.rate_limited_until = time.time() + 30.0
            logger.warning(f"Groq text call error: {e}")
            return None

groq_service = GroqService()
