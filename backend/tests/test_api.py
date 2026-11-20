import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add backend to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "RecoMind AI" in data["service"]

def test_providers_status():
    response = client.get("/api/providers/status")
    assert response.status_code == 200
    data = response.json()
    assert data["total_providers"] > 0
    assert data["active_providers"] > 0

def test_categories():
    response = client.get("/api/categories")
    assert response.status_code == 200
    data = response.json()
    assert len(data["categories"]) >= 10

def test_search_endpoint():
    req_payload = {
        "query": "Python courses for beginners",
        "category": "courses",
        "page": 1,
        "page_size": 6
    }
    response = client.post("/api/search", json=req_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["query"] == "Python courses for beginners"
    assert "results" in data
    assert len(data["results"]) > 0
    first_item = data["results"][0]
    assert "title" in first_item
    assert "url" in first_item
    assert "match_score" in first_item
    assert data["suggestions"]["summary"] != ""

def test_compare_endpoint():
    # Use 2 test items
    items = [
        {
            "id": "item1",
            "title": "Python Bootcamp",
            "category": "courses",
            "source": "freeCodeCamp",
            "url": "https://www.freecodecamp.org",
            "rating": 4.9,
            "price": "Free",
            "match_score": 95
        },
        {
            "id": "item2",
            "title": "Machine Learning Specialization",
            "category": "courses",
            "source": "Coursera",
            "url": "https://www.coursera.org",
            "rating": 4.8,
            "price": "Free Audit",
            "match_score": 92
        }
    ]
    response = client.post("/api/compare", json={"items": items})
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 2
    assert len(data["features"]) > 0
    assert "summary" in data["analysis"]
