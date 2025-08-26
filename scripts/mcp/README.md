# Coretech MCP Server (Python)

This is a minimal MCP (Model Context Protocol) tool server exposing safe git and logging utilities for the `coretech/` repo.

- Scope: restricted to the repo root (MCP_ROOT)
- Tools:
  - git_status
  - git_pull_rebase [remote=origin, branch=main]
  - git_add_commit_push message [remote=origin, branch=main]
  - append_log agent role content [tags...] [--room room]
  - aggregate_logs --date YYYY-MM-DD [--room room] [--out path]
- Policy: commit messages must include `[GPT]`, `[Gemini]`, or `[Human]` with Conventional Commits type.

## Install
- Python 3.9+
- From repo root (`coretech/`):
  - `pip install -r scripts/mcp/requirements.txt`

## Run as MCP server
Codex settings (example) are provided in `coretech/.codex.mcp.sample.json`. After adding to your local Codex config, restart Codex and the server will be available as `coretech-git`.

Environment variables:
- `MCP_ROOT` (required): absolute path to coretech repo root
- `MCP_ALLOW` (optional): comma-separated feature flags, defaults to `git,logs`

## Standalone CLI (fallback)
You can also run selected operations without MCP:
- `python scripts/mcp/server.py cli git_status`
- `python scripts/mcp/server.py cli git_add_commit_push "docs: [GPT] update"`
- `python scripts/mcp/server.py cli append_log --agent gpt --role assistant --content "Hello" --tags demo`
- `python scripts/mcp/server.py cli aggregate_logs --date 2025-08-25 --room templates`

Note: MCP mode requires the `mcp` Python package; the CLI fallback works without it.

