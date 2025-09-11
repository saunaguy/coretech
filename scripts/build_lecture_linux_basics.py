import argparse
import json
from pathlib import Path
from typing import Dict, List, Optional


def load_ndjson(path: Path) -> List[Dict]:
    items: List[Dict] = []
    with path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                items.append(json.loads(line))
            except Exception:
                continue
    return items


def summarize(text: str, max_sentences: int = 3) -> str:
    separators = [". ", "\n", "! ", "? "]
    parts: List[str] = [text]
    for sep in separators:
        new_parts: List[str] = []
        for chunk in parts:
            new_parts.extend(chunk.split(sep))
        parts = new_parts
    parts = [p.strip() for p in parts if p.strip()]
    return (". ".join(parts[:max_sentences])).strip()


def build_markdown(
    plan_md: str,
    sources_map: Dict[str, List[str]],
    fetched: List[Dict],
    out_path: Path,
) -> None:
    by_url: Dict[str, Dict] = {it.get("url"): it for it in fetched if it.get("url")}

    lines: List[str] = []
    lines.append("# Linux Basics — Lecture Draft")
    lines.append("")
    lines.append("## Outline (from intro.md)")
    lines.append("")
    lines.append(plan_md)
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## Sources & Summaries")

    for section, urls in sources_map.items():
        lines.append("")
        lines.append(f"### {section}")
        for url in urls:
            item = by_url.get(url)
            if not item:
                lines.append(f"- [missing] {url}")
                continue
            title: Optional[str] = item.get("title")
            text: Optional[str] = item.get("text")
            summary = summarize(text) if text else "(no extract)"
            display = title or url
            lines.append(f"- {display} — {url}")
            lines.append(f"  - {summary}")

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    ap = argparse.ArgumentParser(description="Build Linux Basics lecture draft from fetched sources")
    ap.add_argument("--plan", type=Path, default=Path("0908/coretech/frontend/content/linux/basics/intro.md"))
    ap.add_argument("--sources", type=Path, default=Path("0908/coretech/assets/sources/linux_basics_sources.json"))
    ap.add_argument("--data", type=Path, default=Path("0908/coretech/assets/linux_basics/raw.ndjson"))
    ap.add_argument("--out", type=Path, default=Path("0908/coretech/docs/lectures/linux/basics.md"))
    args = ap.parse_args()

    plan_text = args.plan.read_text(encoding="utf-8")
    sources_map = json.loads(args.sources.read_text(encoding="utf-8"))
    fetched = load_ndjson(args.data) if args.data.exists() else []

    build_markdown(plan_text, sources_map, fetched, args.out)
    print(f"[build-lecture] wrote -> {args.out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

