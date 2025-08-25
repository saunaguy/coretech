#!/usr/bin/env python3
import argparse
import json
import os
import sys
import time
import uuid
from datetime import datetime


def parse_args():
    p = argparse.ArgumentParser(description="Append a log line. Default path: logs/YYYY-MM-DD/<agent>.jsonl or logs/YYYY-MM-DD/room-<room>/<agent>.jsonl")
    p.add_argument("--agent", required=True, choices=["gpt", "gemini", "human", "system"], help="agent name")
    p.add_argument("--role", required=True, choices=["assistant", "user", "info", "error"], help="message role")
    p.add_argument("--content", required=True, help="message content")
    p.add_argument("--tags", nargs="*", default=None, help="optional tags")
    p.add_argument("--topic", default=None, help="optional topic")
    p.add_argument("--meta", default=None, help="optional JSON string for meta")
    p.add_argument("--room", default=None, help="optional room/topic name for grouping (creates logs/YYYY-MM-DD/room-<room>/)")
    p.add_argument("--file", default=None, help="override output file path (advanced)")
    return p.parse_args()


def main():
    args = parse_args()
    ts = int(time.time())
    entry = {
        "id": str(uuid.uuid4()),
        "ts": ts,
        "agent": args.agent,
        "role": args.role,
        "content": args.content,
    }
    if args.tags:
        entry["tags"] = args.tags
    if args.topic:
        entry["topic"] = args.topic
    if args.meta:
        try:
            entry["meta"] = json.loads(args.meta)
        except json.JSONDecodeError:
            print("--meta must be a valid JSON string", file=sys.stderr)
            sys.exit(2)

    out_file = args.file
    if not out_file:
        day = datetime.utcfromtimestamp(ts).strftime("%Y-%m-%d")
        parts = ["logs", day]
        if args.room:
            safe_room = "room-" + "".join(c for c in args.room if c.isalnum() or c in ("-","_"))
            parts.append(safe_room)
        out_dir = os.path.join(*parts)
        os.makedirs(out_dir, exist_ok=True)
        out_file = os.path.join(out_dir, f"{args.agent}.jsonl")

    with open(out_file, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False))
        f.write("\n")

    print(f"Appended to {out_file}:")
    print(json.dumps(entry, ensure_ascii=False))


if __name__ == "__main__":
    main()

