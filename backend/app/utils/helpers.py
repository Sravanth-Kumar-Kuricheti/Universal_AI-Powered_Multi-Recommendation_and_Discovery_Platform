import hashlib
import time
from typing import Optional

def generate_item_id(source: str, identifier: str) -> str:
    key = f"{source}:{identifier}".strip().lower()
    return hashlib.md5(key.encode("utf-8")).hexdigest()[:16]

def get_iso_now() -> str:
    import datetime
    return datetime.datetime.utcnow().isoformat() + "Z"

def extract_domain(url: str) -> str:
    from urllib.parse import urlparse
    try:
        netloc = urlparse(url).netloc
        return netloc.replace("www.", "")
    except Exception:
        return ""
