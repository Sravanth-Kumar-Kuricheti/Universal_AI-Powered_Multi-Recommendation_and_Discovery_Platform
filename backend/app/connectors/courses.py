import httpx
import logging
from typing import List
from app.connectors.base import BaseConnector
from app.schemas.recommendation import RecommendationItem
from app.utils.helpers import generate_item_id, get_iso_now
from app.utils.validators import is_valid_url

logger = logging.getLogger("recomind.connector.courses")

# High-quality verified course catalogs & learning index
POPULAR_COURSE_INDEX = [
    {
        "title": "CS50's Introduction to Computer Science",
        "description": "Harvard University's legendary introduction to the intellectual enterprises of computer science and the art of programming.",
        "source": "edX / Harvard",
        "url": "https://www.edx.org/learn/computer-science/harvard-university-cs50s-introduction-to-computer-science",
        "image_url": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=80",
        "rating": 4.9,
        "price": "Free Audit",
        "duration": "12 weeks (6-18 hrs/wk)",
        "level": "Beginner",
        "author_or_channel": "Prof. David J. Malan",
        "tags": ["Computer Science", "Python", "C", "Algorithms"]
    },
    {
        "title": "Machine Learning Specialization",
        "description": "Break into AI with DeepLearning.AI and Stanford University. Master fundamental AI concepts and practical machine learning skills.",
        "source": "Coursera / Stanford",
        "url": "https://www.coursera.org/specializations/machine-learning-introduction",
        "image_url": "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&auto=format&fit=crop&q=80",
        "rating": 4.9,
        "price": "Free Audit / Paid Cert",
        "duration": "3 months (10 hrs/wk)",
        "level": "Beginner to Intermediate",
        "author_or_channel": "Andrew Ng",
        "tags": ["Machine Learning", "Python", "Deep Learning"]
    },
    {
        "title": "freeCodeCamp Full Stack Developer Curriculum",
        "description": "Learn to code for free with 3,000+ hours of interactive coding challenges and full-stack certifications.",
        "source": "freeCodeCamp",
        "url": "https://www.freecodecamp.org/learn",
        "image_url": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80",
        "rating": 4.9,
        "price": "100% Free",
        "duration": "Self-paced",
        "level": "Beginner",
        "author_or_channel": "Quincy Larson & Community",
        "tags": ["Web Development", "JavaScript", "Python", "React"]
    },
    {
        "title": "Google Data Analytics Professional Certificate",
        "description": "Gain in-demand skills that prepare you for an entry-level job in data analytics. Learn data cleaning, analysis, and visualization.",
        "source": "Coursera / Google",
        "url": "https://www.coursera.org/professional-certificates/google-data-analytics",
        "image_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=80",
        "rating": 4.8,
        "price": "Free Audit Available",
        "duration": "6 months (10 hrs/wk)",
        "level": "Beginner",
        "author_or_channel": "Google Career Certificates",
        "tags": ["Data Analytics", "SQL", "R", "Tableau"]
    },
    {
        "title": "Python for Everybody Specialization",
        "description": "Learn to program and analyze data with Python. Develop programs to gather, clean, analyze, and visualize data.",
        "source": "Coursera / Univ. of Michigan",
        "url": "https://www.coursera.org/specializations/python",
        "image_url": "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500&auto=format&fit=crop&q=80",
        "rating": 4.8,
        "price": "Free Audit Available",
        "duration": "8 months (3 hrs/wk)",
        "level": "Beginner",
        "author_or_channel": "Charles Severance (Dr. Chuck)",
        "tags": ["Python", "Databases", "Web Scraping"]
    },
    {
        "title": "MIT OpenCourseWare: Introduction to Computer Science and Programming Using Python",
        "description": "MIT's foundational undergraduate course designed to help students with little or no programming experience think computationally.",
        "source": "MIT OpenCourseWare",
        "url": "https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/",
        "image_url": "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&auto=format&fit=crop&q=80",
        "rating": 4.9,
        "price": "100% Free",
        "duration": "9 weeks",
        "level": "Beginner",
        "author_or_channel": "Prof. Eric Grimson",
        "tags": ["Python", "MIT", "Computer Science"]
    },
    {
        "title": "Deep Learning Specialization",
        "description": "Master Deep Learning, CNNs, RNNs, Transformers, and build cutting-edge AI architectures from scratch with PyTorch and TensorFlow.",
        "source": "Coursera / DeepLearning.AI",
        "url": "https://www.coursera.org/specializations/deep-learning",
        "image_url": "https://images.unsplash.com/photo-1507146426996-ef053889fb3c?w=500&auto=format&fit=crop&q=80",
        "rating": 4.9,
        "price": "Free Audit Available",
        "duration": "5 months (8 hrs/wk)",
        "level": "Intermediate",
        "author_or_channel": "Andrew Ng & Kian Katanforoosh",
        "tags": ["Deep Learning", "Neural Networks", "PyTorch"]
    },
    {
        "title": "The Odin Project: Full Stack JavaScript Curriculum",
        "description": "An open source full stack curriculum that has helped thousands of developers secure software engineering roles without paying tuition.",
        "source": "The Odin Project",
        "url": "https://www.theodinproject.com/",
        "image_url": "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=80",
        "rating": 4.9,
        "price": "100% Free",
        "duration": "Self-paced (6-12 months)",
        "level": "Beginner to Advanced",
        "author_or_channel": "Odin Open Source Community",
        "tags": ["Full Stack", "JavaScript", "Node.js", "React"]
    }
]

LEARNING_KEYWORDS = {
    "course", "courses", "learn", "learning", "tutorial", "tutorials", "cert",
    "certification", "degree", "class", "classes", "study", "studying",
    "training", "curriculum", "bootcamp", "python", "programming", "code",
    "coding", "cs50", "machine learning", "deep learning", "full stack",
    "javascript", "react", "sql", "ai", "data science", "algorithm",
    "software engineer", "developer", "fresher"
}

class CourseConnector(BaseConnector):
    name: str = "Courses & Learning"
    category: str = "courses"
    is_keyless: bool = True
    requires_key: bool = False
    attribution_url: str = "https://www.coursera.org"
    description: str = "Accredited online courses, certifications, and university learning paths"

    async def search(self, query: str, limit: int = 10, **kwargs) -> List[RecommendationItem]:
        q_lower = query.lower()
        requested_cat = kwargs.get("category", "")
        
        # Only return course recommendations if the query is learning-relevant or category is explicitly courses
        is_learning_related = (
            requested_cat == "courses"
            or any(kw in q_lower for kw in LEARNING_KEYWORDS)
        )
        if not is_learning_related:
            return []

        results: List[RecommendationItem] = []
        tokens = [t.lower() for t in query.split() if len(t) > 2]

        # 1. Search indexed curated courses
        for c in POPULAR_COURSE_INDEX:
            text = f"{c['title']} {c['description']} {' '.join(c['tags'])}".lower()
            score = sum(1 for t in tokens if t in text)
            if score > 0:
                results.append(
                    RecommendationItem(
                        id=generate_item_id("courses", c["url"]),
                        title=c["title"],
                        description=c["description"],
                        category="courses",
                        source=c["source"],
                        url=c["url"],
                        image_url=c["image_url"],
                        rating=c["rating"],
                        price=c["price"],
                        duration=c["duration"],
                        level=c["level"],
                        author_or_channel=c["author_or_channel"],
                        tags=c["tags"],
                        retrieved_at=get_iso_now()
                    )
                )

        # 2. Keyless Coursera public catalog discovery via HTTP search
        try:
            url = "https://api.duckduckgo.com/"
            params = {"q": f"{query} course site:coursera.org OR site:edx.org", "format": "json"}
            async with httpx.AsyncClient(timeout=min(self.timeout, 4.0)) as client:
                resp = await client.get(url, params=params)
                if resp.status_code == 200:
                    data = resp.json()
                    for t in data.get("RelatedTopics", []):
                        if isinstance(t, dict) and "FirstURL" in t and "Text" in t:
                            link = t["FirstURL"]
                            if ("coursera.org" in link or "edx.org" in link) and is_valid_url(link):
                                text = t["Text"]
                                title = text.split(" - ")[0] if " - " in text else text[:60]
                                desc = text.split(" - ")[1] if " - " in text else text
                                results.append(
                                    RecommendationItem(
                                        id=generate_item_id("course_web", link),
                                        title=title,
                                        description=desc,
                                        category="courses",
                                        source="Coursera / edX",
                                        url=link,
                                        image_url="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80",
                                        rating=4.7,
                                        price="Free Audit Available",
                                        duration="Course",
                                        level="All Levels",
                                        tags=["Course", "Online Learning", "Certificate"],
                                        retrieved_at=get_iso_now()
                                    )
                                )
        except Exception as e:
            logger.warning(f"Live course search warning: {e}")

        self.record_success()
        return results[:limit]
