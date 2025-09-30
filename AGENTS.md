# Repository Guidelines

## Project Structure & Module Organization
Core application code lives in `backend/backend_src/` (FastAPI endpoints, SQLAlchemy models, seed logic) and `frontend/` (Next.js routes, UI components, hooks). Quizzing content JSON stays under `backend/backend_src/data/daily/`, while shared docs and decisions sit in `docs/`. Test harness files live in `config/` (`pytest.ini`) and `frontend/e2e/` (Playwright specs). Utilities such as `scripts/seed_daily_from_files.py` and logging helpers in `scripts/` round out the contributor toolbox.

## Build, Test, and Development Commands
Backend: `pip install -r requirements.txt` then `uvicorn backend.backend_src.main:app --reload --port 8000` starts the API against the `.env` settings. Frontend: from `frontend/`, run `npm ci` followed by `npm run dev` to serve the Next.js app at `localhost:3000`. To work fully containerised use `docker compose up -d --build`, which wires the API, web, and Postgres services together. Seed canonical daily quizzes with `python scripts/seed_daily_from_files.py --base http://localhost:8000`.

## Coding Style & Naming Conventions
Python follows Black and Ruff (`backend/pyproject.toml`) with a 100-character limit and 4-space indentation; model classes and pydantic schemas are `PascalCase`, while helpers remain `snake_case`. TypeScript/React code adopts linted Next.js defaults (`npm run lint`), keeps components in `PascalCase`, hooks in `camelCase`, and SCSS-utility classes consolidated via `cn(...)`. Markdown and config files should be formatted with `npm run format`.

## Testing Guidelines
Use `pytest -q` for backend coverage; new tests belong beside the code they verify and follow `test_<feature>.py` naming. Frontend regression relies on Playwright specs in `frontend/e2e/*.spec.ts`; execute `npm run test:e2e` after starting the API to ensure live quiz endpoints respond. Add fixtures or CSV/JSON assets under `assets/` when deterministic data is required.

## Commit & Pull Request Guidelines
Commits follow Conventional Commits plus the agent tag seen in history, e.g. `feat(backend): [Human] load .env before db init`. Keep changes scoped per commit, reference workspace paths in the body, and update docs when behaviour shifts. Pull requests should describe intent, list impactful routes or UI states, link issues or TODO ids, and attach screenshots or API traces for user-facing updates. Ensure CI commands (`npm run lint`, `pytest -q`) pass before requesting review.

## Security & Configuration Tips
Populate `.env` from `.env.example`, including `DATABASE_URL`, `API_BASE_URL`, and JWT secrets, and load it before importing database modules to avoid the SQLite fallback. Never commit real credentials; instead, document overrides in `docs/` or example env files. When sharing seeded data, redact user info and rely on the JSON fixtures checked into version control.
