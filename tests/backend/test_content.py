from fastapi.testclient import TestClient  # type: ignore

from app.main import app


client = TestClient(app)


def test_list_tracks_modules_lessons_and_crud():
    r_tracks = client.get("/api/v1/content/tracks")
    assert r_tracks.status_code == 200

    # create a lesson
    payload = {
        "track": "linux",
        "module": "basics",
        "slug": "hello",
        "title": "헬로 리눅스",
        "markdown": "# 헬로 리눅스\n이것은 테스트 레슨입니다.",
    }
    r_create = client.post("/api/v1/content/lesson", json=payload)
    assert r_create.status_code == 201

    r_get = client.get(
        "/api/v1/content/lesson", params={"track": "linux", "module": "basics", "slug": "hello"}
    )
    assert r_get.status_code == 200
    body = r_get.json()
    assert body["title"] == "헬로 리눅스"
    assert "markdown" in body and "헬로" in body["markdown"]

    r_lessons = client.get(
        "/api/v1/content/lessons", params={"track": "linux", "module": "basics"}
    )
    assert r_lessons.status_code == 200
    assert "hello" in r_lessons.json()

