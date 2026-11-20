import datetime
from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base

class SearchHistory(Base):
    __tablename__ = "search_history"

    id = Column(Integer, primary_key=True, index=True)
    query = Column(String(500), nullable=False, index=True)
    category = Column(String(100), default="all")
    results_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
