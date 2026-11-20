import datetime
from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base

class SavedSearch(Base):
    __tablename__ = "saved_searches"

    id = Column(Integer, primary_key=True, index=True)
    query = Column(String(500), nullable=False, unique=True, index=True)
    category = Column(String(100), default="all")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
