import asyncio
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import httpx
from app.main import app

async def run_all_tests():
    print("=== RecoMind AI Backend Test Suite ===")
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Health
        resp = await client.get("/api/health")
        assert resp.status_code == 200, f"Health check failed: {resp.status_code}"
        print("  ✓ GET /api/health passed:", resp.json()["status"])

        # 2. Providers
        resp = await client.get("/api/providers/status")
        assert resp.status_code == 200, f"Providers failed: {resp.status_code}"
        data = resp.json()
        print(f"  ✓ GET /api/providers/status passed: {data['total_providers']} total, {data['active_providers']} active")

        # 3. Categories
        resp = await client.get("/api/categories")
        assert resp.status_code == 200, f"Categories failed: {resp.status_code}"
        cats = resp.json()["categories"]
        print(f"  ✓ GET /api/categories passed: {len(cats)} categories available")

        # 4. Compare
        items = [
            {
                "id": "1",
                "title": "Harvard CS50",
                "category": "courses",
                "source": "edX",
                "url": "https://www.edx.org/cs50",
                "price": "Free",
                "rating": 4.9,
                "match_score": 96
            },
            {
                "id": "2",
                "title": "Python for Everybody",
                "category": "courses",
                "source": "Coursera",
                "url": "https://www.coursera.org/python",
                "price": "Free Audit",
                "rating": 4.8,
                "match_score": 94
            }
        ]
        resp = await client.post("/api/compare", json={"items": items})
        assert resp.status_code == 200, f"Compare failed: {resp.status_code}"
        comp_data = resp.json()
        print(f"  ✓ POST /api/compare passed: {len(comp_data['features'])} features compared, best overall: {comp_data['analysis']['best_overall_id']}")

        # 5. Assistant
        resp = await client.post(
            "/api/assistant/chat",
            json={
                "messages": [{"role": "user", "content": "What are the best free Python courses?"}],
                "current_query": "Python courses"
            }
        )
        assert resp.status_code == 200, f"Assistant failed: {resp.status_code}"
        print("  ✓ POST /api/assistant/chat passed:", resp.json()["reply"][:60], "...")

        # 6. Suggestions
        resp = await client.get("/api/search/suggestions?q=python")
        assert resp.status_code == 200, f"Suggestions failed: {resp.status_code}"
        sug_data = resp.json()
        print(f"  ✓ GET /api/search/suggestions passed: {len(sug_data['related_queries'])} queries")

    print("\n🎉 ALL BACKEND API TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    asyncio.run(run_all_tests())
