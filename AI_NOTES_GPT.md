# CoreTech — Working Notes (GPT)

Purpose: quick snapshot of repo state, workflow, and next steps so future sessions can resume fast.

## Project Snapshot (2025-08-26)
- Goal: education/learning site, AI-assisted collaboration (GPT + Gemini + Human).
- Status: skeleton repo in place; no concrete app stack wired yet.
- Key feature: JSONL-based decision/dialog logs under `logs/YYYY-MM-DD/` with helper scripts.
- Issue to resolve: README contains merge-conflict markers — decide which content to keep and fix.

## Structure Overview
- `README.md`: project overview (currently conflicted; see below).
- `docs/design.md`: initial architecture notes (React FE, FastAPI BE, SQLite → Postgres).
- `scripts/`:
  - `append_log.py`: append a single JSONL line to dated log files (agent/role/content, optional tags/topic/meta, room grouping).
  - `aggregate_logs.py`: collect and sort a day’s logs across agents/rooms.
  - `mcp/`: minimal MCP server placeholder (see `README.md` there).
- `logs/YYYY-MM-DD/`: dated dialog/decision logs; example exists for `2025-08-25`.
- `src/`: placeholders only (`frontend/`, `backend/`).
- `tests/`: mirrors `src/` with placeholders.
- `.github/`: PR template and Decision issue template.
- `.env.example`: safe defaults (`LOG_LEVEL`, `API_BASE_URL`).

## Collaboration & Logging
- Convention: Conventional Commits with agent prefix `[GPT]`, `[Gemini]`, `[Human]` (per README).
- Branching: work on `feat/*` → PR → review → merge into protected `main`.
- Append a log entry:
  ```bash
  python scripts/append_log.py \
    --agent gpt \
    --role assistant \
    --content "초기 구조 검토 완료" \
    --tags init summary \
    --room design
  ```
- Aggregate a day’s logs:
  ```bash
  python scripts/aggregate_logs.py --date 2025-08-25
  # or a specific room
  python scripts/aggregate_logs.py --date 2025-08-25 --room design
  ```

## Stack & Commands
- Concrete app scaffolding not yet present (no `package.json`, `requirements.txt`, `pyproject.toml`, etc.).
- Use repository guidelines for defaults when scaffolding:
  - Node: `npm ci` / `npm run dev` / `npm test` / `npm run build`
  - Python: `pip install -r requirements.txt` / `pytest -q` / `uvicorn ... --reload`

## README Merge Conflict
`README.md` contains unresolved conflict markers between two variants:
- Variant A: "CoreTech" education site description (Korean).
- Variant B: "Project A2A" multi-agent collaboration/logging details.
Action: reconcile into a single README combining both: product vision + collaboration/logging workflow. Then remove `<<<<<<<`, `=======`, `>>>>>>>` markers.

## Suggested Next Steps
- Resolve `README.md` conflict and commit.
- Initialize minimal FE/BE templates per `docs/design.md` (e.g., Vite React + FastAPI).
- Add basic CI (lint + test) and formatters (Prettier/Black/Ruff) with scripts.
- Define `.env.example` variables needed by FE/BE once scaffolded.
- Seed `tests/` with a hello-world test for each stack.

## Quick Reference
- Logs location: `logs/YYYY-MM-DD/` or `logs/YYYY-MM-DD/room-<room>/`.
- Minimal JSONL schema: `id, ts, agent, role, content` (+ `tags, topic, meta`).
- Env sample: `LOG_LEVEL=info`, `API_BASE_URL=http://localhost:8000`.

---
Maintainer note: This file is for fast ramp-up by GPT in future sessions. Safe to keep in-repo; adjust as the project evolves.

