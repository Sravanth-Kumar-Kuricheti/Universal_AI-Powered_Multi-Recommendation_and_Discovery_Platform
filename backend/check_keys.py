import os
import sys
import httpx
from dotenv import dotenv_values

# Check both .env and .env.example
env_path = "backend/.env" if os.path.exists("backend/.env") else ".env"
example_path = "backend/.env.example" if os.path.exists("backend/.env.example") else ".env.example"

vals_env = dotenv_values(env_path) if os.path.exists(env_path) else {}
vals_example = dotenv_values(example_path) if os.path.exists(example_path) else {}

# Merge: if key is in .env use it, else check .env.example (in case user pasted into .env.example)
active_keys = {}
for k in ["GROQ_API_KEY", "TAVILY_API_KEY", "BRAVE_API_KEY", "PIXABAY_API_KEY", "UNSPLASH_ACCESS_KEY", "PEXELS_API_KEY", "YOUTUBE_API_KEY", "TMDB_API_KEY", "HUGGINGFACE_TOKEN", "GITHUB_TOKEN"]:
    val = vals_env.get(k) or vals_example.get(k) or ""
    active_keys[k] = val.strip()

# If user entered keys in .env.example instead of .env, sync them into .env so FastAPI picks them up!
needs_sync = False
for k, v in vals_example.items():
    if v and (k not in vals_env or not vals_env[k]):
        vals_env[k] = v
        needs_sync = True

if needs_sync:
    print("[INFO] Syncing keys from .env.example into backend/.env ...")
    with open("backend/.env", "w", encoding="utf-8") as f:
        for k, v in vals_env.items():
            f.write(f"{k}={v}\n")
    print("[INFO] backend/.env updated successfully.")

print("\n" + "=" * 60)
print("🔑 RECOMIND AI API KEYS CONFIGURATION & HEALTH REPORT")
print("=" * 60)

for k, v in active_keys.items():
    if v:
        masked = v[:4] + "..." + v[-4:] if len(v) > 8 else "***"
        print(f"  ✓ {k}: Configured ({masked})")
    else:
        print(f"  ○ {k}: (Not provided - system uses keyless fallback)")

print("\n" + "=" * 60)
print("📡 TESTING LIVE CONNECTIVITY FOR CONFIGURED KEYS...")
print("=" * 60)

# 1. Test Groq
groq_key = active_keys.get("GROQ_API_KEY")
groq_model = vals_env.get("GROQ_MODEL") or "qwen/qwen3.8-27b"
if groq_key:
    try:
        from groq import Groq
        client = Groq(api_key=groq_key)
        chat = client.chat.completions.create(
            messages=[{"role": "user", "content": "ping"}],
            model=groq_model,
            max_tokens=5
        )
        print(f"  ✓ GROQ_API_KEY: Valid & Working! (Model '{groq_model}' responding)")
    except Exception as e:
        print(f"  ✗ GROQ_API_KEY: Authentication Error -> {e}")

# 2. Test Tavily
tavily_key = active_keys.get("TAVILY_API_KEY")
if tavily_key:
    try:
        r = httpx.post("https://api.tavily.com/search", json={"api_key": tavily_key, "query": "test", "max_results": 1}, timeout=6.0)
        if r.status_code == 200:
            print("  ✓ TAVILY_API_KEY: Valid & Working! (1,000 free searches active)")
        else:
            print(f"  ✗ TAVILY_API_KEY: HTTP {r.status_code} -> {r.text[:80]}")
    except Exception as e:
        print(f"  ✗ TAVILY_API_KEY: Error -> {e}")

# 3. Test Pixabay
pixabay_key = active_keys.get("PIXABAY_API_KEY")
if pixabay_key:
    try:
        r = httpx.get(f"https://pixabay.com/api/?key={pixabay_key}&q=test&per_page=3", timeout=6.0)
        if r.status_code == 200:
            print("  ✓ PIXABAY_API_KEY: Valid & Working! (5,000 req/hr active)")
        else:
            print(f"  ✗ PIXABAY_API_KEY: HTTP {r.status_code} -> {r.text[:80]}")
    except Exception as e:
        print(f"  ✗ PIXABAY_API_KEY: Error -> {e}")

# 4. Test Unsplash
unsplash_key = active_keys.get("UNSPLASH_ACCESS_KEY")
if unsplash_key:
    try:
        r = httpx.get("https://api.unsplash.com/search/photos?query=test&per_page=1", headers={"Authorization": f"Client-ID {unsplash_key}"}, timeout=6.0)
        if r.status_code == 200:
            print("  ✓ UNSPLASH_ACCESS_KEY: Valid & Working!")
        else:
            print(f"  ✗ UNSPLASH_ACCESS_KEY: HTTP {r.status_code} -> {r.text[:80]}")
    except Exception as e:
        print(f"  ✗ UNSPLASH_ACCESS_KEY: Error -> {e}")

# 5. Test YouTube
yt_key = active_keys.get("YOUTUBE_API_KEY")
if yt_key:
    try:
        r = httpx.get(f"https://www.googleapis.com/youtube/v3/search?part=snippet&q=test&maxResults=1&key={yt_key}", timeout=6.0)
        if r.status_code == 200:
            print("  ✓ YOUTUBE_API_KEY: Valid & Working!")
        else:
            print(f"  ✗ YOUTUBE_API_KEY: HTTP {r.status_code} -> {r.text[:80]}")
    except Exception as e:
        print(f"  ✗ YOUTUBE_API_KEY: Error -> {e}")

# 6. Test TMDB
tmdb_key = active_keys.get("TMDB_API_KEY")
if tmdb_key:
    try:
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", "Accept": "application/json"}
        if len(tmdb_key) > 50:
            headers["Authorization"] = f"Bearer {tmdb_key}"
            params = {"query": "Inception"}
        else:
            params = {"api_key": tmdb_key, "query": "Inception"}
        r = httpx.get("https://api.themoviedb.org/3/search/movie", headers=headers, params=params, timeout=6.0)
        if r.status_code == 200:
            print("  ✓ TMDB_API_KEY: Valid & Working!")
        else:
            print(f"  ✗ TMDB_API_KEY: HTTP {r.status_code} -> {r.text[:80]}")
    except Exception as e:
        print(f"  ✗ TMDB_API_KEY: Error -> {e}")

# 7. Test GitHub
gh_key = active_keys.get("GITHUB_TOKEN")
if gh_key:
    try:
        r = httpx.get("https://api.github.com/user", headers={"Authorization": f"token {gh_key}", "User-Agent": "RecoMindAI"}, timeout=6.0)
        if r.status_code == 200:
            print("  ✓ GITHUB_TOKEN: Valid & Working!")
        else:
            print(f"  ✗ GITHUB_TOKEN: HTTP {r.status_code} -> {r.text[:80]}")
    except Exception as e:
        print(f"  ✗ GITHUB_TOKEN: Error -> {e}")

# 8. Test HuggingFace
hf_key = active_keys.get("HUGGINGFACE_TOKEN")
if hf_key:
    try:
        r = httpx.get("https://huggingface.co/api/whoami-v2", headers={"Authorization": f"Bearer {hf_key}"}, timeout=6.0)
        if r.status_code == 200:
            print("  ✓ HUGGINGFACE_TOKEN: Valid & Working!")
        else:
            print(f"  ✗ HUGGINGFACE_TOKEN: HTTP {r.status_code} -> {r.text[:80]}")
    except Exception as e:
        print(f"  ✗ HUGGINGFACE_TOKEN: Error -> {e}")

print("=" * 60)
