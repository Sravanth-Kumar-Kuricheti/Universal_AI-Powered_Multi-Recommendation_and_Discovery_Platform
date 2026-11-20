import re
from urllib.parse import urlparse

def is_valid_url(url: str) -> bool:
    if not url or not isinstance(url, str):
        return False
    url = url.strip()
    if url.startswith("javascript:") or url.startswith("data:") or url.startswith("vbscript:"):
        return False
    try:
        parsed = urlparse(url)
        return parsed.scheme in ("http", "https") and bool(parsed.netloc)
    except Exception:
        return False

def sanitize_query(query: str) -> str:
    if not query:
        return ""
    # Strip dangerous characters while preserving natural language and punctuation
    cleaned = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', query)
    return cleaned.strip()[:500]

def clean_html(raw_html: str) -> str:
    if not raw_html:
        return ""
    clean_re = re.compile('<.*?>')
    cleaned = re.sub(clean_re, '', raw_html)
    return cleaned.replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>').replace('&quot;', '"').replace('&#39;', "'").strip()
