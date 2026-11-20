import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from app.database import Base

class CachedRecommendation(Base):
    __tablename__ = "cached_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    provider = Column(String(50), index=True)
    provider_item_id = Column(String(255), index=True)
    query_key = Column(String(255), index=True)
    title = Column(String(500), nullable=False)
    category = Column(String(100), index=True)
    url = Column(Text, nullable=False)
    normalized_data = Column(JSON, nullable=False)
    retrieved_at = Column(DateTime, default=datetime.datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)
