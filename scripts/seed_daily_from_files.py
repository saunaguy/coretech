#!/usr/bin/env python3
"""
Seed daily tests into the running API from JSON files under app/data/daily.

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


def http_get(url: str):
    with urllib.request.urlopen(url) as resp:
        return json.loads(resp.read().decode("utf-8"))


def http_post(url: str, payload: dict):
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--base", default="http://localhost:8000", help="API base URL")
    args = p.parse_args()

    base = args.base.rstrip("/")
    data_dir = Path(__file__).resolve().parents[1] / "app" / "data" / "daily"
    if not data_dir.exists():
        print(f"No data directory found: {data_dir}")
        return 1

    try:
        existing = http_get(f"{base}/api/v1/daily/tests")
        existing_titles = {it.get("title") for it in existing}
    except Exception as e:
        print(f"Failed to fetch existing daily tests: {e}")
        return 1

    created = 0
    for f in sorted(data_dir.glob("*.json")):
        try:
            payload = json.loads(f.read_text(encoding="utf-8"))
            title = payload.get("title")
            if not title:
                continue
            if title in existing_titles:
                continue
            http_post(f"{base}/api/v1/daily/tests", payload)
            created += 1
            print(f"Created: {title}")
        except Exception as e:
            print(f"Skip {f.name}: {e}")
            continue

    print(f"Done. Created {created} new daily tests.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

