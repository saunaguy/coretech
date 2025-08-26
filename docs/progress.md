# 진행상황 기록

협업 진행 내용을 날짜순으로 요약합니다. 상세 대화/의사결정은 `logs/YYYY-MM-DD/` 폴더의 JSONL 파일을 참고하세요.

## 사용 방법
- 대화/결정 로그 추가: `python scripts/append_log.py --agent <gpt|gemini|human> --role <assistant|user|info|error> --content "메시지" --tags tag1 tag2 --room <선택>`
- 집계 보기: `python scripts/aggregate_logs.py --date YYYY-MM-DD [--room <name>]`

## 로그 테이블
| 날짜 | 항목 | 담당 | 유형 | 상태 | 산출물/링크 | 메모 |
|------|------|------|------|------|-------------|------|
| 2025-08-26 | README 충돌 해결 및 통합 | GPT | 문서 | 완료 | `README.md` | 제품 비전+협업 규칙 병합 |
| 2025-08-26 | 백엔드 FastAPI 헬스체크 스캐폴딩 | GPT | 백엔드 | 완료 | `src/backend/app/main.py`, `tests/backend/test_health.py` | `/health` 200 OK |
| 2025-08-26 | 프론트 React/Vite 최소 구조 | GPT | 프론트 | 진행 | `src/frontend/index.html`, `src/frontend/src/main.jsx`, `package.json` | 개발 서버 스크립트 추가 |
| 2025-08-26 | 포매터/린트 설정(Prettier/ESLint/Black/Ruff) | GPT | 품질 | 완료 | `.prettierrc.json`, `.eslintrc.json`, `pyproject.toml` | 기본 규칙 적용 |
| 2025-08-26 | CI 워크플로 추가 | GPT | CI | 완료 | `.github/workflows/ci.yml` | Python/Node 린트+빌드+테스트 |
| 2025-08-26 | 환경 변수 예시 확장 | GPT | 설정 | 완료 | `.env.example` | `BACKEND_PORT`, `FRONTEND_PORT` 추가 |
| 2025-08-26 | 협업 노트 생성 | GPT | 문서 | 완료 | `AI_NOTES_GPT.md` | 스냅샷/다음 단계 기록 |

---
문서 위치: `docs/progress.md`

