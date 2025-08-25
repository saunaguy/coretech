<<<<<<< HEAD
# CoreTech

교육 학습용 페이지 제작 프로젝트 🚀

## 📌 프로젝트 목적
- AI 도구(Codex/ChatGPT, Gemini)를 활용하여 교육 및 학습에 도움이 되는 웹 페이지 제작
- 협업을 통해 다양한 접근 방식과 학습 경험 공유
- 실습 및 교육 자료를 한 곳에 정리하여 재사용 가능하도록 구성

## ⚙️ 기술 스택
- Frontend: React / Next.js (예정)
- Backend: Node.js, Python (예정)
- 협업 툴: GitHub

## 👥 협업 방식
- GitHub Repository 기반 협업
- Branch & Pull Request 활용
- 이슈(issues)와 Discussions 통해 학습 아이디어 및 개선점 공유

## 📂 Repository 구조 (예정)
=======
# Project A2A

Codex(GPT)와 Gemini Pro가 함께 코드를 제안/수정하고, 사람이 리뷰·결정하는 협업 저장소입니다. 대화·의사결정은 JSONL 로그로 남기고, 코드는 `src/`에 반영합니다.

## Repository Layout
- `logs/` : 날짜·에이전트별 대화/결정 로그(JSONL). 예: `logs/2025-08-25/gpt.jsonl`, `logs/2025-08-25/room-design/gemini.jsonl`
- `scripts/append_log.py` : 로그 한 줄 append 유틸리티
- `src/frontend/`, `src/backend/` : 각 스택 코드(초기 placeholder)
- `tests/` : `src/` 미러 구조의 테스트 폴더
- `docs/design.md` : 설계/결정 기록
- `.github/` : 이슈/PR 템플릿

## Collaboration Workflow
- 브랜치: `main` 보호, 작업은 `feat/*` → PR → 리뷰 → 머지
- 커밋: Conventional Commits + 접두사 `[GPT]`, `[Gemini]`, `[Human]`
  - 예: `feat(frontend): [GPT] 라우터 기본 구성`
- PR 체크리스트: 설명/이슈/테스트/브레이킹 변경/스크린샷/CI 그린

## Logging Decisions & Dialog
- 파일: `logs/YYYY-MM-DD/<agent>.jsonl` (필요 시 `logs/YYYY-MM-DD/room-<room>/<agent>.jsonl`)
- 스키마(최소): `id, ts, agent, role, content` (+ `tags, topic, meta` 옵션)
- 예시:
  {"id":"550e8...","ts":1735130000,"agent":"gpt","role":"assistant","content":"초기 구조 OK","tags":["init"]}
- 사용법:
  - Python 3 필요
  - `python scripts/append_log.py --agent gpt --role assistant --content "초기 구조 OK" --tags init decision`
  - 대화방(선택): `--room design` → `logs/YYYY-MM-DD/room-design/gpt.jsonl`
  - 집계 보기: `python scripts/aggregate_logs.py --date 2025-08-25` (정렬된 병합 출력)

## Quick Start
1) Clone 후 첫 로그 남기기
   - `python scripts/append_log.py --agent human --role info --content "Project initialized" --tags init`
2) 코드 작업은 `src/`에, 테스트는 `tests/`에
3) 자주 `git pull --rebase`로 동기화(로그 충돌 최소화)

## Stack Commands (예시)
- Node: `npm ci` · `npm run dev` · `npm test` · `npm run build`
- Python: `pip install -r requirements.txt` · `uvicorn app.main:app --reload` · `pytest -q`

## Security
- 비밀/PII는 로그와 코드에 금지. `.env`는 커밋 금지, `.env.example`만 유지.

## Next Steps
- 프론트/백 최소 템플릿 반영, 기본 테스트/CI 구성(선택)

>>>>>>> 3c3f74d (chore: initial commit)
