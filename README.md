# CoreTech (A2A 협업 프로젝트)

교육·학습용 웹 프로젝트를 GPT와 Gemini가 함께 제안/수정하고, 사람이 리뷰·결정하는 형태로 진행합니다. 대화·의사결정은 JSONL 로그로 남기고, 코드는 `src/`에 반영합니다. 🚀

## 📌 프로젝트 목적
- AI 도구(Codex/GPT, Gemini)를 활용하여 교육 및 학습에 도움이 되는 웹/백엔드 예제를 구축
- 협업을 통해 다양한 접근 방식과 학습 경험 공유
- 실습 및 교육 자료를 한 곳에 정리하여 재사용 가능하도록 구성

## ⚙️ 기술 스택(점진 도입)
- Frontend: Next.js (ai-prompt-lab, Tailwind v4 + shadcn/ui 스타일)
- Backend: FastAPI (Python)
- 데이터: SQLite → 향후 Postgres 확장
- 협업 툴: GitHub

## 📂 Repository 구조
- `ai-prompt-lab/` : Next.js 프론트엔드(디자인/컴포넌트/페이지)
- `src/backend/` : FastAPI 백엔드
- `tests/` : `src/` 미러 구조의 테스트 폴더
- `docs/design.md` : 설계/결정 기록
- `logs/` : 날짜·에이전트별 대화/결정 로그(JSONL)
- `scripts/` : 로그 append/집계 유틸리티
- `.github/` : 이슈/PR 템플릿 및 CI

## 🤝 협업 워크플로우
- 브랜치: `main` 보호, 작업은 `feat/*` → PR → 리뷰 → 머지
- 커밋: Conventional Commits + 접두사 `[GPT]`, `[Gemini]`, `[Human]`
  - 예: `feat(frontend): [GPT] 라우터 기본 구성`
- PR 체크리스트: 설명/이슈/테스트/브레이킹 변경/스크린샷/CI 그린

## 📝 의사결정/대화 로깅
- 파일: `logs/YYYY-MM-DD/<agent>.jsonl` 또는 `logs/YYYY-MM-DD/room-<room>/<agent>.jsonl`
- 최소 스키마: `id, ts, agent, role, content` (+ `tags, topic, meta` 옵션)
- 예시:
  `{ "id":"550e8...","ts":1735130000,"agent":"gpt","role":"assistant","content":"초기 구조 OK","tags":["init"] }`
- 사용법:
  - `python scripts/append_log.py --agent gpt --role assistant --content "초기 구조 OK" --tags init decision`
  - 대화방(선택): `--room design` → `logs/YYYY-MM-DD/room-design/gpt.jsonl`
  - 집계 보기: `python scripts/aggregate_logs.py --date 2025-08-25`

## 🚀 Quick Start
1) 첫 로그 남기기
   - `python scripts/append_log.py --agent human --role info --content "Project initialized" --tags init`
2) 코드 작업은 `src/`에, 테스트는 `tests/`에
3) 자주 `git pull --rebase`로 동기화(로그 충돌 최소화)

## 🧪 Stack Commands (예시)
- Frontend(Next.js): `npm run dev` · `npm run build` · `npm start`
  - 루트에서 실행: `cd coretech && npm ci && npm run dev`
  - 게시판: `http://localhost:3000/board` (검색/정렬/페이지네이션·스켈레톤 로딩 포함)
- Backend(FastAPI): `pip install -r requirements.txt` · `uvicorn app.main:app --reload --port 8000` · `pytest -q`
  - API 엔드포인트: `GET /health`, `GET/POST /api/v1/content/*`, `GET/POST /api/v1/quiz/*`, `GET/POST /api/v1/qna/*`
  - 데일리 테스트(DB): `GET /api/v1/daily/tests`, `GET /api/v1/daily/tests/{id}`, `POST /api/v1/daily/tests`, `POST /api/v1/daily/tests/{id}/submit`
  - CORS: `http://localhost:3000` 허용(프론트 개발용)
  - 인증(초안): `POST /api/v1/auth/register`, `POST /api/v1/auth/login` (JWT)
  - 환경: `.env`(예시: `.env.example`)에서 `SECRET_KEY`, `DATABASE_URL`, `CORS_ORIGINS`, `JWT_EXPIRE_MINUTES` 설정

### Docker (계획)
### Docker
- 목표: 프론트/백/DB를 `docker-compose`로 로컬 통합 실행 → 이후 레지스트리 배포
- 포함 파일: `Dockerfile.frontend`, `Dockerfile.backend`, `docker-compose.yml`, `.dockerignore`
- 실행:
  - 환경: `.env` 생성(예시는 `.env.example` 참고)
  - 빌드/실행: `docker compose up -d --build`
  - 접근: 프론트 `http://localhost:3000`, API `http://localhost:8000`
- 서비스 구성:
  - `frontend`: Next.js 빌드 후 `next start`
  - `backend`: FastAPI(`uvicorn`) 실행, `DATABASE_URL`/`SECRET_KEY`/`CORS_ORIGINS` 사용
  - `db`: Postgres 16-alpine, 볼륨 `pgdata` 지속화

### Content sync
- 레슨 소스: `src/frontend/public/content/lessons` (초기 위치)
- 표준 경로: `content/lessons` (Next.js 서버에서 읽음)
- 동기화: `npm run content:sync`

## 🔐 Security
- 비밀/PII는 로그와 코드에 금지. `.env`는 커밋 금지, `.env.example`만 유지.

## ✅ Next Steps
- ai-prompt-lab 디자인 유지하며 콘텐츠 렌더/퀴즈/진도 기능 통합

## 🧩 Daily Tests 시드
- 소스 파일: `app/data/daily/*.json`
- 백엔드 시작 시 자동 머지 시드(제목 중복 방지). 실행 중 추가로 넣으려면:
  - API로 주입: `python scripts/seed_daily_from_files.py --base http://localhost:8000`
  - 또는 서버 재시작(시작 훅에서 새 파일만 삽입)

## 📄 문서 링크
- 요구사항 분석표: `docs/requirements.md`
- 진행상황 기록: `docs/progress.md`
- 고도화 전략(로드맵): `docs/roadmap.md`
- TODO 체크리스트: `docs/todos.md`
