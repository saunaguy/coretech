#!/usr/bin/env python3
import argparse
import os
import re
import shlex
import subprocess
import sys
from pathlib import Path

ALLOWED_TYPES = (
    "feat",
    "fix",
    "docs",
    "chore",
    "refactor",
    "test",
    "ci",
    "build",
    "perf",
)
AGENT_PREFIX = ("GPT", "Gemini", "Human")
COMMIT_RE = re.compile(
    rf"^(?:{'|'.join(ALLOWED_TYPES)})(?:\([^\)]+\))?:\s*\[(?:{'|'.join(AGENT_PREFIX)})\].+",
    re.IGNORECASE,
)


def repo_root() -> Path:
    root_env = os.environ.get("MCP_ROOT")
    if root_env:
        return Path(root_env).resolve()
    # fallback: assume this file is coretech/scripts/mcp/server.py
    return Path(__file__).resolve().parents[2]


ROOT = repo_root()


def run_cmd(cmd: str) -> subprocess.CompletedProcess:
    return subprocess.run(
        cmd,
        cwd=str(ROOT),
        shell=True,
        check=False,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )


def ensure_commit_policy(message: str):
    if not COMMIT_RE.match(message or ""):
        raise ValueError(
            "Commit message must follow Conventional Commits and include "
            "[GPT]|[Gemini]|[Human] prefix"
        )


def tool_git_status():
    res = run_cmd("git status --porcelain=v1 -b")
    if res.returncode != 0:
        return {"ok": False, "stderr": res.stderr}
    return {"ok": True, "stdout": res.stdout}


def tool_git_pull_rebase(remote: str = "origin", branch: str = "main"):
    cmd = f"git pull --rebase {shlex.quote(remote)} {shlex.quote(branch)}"
    res = run_cmd(cmd)
    return {"ok": res.returncode == 0, "stdout": res.stdout, "stderr": res.stderr}


def tool_git_add_commit_push(message: str, remote: str = "origin", branch: str = "main"):
    ensure_commit_policy(message)
    seq = [
        "git add -A",
        f"git commit -m {shlex.quote(message)}",
        f"git push {shlex.quote(remote)} {shlex.quote(branch)}",
    ]
    outs = []
    for c in seq:
        res = run_cmd(c)
        outs.append({"cmd": c, "code": res.returncode, "stdout": res.stdout, "stderr": res.stderr})
        if res.returncode != 0 and not (
            "nothing to commit" in res.stdout.lower() or "nothing to commit" in res.stderr.lower()
        ):
            return {"ok": False, "steps": outs}
    return {"ok": True, "steps": outs}


def tool_append_log(agent: str, role: str, content: str, tags=None, room: str | None = None):
    cmd = [
        sys.executable,
        str(ROOT / "scripts" / "append_log.py"),
        "--agent",
        agent,
        "--role",
        role,
        "--content",
        content,
    ]
    if tags:
        cmd += ["--tags", *tags]
    if room:
        cmd += ["--room", room]
    res = subprocess.run(
        cmd,
        cwd=str(ROOT),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    return {"ok": res.returncode == 0, "stdout": res.stdout, "stderr": res.stderr}


def tool_aggregate_logs(date: str, room: str | None = None, out: str | None = None):
    cmd = [sys.executable, str(ROOT / "scripts" / "aggregate_logs.py"), "--date", date]
    if room:
        cmd += ["--room", room]
    if out:
        # ensure path is within ROOT
        out_path = (ROOT / out).resolve()
        if ROOT not in out_path.parents and out_path != ROOT:
            return {"ok": False, "stderr": "out path must be inside repo"}
        cmd += ["--out", str(out_path)]
    res = subprocess.run(
        cmd,
        cwd=str(ROOT),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    return {"ok": res.returncode == 0, "stdout": res.stdout, "stderr": res.stderr}


def serve_mcp():
    try:
        from mcp.server import Server
        from mcp.server.stdio import stdio_server
    except Exception as e:
        print(
            "MCP package missing. Install with: pip install -r scripts/mcp/requirements.txt",
            file=sys.stderr,
        )
        print(f"Import error: {e}", file=sys.stderr)
        sys.exit(1)

    server = Server("coretech-git")

    @server.tool()
    def git_status() -> str:
        """Git status (porcelain)."""
        r = tool_git_status()
        if not r["ok"]:
            raise RuntimeError(r.get("stderr", "status failed"))
        return r["stdout"]

    @server.tool()
    def git_pull_rebase(remote: str = "origin", branch: str = "main") -> dict:
        """Git pull --rebase."""
        return tool_git_pull_rebase(remote, branch)

    @server.tool()
    def git_add_commit_push(message: str, remote: str = "origin", branch: str = "main") -> dict:
        """Git add -A, commit, push. Enforces commit policy."""
        return tool_git_add_commit_push(message, remote, branch)

    @server.tool()
    def append_log(
        agent: str,
        role: str,
        content: str,
        tags: list[str] | None = None,
        room: str | None = None,
    ) -> dict:
        """Append a log line (per-agent-per-day, optional room)."""
        return tool_append_log(agent, role, content, tags, room)

    @server.tool()
    def aggregate_logs(date: str, room: str | None = None, out: str | None = None) -> dict:
        """Aggregate logs for a date (and optional room)."""
        return tool_aggregate_logs(date, room, out)

    with stdio_server() as (read_from_client, write_to_client):
        server.run(read_from_client, write_to_client)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("mode", nargs="?", default="serve", help="serve | cli")
    ap.add_argument("cli_tool", nargs="?", help="When mode=cli: tool name")
    args, rest = ap.parse_known_args()

    if args.mode == "serve":
        serve_mcp()
        return

    # CLI fallback for quick testing
    if args.mode == "cli":
        if args.cli_tool == "git_status":
            print(tool_git_status())
        elif args.cli_tool == "git_pull_rebase":
            par = argparse.ArgumentParser()
            par.add_argument("--remote", default="origin")
            par.add_argument("--branch", default="main")
            p = par.parse_args(rest)
            print(tool_git_pull_rebase(p.remote, p.branch))
        elif args.cli_tool == "git_add_commit_push":
            par = argparse.ArgumentParser()
            par.add_argument("message", required=True)
            par.add_argument("--remote", default="origin")
            par.add_argument("--branch", default="main")
            p = par.parse_args(rest)
            print(tool_git_add_commit_push(p.message, p.remote, p.branch))
        elif args.cli_tool == "append_log":
            par = argparse.ArgumentParser()
            par.add_argument("--agent", required=True)
            par.add_argument("--role", required=True)
            par.add_argument("--content", required=True)
            par.add_argument("--tags", nargs="*")
            par.add_argument("--room")
            p = par.parse_args(rest)
            print(tool_append_log(p.agent, p.role, p.content, p.tags, p.room))
        elif args.cli_tool == "aggregate_logs":
            par = argparse.ArgumentParser()
            par.add_argument("--date", required=True)
            par.add_argument("--room")
            par.add_argument("--out")
            p = par.parse_args(rest)
            print(tool_aggregate_logs(p.date, p.room, p.out))
        else:
            print(
                "Unknown CLI tool. Use one of: "
                "git_status, git_pull_rebase, git_add_commit_push, append_log, aggregate_logs"
            )
        return

    print("Unknown mode; use 'serve' or 'cli'", file=sys.stderr)
    sys.exit(2)


if __name__ == "__main__":
    main()
