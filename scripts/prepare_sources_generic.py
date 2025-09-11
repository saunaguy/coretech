import argparse
import json
from pathlib import Path


def main() -> int:
    ap = argparse.ArgumentParser(description="Flatten JSON {section: [urls]} to a txt list")
    ap.add_argument("--src", type=Path, required=True, help="Path to JSON map of sections->urls")
    ap.add_argument("--out", type=Path, required=True, help="Output .txt (one URL per line)")
    args = ap.parse_args()

    data = json.loads(args.src.read_text(encoding="utf-8"))
    urls = []
    for _, arr in data.items():
        urls.extend(arr)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text("\n".join(urls) + "\n", encoding="utf-8")
    print(f"[prepare-sources] wrote {len(urls)} urls -> {args.out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

