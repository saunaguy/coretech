import os
import sys

CURRENT_DIR = os.path.dirname(__file__)
BACKEND_SRC = os.path.abspath(os.path.join(CURRENT_DIR, "..", "..", "src", "backend"))
if BACKEND_SRC not in sys.path:
    sys.path.insert(0, BACKEND_SRC)

from fastapi.testclient import TestClient  # type: ignore
from app.main import app


client = TestClient(app)


def test_quiz_sample_and_submit():
    r = client.get("/api/v1/quiz/sample")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list) and len(data) >= 2

    answers = {item["id"]: 1 for item in data}
    r2 = client.post("/api/v1/quiz/submit", json={"answers": answers})
    assert r2.status_code == 200
    result = r2.json()
    assert "total" in result and "correct" in result


def test_qna_crud_minimal():
    r_create = client.post(
        "/api/v1/qna/questions",
        json={"title": "SSH 포트 변경", "body": "sshd_config 설정은?", "tags": ["linux", "ssh"]},
    )
    assert r_create.status_code == 201
    q = r_create.json()
    qid = q["id"]

    r_list = client.get("/api/v1/qna/questions")
    assert r_list.status_code == 200
    assert any(item["id"] == qid for item in r_list.json())

    r_get = client.get(f"/api/v1/qna/questions/{qid}")
    assert r_get.status_code == 200
    assert r_get.json()["title"] == "SSH 포트 변경"

