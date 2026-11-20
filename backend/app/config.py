import os
from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    PROJECT_NAME: str = "RecoMind AI"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api"
    
    # AI Credentials (Groq is 100% free with fast LLM rate limits)
    GROQ_API_KEY: str = Field(default="")
    GROQ_MODEL: str = Field(default="qwen/qwen3.8-27b")
    GEMINI_API_KEY: str = Field(default="")

    # Web Search Connectors (Free Options)
    TAVILY_API_KEY: str = Field(default="", description="1,000 free searches/month at https://tavily.com")
    BRAVE_API_KEY: str = Field(default="")

    # Media & Image Connectors (Free Options)
    UNSPLASH_ACCESS_KEY: str = Field(default="", description="50 free requests/hr at https://unsplash.com/developers")
    PIXABAY_API_KEY: str = Field(default="", description="5,000 free requests/hr at https://pixabay.com/api/docs/")
    PEXELS_API_KEY: str = Field(default="")

    # Media & Developer Connectors
    YOUTUBE_API_KEY: str = Field(default="")
    TMDB_API_KEY: str = Field(default="")
    HUGGINGFACE_TOKEN: str = Field(default="")
    GITHUB_TOKEN: str = Field(default="")

    # Database
    DATABASE_URL: str = Field(default="sqlite:///./recomind.db")

    # CORS
    FRONTEND_URL: str = Field(default="https://universal-ai-powered-multi-recommen.vercel.app")
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "https://universal-ai-powered-multi-recommen.vercel.app",
        "https://recomind-ai.vercel.app",
        "*"
    ]

    class Config:
        env_file = (
            os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"),
            ".env"
        )
        extra = "ignore"

settings = Settings()
