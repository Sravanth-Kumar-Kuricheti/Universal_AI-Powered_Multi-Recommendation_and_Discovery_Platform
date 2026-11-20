import os
import uvicorn

if __name__ == "__main__":
    port_str = os.environ.get("PORT", "8000")
    try:
        port = int(port_str)
    except ValueError:
        port = 8000
    print(f"[INFO] Starting RecoMind AI server on 0.0.0.0:{port} ...", flush=True)
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, log_level="info")
