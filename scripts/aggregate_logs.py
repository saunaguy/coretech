#!/usr/bin/env python3
import argparse
import glob
import json
import os
from typing import List, Dict, Any


def load_lines(paths: List[str]) -> List[Dict[str, Any]]:
    items = []
    for p in paths:
        try:
            with open(p, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        obj = json.loads(line)
                        obj["_source_file"] = os.path.relpath(p)
                        items.append(obj)
                    except Exception:
                        pass
        except FileNotFoundError:
            continue
    return items


def main():
    ap = argparse.ArgumentParser(description="Aggregate and sort logs by ts across agents and rooms")
    ap.add_argument("--date", required=True, help="YYYY-MM-DD")
    ap.add_argument("--room", default=None, help="specific room (without 'room-' prefix)")
    ap.add_argument("--out", default=None, help="optional output file; prints to stdout if omitted")
    args = ap.parse_args()

    base = os.path.join("logs", args.date)
    if args.room:
        pattern = os.path.join(base, f"room-{args.room}", "*.jsonl")
    else:
        pattern = os.path.join(base, "**", "*.jsonl")

    paths = glob.glob(pattern, recursive=True)
    if not paths:
        print(f"No log files found for {args.date} (room={args.room or '-'})")
        return

    items = load_lines(paths)
    items.sort(key=lambda x: (x.get("ts", 0), x.get("agent", "")))

    if args.out:
        os.makedirs(os.path.dirname(args.out) or ".", exist_ok=True)
        with open(args.out, "w", encoding="utf-8") as f:
            for obj in items:
                f.write(json.dumps(obj, ensure_ascii=False) + "\n")
        print(f"Wrote {len(items)} lines to {args.out}")
    else:
        for obj in items:
            print(json.dumps(obj, ensure_ascii=False))


if __name__ == "__main__":
    main()

