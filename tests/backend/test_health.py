import os
import sys

# Ensure backend src is importable when running tests from repo root
CURRENT_DIR = os.path.dirname(__file__)
BACKEND_SRC = os.path.abspath(os.path.join(CURRENT_DIR, "..", "..", "src", "backend"))
if BACKEND_SRC not in sys.path:
    sys.path.insert(0, BACKEND_SRC)

from fastapi.testclient import TestClient  # type: ignore
from app.main import app


def test_health():
    client = TestClient(app)
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json().get("status") == "ok"

