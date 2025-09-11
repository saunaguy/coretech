import json
from pathlib import Path


def main() -> int:
    src = Path("0908/coretech/assets/sources/linux_basics_sources.json")
    out = Path("0908/coretech/assets/sources/linux_basics_urls.txt")
    if not src.exists():
        print(f"missing {src}")
        return 1
    data = json.loads(src.read_text(encoding="utf-8"))
    urls = []
    for _, arr in data.items():
        urls.extend(arr)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text("\n".join(urls) + "\n", encoding="utf-8")
    print(f"[prepare-sources] wrote {len(urls)} urls -> {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

