import pytest
import httpx
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app

@pytest.mark.asyncio
async def test_health():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "healthy"
        assert "RecoMind AI" in data["service"]

@pytest.mark.asyncio
async def test_providers():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/providers/status")
        assert resp.status_code == 200
        data = resp.json()
        assert data["total_providers"] >= 10
        assert data["active_providers"] >= 5

@pytest.mark.asyncio
async def test_categories():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/categories")
        assert resp.status_code == 200
        data = resp.json()
        assert len(data["categories"]) >= 10

@pytest.mark.asyncio
async def test_compare():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        items = [
            {
                "id": "1",
                "title": "Harvard CS50",
                "category": "courses",
                "source": "edX",
                "url": "https://www.edx.org",
                "price": "Free",
                "rating": 4.9,
                "match_score": 96
            },
            {
                "id": "2",
                "title": "Python for Everybody",
                "category": "courses",
                "source": "Coursera",
                "url": "https://www.coursera.org",
                "price": "Free Audit",
                "rating": 4.8,
                "match_score": 94
            }
        ]
        resp = await client.post("/api/compare", json={"items": items})
        assert resp.status_code == 200
        data = resp.json()
        assert len(data["items"]) == 2
        assert "analysis" in data
        assert len(data["features"]) > 0

@pytest.mark.asyncio
async def test_assistant():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {
            "messages": [{"role": "user", "content": "What are the best free Python courses?"}],
            "current_query": "Python courses"
        }
        resp = await client.post("/api/assistant/chat", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert "reply" in data
        assert len(data["reply"]) > 10
