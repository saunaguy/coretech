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
| 2025-08-26 | ESLint v9 flat config 도입 | GPT | 품질 | 완료 | `eslint.config.js` | Node 린트 CI 통과 |
| 2025-08-26 | Vite 설정/플러그인 보완 | GPT | 프론트 | 완료 | `vite.config.js`, `package.json` | 빌드/프리뷰 OK |
| 2025-08-26 | CORS 허용(5173) | GPT | 백엔드 | 완료 | `src/backend/app/main.py` | 프론트→API 호출 허용 |
| 2025-08-27 | 프론트엔드 이미지 에셋 복사 | Gemini | 프론트 | 완료 | `coretech/src/frontend/public/*.png, *.svg` | `AboutPage.jsx`에서 사용되는 이미지 에셋을 `ai-prompt-lab` public 디렉토리에서 `coretech` public 디렉토리로 복사. |
| 2025-08-27 | 프론트엔드 페이지 콘텐츠 통합 | Gemini | 프론트 | 완료 | `src/frontend/pages/*.jsx` | `ai-prompt-lab` 템플릿의 콘텐츠를 각 페이지에 통합. |
| 2025-08-27 | 프론트엔드 라우팅 구현 | Gemini | 프론트 | 완료 | `src/frontend/pages/*.jsx`, `src/frontend/App.jsx`, `src/frontend/main.jsx` | `react-router-dom`을 사용하여 기본 라우팅 설정. 현재 환경 제약으로 `npm` 명령(lint, dev server) 실행 불가. |
| 2025-08-27 | 프론트엔드 레이아웃 리팩토링 | Gemini | 프론트 | 완료 | `src/frontend/components/{Header,Layout}.jsx`, `src/frontend/App.jsx` | `App.jsx`를 `Layout`으로 감싸고 `Header`를 분리하여 재사용성 및 확장성 개선. |
| 2025-08-28 | 프론트 전환: Next.js(ai-prompt-lab) 루트 포팅 | GPT | 프론트 | 완료 | `app/`, `components/`, `lib/`, `next.config.mjs`, `tsconfig.json` | 디자인 토큰/컴포넌트(Button/Card/Textarea) 이식, 홈/리눅스 라우트 추가 |
| 2025-08-28 | Vite 정리 및 스크립트/CI 업데이트 | GPT | CI/문서 | 완료 | `package.json`, `.github/workflows/ci.yml`, `README.md` | 루트 스크립트(next dev/build/start)로 변경, Node CI 루트 기준 빌드 |
| 2025-08-28 | ai-prompt-lab 유지(참조) 및 콘텐츠 이전 계획 | GPT | 문서 | 진행 | `docs/roadmap.md`, `docs/todos.md` | 콘텐츠 표준화(content/) 및 Markdown 렌더링 차기 작업 |
| 2025-08-28 | 강의자료 동기화 스크립트 추가 및 레슨 라우트 | GPT | 프론트/콘텐츠 | 완료 | `scripts/sync_lessons.mjs`, `app/lessons/**` | `npm run content:sync`로 `content/lessons` 복사, `/lessons/*` Markdown 렌더 |
| 2025-08-28 | Linux 페이지에 강의자료 진입 동선 추가 | GPT | 프론트 | 완료 | `app/linux/page.tsx`, `app/linux/lessons/**` | 사이드바에 `/lessons`, `/lessons/plan` 버튼, `/linux/lessons/*` → `/lessons/*` 리다이렉트 |
| 2025-08-28 | 레슨 인덱스 개선: 파일 기반 목록/링크 | GPT | 프론트/콘텐츠 | 완료 | `app/lessons/page.tsx` | `content/lessons/<group>/*.md`를 읽어 제목 생성·클릭 이동 |
| 2025-08-28 | 그룹 인덱스/네비게이션 추가 | GPT | 프론트 | 완료 | `app/lessons/[group]/page.tsx`, `app/linux/page.tsx` | Linux → 4개 과정 카드(왕초보/초급/중급/고급), 각 그룹 목록 페이지 연결 |
| 2025-08-28 | 레슨 뷰 개선: TOC/코드 복사 버튼 | GPT | 프론트/콘텐츠 | 완료 | `lib/markdown.ts`, `components/lesson/MarkdownArticle.tsx` | heading→목차, 코드블록 Copy 버튼(hover) 추가 |
| 2025-08-28 | 링크/인코딩/404 보완 | GPT | 프론트 | 완료 | `app/lessons/**` | 한글 파일명 링크 `encodeURI`, notFound 경로 로깅, 그룹 표기 "왕초보 - 01 ..." |
| 2025-08-28 | Next 15 params 비동기 대응 | GPT | 프론트 | 완료 | `app/lessons/[...slug]/page.tsx`, `app/lessons/[group]/page.tsx` | `params` await 적용 + slug `decodeURIComponent`로 파일 경로 정상화 |
| 2025-08-28 | 공통 헤더 레이아웃 적용 | GPT | 프론트 | 완료 | `components/site/Header.tsx`, `app/layout.tsx` | 모든 페이지에서 헤더 유지, 개별 페이지 헤더 제거(home/linux) |
| 2025-08-28 | 레슨 목록 가독성(간격) 개선 | GPT | 프론트/UI | 완료 | `app/lessons/page.tsx`, `app/lessons/[group]/page.tsx` | 항목 간 `space-y-3` 및 `py-1` 적용으로 단원별 간격 확대 |
| 2025-08-28 | 과정 카드/본문 간격 개선 | GPT | 프론트/UI | 완료 | `app/linux/page.tsx`, `app/globals.css` | 카드 그리드 `gap-6`, 패딩 확대(`p-6`), Markdown 헤더/문단/리스트 여백 조정 |
| 2025-08-28 | 구분선(HR) 가독성 개선 | GPT | 프론트/UI | 완료 | `app/globals.css` | Markdown `---` → `<hr>` 상·하 간격(1.25rem) 및 색상 적용 |
---
문서 위치: `docs/progress.md`


## 2025-08-27 — 프론트 최소 구성 적용
- 홈 화면과 Linux 정보 페이지로 단순화.
- `Linux.jsx` 추가, `main.jsx`에서 기본 탭을 `home`으로 설정하고 다른 기능(Quiz/Q&A) 주석 처리.
- `index.html` 타이틀을 "CoreTech — Linux 학습"으로 변경.
- 목적: MVP 확인을 위한 최소 라우팅(클릭으로 Linux 진입) 준비.


## 2025-08-27 — 학습자료(lessons) 추가
- `pdf/` 내 왕초보/초급/중급/고급 디렉토리의 MD를 lessons로 복사.
- 경로: `src/frontend/public/content/lessons/{absolute-beginner,beginner,intermediate,advanced}`
- `pdf/plan.md`를 `public/content/lessons/plan.md`로 배치, `index.json` 매니페스트 추가.
- 디렉토리명은 ASCII 슬러그를 사용(한글 파일명은 유지). URL/호환성 안정성 확보 목적.
## 2025-08-28 — Next.js 루트 포팅 및 디자인 적용
- 목적: ai-prompt-lab 디자인/컴포넌트를 coretech 루트에 포팅하여 단일 앱으로 실행 단순화.
- 변경: `app/`(홈/리눅스), `components/ui`(Button/Card/Textarea), `app/globals.css`(OKLCH 토큰), `lib/utils.ts`, `next.config.mjs`, `tsconfig.json` 추가.
- 정리: Vite 관련 설정(루트 config 및 `src/frontend` 런타임 파일) 비활성화/정리. CI는 루트에서 설치/빌드.
- 실행: 루트에서 `npm install && npm run dev` → http://localhost:3000
