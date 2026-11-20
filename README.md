# RecoMind AI — Universal AI-Powered Multi-Recommendation & Discovery Platform

> **"Discover Everything. Find What Fits You."**  
> *RecoMind AI — One Search. Endless Discoveries.*

RecoMind AI is a production-grade universal recommendation and discovery engine. Users can enter a natural-language query to discover verified recommendations aggregated across top internet providers, open registries, and public APIs — without login, signup, or registration requirements.

---

## 📸 Exact UI Design Lock

The frontend reproduces the approved **RecoMind AI Dashboard** layout:
- **Fixed Collapsible Sidebar (253px / 68px)**: `#17102F` to `#211040` dark purple gradient, robot branding logo, expandable categories, and bottom AI Assistant card.
- **Sticky Top Navbar (53px)**: `#111329` with underline navigation indicators and theme status.
- **Search Hero Section (187px)**: `#10152C`, centered gradient heading, 687×46px search bar, 195×46px *"Get Recommendations ✨"* button, suggestion chips, and futuristic AI robot artwork.
- **Results Workspace (Background: `#F7F7FC`)**:
  - Results header with Save Search, Share, and CSV Export.
  - Horizontal Category Tabs with **actual retrieved counts**.
  - 202px Filter Sidebar on desktop (Price, Level, Rating, Source).
  - 3-column recommendation grid with card radius 13px, padding 13px, borders `#DCE0EE`, verified metadata badges, RecoMind Match Score (`94% Match` with explanation tooltip), and direct source action buttons.
  - Floating 5-item comparison drawer & side-by-side comparison matrix.
  - Slide-out conversational AI Assistant drawer.

---

## 🚀 Key Architectural Features

1. **Zero Login / Zero Friction**: Opens straight to discovery. Anonymous user favorites and query history persist securely in browser `localStorage`.
2. **AI Query Understanding & Intent Engine**: Natural language analysis via **Groq** (`llama-3.3-70b-versatile`) with automatic deterministic fallback parsing.
3. **Multi-Source Concurrent Retrieval**:
   - **General Web**: Brave Search API & keyless instant answer fallback
   - **Developer Tools & Code**: GitHub REST API & Hugging Face Hub API
   - **Learning & Certifications**: Coursera, edX, Harvard CS50, freeCodeCamp, MIT OpenCourseWare
   - **Books & Literature**: Open Library API & Google Books API
   - **Cinema & Entertainment**: TMDB API & TVMaze Open API
   - **Video Tutorials**: YouTube Data API v3 & public video discovery
   - **Research & Papers**: arXiv Open Access API & Wikipedia OpenSearch
   - **Travel & Places**: OpenStreetMap Nominatim & Open-Meteo
   - **Visual Imagery**: Pexels API & curated high-resolution photography
   - **Tech Pulse**: Hacker News Algolia API
4. **Hybrid Recommendation Ranking Engine**:
   $$\text{Final Score} = 0.40 \times \text{Query Relevance} + 0.25 \times \text{Content Similarity} + 0.20 \times \text{Preference Match} + 0.15 \times \text{Quality Signals}$$
   Normalized to an explainable 0–100% RecoMind Match Score.
5. **Diversity & Deduplication**: Eliminates duplicate resources and balances provider representation across feed results.
6. **Compare System**: Select up to 5 recommendations to compare features, ratings, prices, advantages, and limitations side-by-side.

---

## 🛠 Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom purple glow utilities
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Routing**: React Router DOM v6
- **Data & State**: TanStack React Query & React Context API
- **Charts & Feedback**: Recharts, Canvas Confetti

### Backend
- **Framework**: FastAPI (Python 3.11–3.14)
- **Server**: Uvicorn ASGI
- **Data Validation**: Pydantic v2 & Pydantic Settings
- **Database**: SQLite (local development) / PostgreSQL (production) with SQLAlchemy
- **AI & NLP**: Groq SDK (`llama-3.3-70b-versatile`), Scikit-learn (TF-IDF, Cosine Similarity), NumPy
- **HTTP Client**: HTTPX (async client with concurrency pools and timeouts)
- **Streaming**: SSE (Server-Sent Events via `sse-starlette`)

---

## 📂 Project Structure

```
Multi Reccomendation System/
├── frontend/
│   ├── public/
│   │   ├── logo.svg
│   │   └── robot.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/ (AppLayout, Navbar, Sidebar, MobileDrawer)
│   │   │   ├── search/ (SearchHero, SearchSuggestions, SearchLoading)
│   │   │   ├── recommendations/ (ResultsHeader, CategoryTabs, RecommendationCard, RecommendationGrid, SimilarModal)
│   │   │   ├── filters/ (FilterSidebar)
│   │   │   ├── compare/ (CompareBar)
│   │   │   ├── assistant/ (AIChatPanel)
│   │   │   └── common/ (Button, Badge, Pagination)
│   │   ├── context/ (AppContext, SearchContext)
│   │   ├── pages/ (Home, Recommendations, Categories, Compare, Favorites, History, About)
│   │   ├── services/ (api, searchService, recommendationService)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── vercel.json
├── backend/
│   ├── app/
│   │   ├── connectors/ (Brave, GitHub, HuggingFace, YouTube, TMDB, Books, Arxiv, Courses, etc.)
│   │   ├── models/ (cached_recommendation, search_history, saved_search)
│   │   ├── recommender/ (content_based, hybrid_recommender, diversity_ranker)
│   │   ├── routes/ (health, search, recommendations, categories, videos, compare, assistant, providers)
│   │   ├── schemas/ (search, recommendation, provider, comparison)
│   │   ├── services/ (groq_service, query_analyzer, search_orchestrator, suggestion_engine, export_service)
│   │   ├── utils/ (validators, helpers, error_handler)
│   │   ├── config.py
│   │   ├── database.py
│   │   └── main.py
│   ├── tests/
│   │   ├── run_tests.py
│   │   └── test_api.py
│   ├── requirements.txt
│   └── .env.example
├── render.yaml
└── README.md
```

---

## 💻 Local Setup & Development

### Prerequisites
- Node.js 18+ and npm
- Python 3.11, 3.12, or 3.14

### 1. Backend Setup
```bash
cd backend
python -m venv venv

# Activate venv:
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

Create `.env` file in `backend/` (optional, public keyless providers work without keys):
```ini
GROQ_API_KEY=your_groq_key_here
GROQ_MODEL=llama-3.3-70b-versatile
DATABASE_URL=sqlite:///./recomind.db
FRONTEND_URL=http://localhost:5173
```

Start backend:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be live at: `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health status and engine availability |
| `GET` | `/api/providers/status` | List active connectors and quota configuration |
| `POST` | `/api/search` | Universal search with intent classification, ranking & pagination |
| `POST` | `/api/search/stream` | Real-time SSE streaming search progress and AI completions |
| `GET` | `/api/recommendations/{id}/similar` | Fetch similar alternatives for a specific item |
| `GET` | `/api/categories` | Catalog of taxonomies with icons and descriptions |
| `GET` | `/api/videos/search` | Dedicated video tutorial discovery |
| `POST` | `/api/compare` | Multi-item comparison with advantages and limitations analysis |
| `POST` | `/api/assistant/chat` | Conversational follow-up and personalized recommendations |
| `GET` | `/api/search/suggestions` | Related search chips and questions |
| `GET` | `/api/export/csv` | Download active results as formatted CSV |

---

## 🚀 Production Deployment

### Frontend on Vercel
1. Set root directory to `frontend`.
2. Framework preset: **Vite**.
3. Build command: `npm run build`. Output directory: `dist`.
4. Environment variable: `VITE_API_URL=https://recomind-backend.onrender.com/api`.

### Backend on Render
1. Connect GitHub repository and select `render.yaml` or create Web Service.
2. Root directory: `backend`.
3. Runtime: **Python 3**.
4. Build command: `pip install -r requirements.txt`.
5. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
6. Environment variables: `DATABASE_URL`, `FRONTEND_URL`, `GROQ_API_KEY`.

---

## ⚖️ Source Attribution & Policy
RecoMind AI accesses publicly accessible indexes, search APIs, and open knowledge bases. It enforces rate limits, respects provider quotas, preserves original creators' source links, and never fabricates claims or ratings.
