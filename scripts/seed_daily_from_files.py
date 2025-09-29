#!/usr/bin/env python3
"""
Seed daily tests into the running API from JSON files under app/data/daily or backend/backend_src/data/daily.

Usage:
  python scripts/seed_daily_from_files.py [--base http://localhost:8000]

It deduplicates by title: if a test with the same title exists, it skips.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
import sys
import urllib.request
from typing import Any, Dict, List


def _configure_stdout_utf8() -> None:
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")  # type: ignore[attr-defined]
    except Exception:
        pass


def http_get(url: str) -> Any:
    with urllib.request.urlopen(url) as resp:
        return json.loads(resp.read().decode("utf-8"))


def http_post(url: str, payload: dict) -> Any:
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))


def _normalize_questions(questions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    normalised: List[Dict[str, Any]] = []
    for idx, raw in enumerate(questions, start=1):
        q = raw or {}
        qid = q.get("id") or f"q{idx}"
        normalised.append({
            "id": qid,
            "question": q.get("question"),
            "options": q.get("options"),
            "answer": q.get("answer"),
            "explanation": q.get("explanation"),
        })
    return normalised


def main() -> int:
    _configure_stdout_utf8()
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", default="http://localhost:8000", help="API base URL")
    parser.add_argument(
        "--chunk-size",
        type=int,
        default=0,
        help="If >0, split any test into chunks of N questions per test (e.g., 2)",
    )
    parser.add_argument(
        "--pattern",
        default="*.json",
        help="Glob pattern for files to include (default: *.json). Example: linux-002.json",
    )
    args = parser.parse_args()

    base = args.base.rstrip("/")
    roots = [
        Path(__file__).resolve().parents[1] / "app" / "data" / "daily",
        Path(__file__).resolve().parents[1] / "backend" / "backend_src" / "data" / "daily",
    ]
    data_dirs = [p for p in roots if p.exists()]
    if not data_dirs:
        print("No data directories found under app/data/daily or backend/backend_src/data/daily")
        return 1

    try:
        existing = http_get(f"{base}/api/v1/daily/tests")
        existing_titles = {str(it.get("title")) for it in existing if it.get("title")}
    except Exception as exc:
        print(f"Failed to fetch existing daily tests: {exc}")
        return 1

    created = 0
    files: List[Path] = []
    for data_dir in data_dirs:
        files.extend(sorted(data_dir.rglob(args.pattern)))

    chunk = max(0, int(args.chunk_size))

    for file_path in files:
        try:
            payload = json.loads(file_path.read_text(encoding="utf-8"))
        except Exception as exc:
            print(f"Skip {file_path}: unable to read JSON ({exc})")
            continue

        items = payload if isinstance(payload, list) else [payload]
        for item in items:
            if not isinstance(item, dict):
                continue
            title = (item or {}).get("title")
            questions = (item or {}).get("questions") or []
            category = (item or {}).get("category")

            if chunk and isinstance(questions, list) and len(questions) > chunk:
                # Split into multiple tests of size `chunk`
                for i in range(0, len(questions), chunk):
                    part = questions[i : i + chunk]
                    part_title = f"{title} 세트 {i // chunk + 1:02d}" if title else f"세트 {i // chunk + 1:02d}"
                    if part_title in existing_titles:
                        continue
                    part_questions = _normalize_questions(part)
                    out = {"title": part_title, "category": category, "questions": part_questions}
                    try:
                        http_post(f"{base}/api/v1/daily/tests", out)
                    except Exception as exc:
                        print(f"Failed to create {part_title}: {exc}")
                        continue
                    created += 1
                    existing_titles.add(part_title)
                    print(f"Created: {part_title}")
                continue

            if not title or title in existing_titles:
                continue

            if isinstance(questions, list) and questions:
                item = {"title": title, "category": category, "questions": _normalize_questions(questions)}

            try:
                http_post(f"{base}/api/v1/daily/tests", item)
            except Exception as exc:
                print(f"Failed to create {title}: {exc}")
                continue
            created += 1
            existing_titles.add(title)
            print(f"Created: {title}")

    print(f"Done. Created {created} new daily tests.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
