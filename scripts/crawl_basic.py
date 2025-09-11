import argparse
import json
from pathlib import Path
from typing import Iterable, List
import sys

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from src.tools.basic_crawler import BasicCrawler


def write_ndjson(path: Path, lines: Iterable[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        for obj in lines:
            f.write(json.dumps(obj, ensure_ascii=False) + "\n")


def main() -> int:
    ap = argparse.ArgumentParser(description="Basic no-API web crawler (HTML -> text)")
    ap.add_argument("--urls", nargs="*", help="List of URLs to fetch")
    ap.add_argument("--in-file", type=Path, help="File with one URL per line", default=None)
    ap.add_argument("--out", type=Path, default=Path("0908/coretech/assets/basic_crawl.ndjson"))
    ap.add_argument("--delay", type=float, default=0.5, help="Delay seconds between requests")
    ap.add_argument("--timeout", type=float, default=20.0, help="Request timeout seconds")
    args = ap.parse_args()

    all_urls: List[str] = []
    if args.in_file and args.in_file.exists():
        all_urls.extend([u.strip() for u in args.in_file.read_text(encoding="utf-8").splitlines() if u.strip()])
    if args.urls:
        all_urls.extend(args.urls)
    all_urls = [u for u in all_urls if u]

    if not all_urls:
        ap.error("Provide URLs via --urls ... or --in-file path")

    crawler = BasicCrawler(timeout_seconds=args.timeout, delay_seconds=args.delay)
    results = []
    for url in all_urls:
        try:
            r = crawler.fetch(url)
            results.append({
                "url": r.url,
                "status": r.status,
                "title": r.title,
                "text": r.text,
            })
        except Exception as e:
            results.append({"url": url, "error": str(e)})

    write_ndjson(args.out, results)
    print(f"[basic-crawl] saved -> {args.out} ({len(results)} items)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
