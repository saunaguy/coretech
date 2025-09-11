import argparse
import json
from pathlib import Path
from typing import Dict, List, Optional


def load_ndjson(path: Path) -> List[Dict]:
    items: List[Dict] = []
    if not path.exists():
        return items
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


def summarize(text: str, max_len: int = 700) -> str:
    t = " ".join(text.split())
    if len(t) <= max_len:
        return t
    return t[:max_len].rsplit(" ", 1)[0] + "..."


def build_markdown(
    plan_md: str,
    sources_map: Dict[str, List[str]],
    fetched: List[Dict],
    out_path: Path,
) -> None:
    by_url: Dict[str, Dict] = {it.get("url"): it for it in fetched if it.get("url")}

    lines: List[str] = []
    lines.append("# 리눅스 기초 1장 — 강의 초안")
    lines.append("")
    lines.append("## 목차(커리큘럼 발췌)")
    lines.append("")
    lines.append(plan_md)
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## 참고 자료 및 요약")

    for section, urls in sources_map.items():
        lines.append("")
        lines.append(f"### {section}")
        for url in urls:
            item = by_url.get(url)
            title: Optional[str] = item.get("title") if item else None
            text: Optional[str] = item.get("text") if item else None
            summary = summarize(text) if text else "(미수집 또는 본문 추출 불가)"
            display = title or url
            lines.append(f"- {display}")
            lines.append(f"  - 원문: {url}")
            lines.append(f"  - 요약: {summary}")

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    ap = argparse.ArgumentParser(description="Build Linux Basics Chapter 1 lecture draft")
    ap.add_argument("--plan", type=Path, default=Path("0908/coretech/frontend/content/linux/basics/intro.md"))
    ap.add_argument("--sources", type=Path, default=Path("0908/coretech/assets/sources/linux_ch1_sources.json"))
    ap.add_argument("--data", type=Path, default=Path("0908/coretech/assets/linux_ch1/raw.ndjson"))
    ap.add_argument("--out", type=Path, default=Path("result/codex_lesson/linux_basics_ch1.md"))
    args = ap.parse_args()

    plan_text = args.plan.read_text(encoding="utf-8")
    sources_map = json.loads(args.sources.read_text(encoding="utf-8"))
    fetched = load_ndjson(args.data)

    build_markdown(plan_text, sources_map, fetched, args.out)
    print(f"[build-lecture-ch1] wrote -> {args.out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

