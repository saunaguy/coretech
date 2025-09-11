import argparse
import json
import os
import sys
from typing import Any, Dict, Iterable

from pathlib import Path

try:
    from dotenv import load_dotenv  # type: ignore
except Exception:
    # dotenv is optional; continue if missing (env can be set by shell)
    def load_dotenv(*args: Any, **kwargs: Any) -> None:  # type: ignore
        return None

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from src.tools.exa_client import ExaClient


def write_ndjson(path: Path, items: Iterable[Dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        for obj in items:
            f.write(json.dumps(obj, ensure_ascii=False) + "\n")


def main() -> int:
    load_dotenv()

    parser = argparse.ArgumentParser(description="Search/crawl via EXA API and save results.")
    subparsers = parser.add_subparsers(dest="command", required=True)

    p_search = subparsers.add_parser("search", help="Run a search query")
    p_search.add_argument("--query", required=True, help="Search query text")
    p_search.add_argument("--max-results", type=int, default=20, help="Max results")
    p_search.add_argument("--out", type=Path, default=Path("assets/exa_search.ndjson"), help="Output NDJSON path")

    p_contents = subparsers.add_parser("contents", help="Fetch contents for given IDs")
    p_contents.add_argument("--ids", nargs="+", required=True, help="List of document IDs")
    p_contents.add_argument("--out", type=Path, default=Path("assets/exa_contents.ndjson"), help="Output NDJSON path")

    p_crawl = subparsers.add_parser("crawl", help="Crawl given URLs")
    p_crawl.add_argument("--urls", nargs="+", required=True, help="List of URLs to crawl")
    p_crawl.add_argument("--max-depth", type=int, default=0, help="Crawl depth")
    p_crawl.add_argument("--out", type=Path, default=Path("assets/exa_crawl.ndjson"), help="Output NDJSON path")

    args = parser.parse_args()

    try:
        client = ExaClient()
    except Exception as e:
        print(f"[exa] init error: {e}", file=sys.stderr)
        return 2

    try:
        if args.command == "search":
            res = client.search(args.query, max_results=args.max_results)
            items = res.get("results") or res.get("data") or [res]
            if isinstance(items, dict):
                items = [items]
            write_ndjson(args.out, items)
            print(f"[exa] search saved: {args.out}")

        elif args.command == "contents":
            res = client.contents(args.ids)
            items = res.get("results") or res.get("data") or [res]
            if isinstance(items, dict):
                items = [items]
            write_ndjson(args.out, items)
            print(f"[exa] contents saved: {args.out}")

        elif args.command == "crawl":
            res = client.crawl(args.urls, max_depth=args.max_depth)
            items = res.get("results") or res.get("data") or [res]
            if isinstance(items, dict):
                items = [items]
            write_ndjson(args.out, items)
            print(f"[exa] crawl saved: {args.out}")

        else:
            parser.error("Unknown command")
            return 2

    except Exception as e:
        print(f"[exa] request error: {e}", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
