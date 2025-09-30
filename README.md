# CoreTech (A2A 협업 프로젝트)


## 🚀 한눈에 보는 특징
- 📝 **데일리 퀴즈**: 카테고리별 50문제, 풀이/즐겨찾기 추적
- 📚 **강의 자료**: Markdown 기반 커리큘럼
- 💬 **커뮤니티**: 게시판, Q&A, 댓글, 좋아요
- 🔐 **인증 & 권한**: JWT 기반 로그인, 관리자 전용 엔드포인트
- 🐳 **풀스택 개발 환경**: FastAPI + Next.js, Docker Compose 지원


✨ 주요 기능

개인화된 홈 – 공지사항, 빠른 퀴즈 진행률, 게시판/질문&답변 하이라이트를 한눈에.

데일리 퀴즈 – Linux / Server Ops / Network / Database 각 50문제 제공, 풀이 여부와 즐겨찾기 추적.

커뮤니티 도구 – 게시판, Q&A, 태그, 댓글, 좋아요, 조회수 확인.

구조화된 강의 – Markdown 기반 커리큘럼을 백엔드에서 제공하고 프론트에서 렌더링.

인증 + 권한 – JWT 인증, 서버 컴포넌트 쿠키 지원, 관리자 전용 API 포함.

📂 저장소 구조
backend/
  backend_src/         # FastAPI 앱 (main.py, 인증, 라우터, 모델 등)
  content/             # Markdown 강의 자료
config/                # pytest.ini 및 설정 파일
docs/                  # 요구사항, 명세, 로드맵, 진행 로그
frontend/              # Next.js 15 앱
  components/          # UI 컴포넌트 및 위젯
  app/                 # App Router 페이지 및 API 라우트
scripts/               # 데이터 시딩 및 유틸리티 스크립트
assets/, misc/, src/   # 기타 자료 및 레거시 코드

🛠️ 기술 스택

프론트엔드: Next.js 15, React 18, Tailwind, shadcn/ui, Playwright

백엔드: FastAPI, SQLAlchemy, Pydantic, JWT 인증, SQLite/Postgres

도구: npm, pip, Docker Compose, pytest, Ruff/Black, eslint

🚀 필수 준비물

Node.js ≥ 20

Python ≥ 3.11

npm & pip

(선택) Docker Desktop


## 📂 Repository 구조
- `ai-prompt-lab/` : Next.js 프론트엔드(디자인/컴포넌트/페이지)
- `src/backend/` : FastAPI 백엔드
- `tests/` : `src/` 미러 구조의 테스트 폴더
- `docs/design.md` : 설계/결정 기록
- `logs/` : 날짜·에이전트별 대화/결정 로그(JSONL)
- `scripts/` : 로그 append/집계 유틸리티
- `.github/` : 이슈/PR 템플릿 및 CI


## 📑 프론트엔드 라우트
경로	설명
/	대시보드 (공지, 진행도, Q&A 티저 등)
/daily	카테고리별 퀴즈 목록
/daily/[id]	퀴즈 상세 및 풀이
/daily/sets	전체 퀴즈 카탈로그 (즐겨찾기/필터 지원)
/board	게시판 글 목록 및 상세
/qna	Q&A 피드 및 태깅
/lessons, /lessons/[group]	강의 디렉토리 및 렌더링
/admin/*	관리자 콘솔 (권한 필요)
/login, /register, /profile	인증/회원 관련 페이지

## 📡 API 참고
메소드 & 경로	설명
GET /health	서버 연결 체크
POST /api/v1/auth/register	회원가입
POST /api/v1/auth/login	로그인 (JWT + 쿠키 발급)
POST /api/v1/auth/logout	로그아웃 (쿠키 제거)
GET /api/v1/daily/tests	퀴즈 목록 조회 (카테고리 필터 지원)
GET /api/v1/daily/tests/{id}	퀴즈 상세 조회
POST /api/v1/daily/tests/{id}/submit	답안 제출 및 정답 체크
GET /api/v1/daily/user-state	푼 문제 / 즐겨찾기 ID 조회
GET /api/v1/daily/progress?by=category	카테고리별 진행률
GET /api/v1/notice	공지사항 목록
GET /api/v1/board/posts	게시글 목록
GET /api/v1/qna/questions	Q&A 피드


<details>
<summary>📡 Full API Catalog (펼치기/접기)</summary>

### 🔑 Authentication
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/verify-token`
- `POST /api/v1/auth/refresh`

---

### 📢 Notices
- `GET /api/v1/notice`
- `POST /api/v1/notice` *(admin)*
- `GET /api/v1/notice/{id}`
- `PUT /api/v1/notice/{id}` *(admin)*
- `DELETE /api/v1/notice/{id}` *(admin)*

---

### 📝 Board
- `GET /api/v1/board/posts`
- `GET /api/v1/board/posts/{id}`
- `POST /api/v1/board/posts`
- `PUT /api/v1/board/posts/{id}`
- `DELETE /api/v1/board/posts/{id}`
- `POST /api/v1/board/posts/{id}/view`
- `POST /api/v1/board/posts/{id}/like`

---

### ❓ Q&A
- `GET /api/v1/qna/questions`
- `GET /api/v1/qna/questions/{id}`
- `POST /api/v1/qna/questions`
- `PUT /api/v1/qna/questions/{id}`
- `DELETE /api/v1/qna/questions/{id}`
- `POST /api/v1/qna/questions/{id}/answers`
- `POST /api/v1/qna/questions/{id}/view`

---

### 💬 Comments
- `GET /api/v1/comments`
- `POST /api/v1/comments`
- `DELETE /api/v1/comments/{id}`

---

### 👍 Likes
- `POST /api/v1/likes`
- `DELETE /api/v1/likes/{id}`

---

### 🎯 Daily Quizzes
- `GET /api/v1/daily/tests`
- `GET /api/v1/daily/tests/{id}`
- `POST /api/v1/daily/tests`
- `PUT /api/v1/daily/tests/{id}`
- `DELETE /api/v1/daily/tests/{id}`
- `POST /api/v1/daily/tests/{id}/submit`
- `POST /api/v1/daily/tests/{id}/solved`
- `POST /api/v1/daily/tests/{id}/favorite`
- `GET /api/v1/daily/user-state`
- `GET /api/v1/daily/progress`
- `POST /api/v1/daily/import`

---

### 📚 Lessons & Search
- `GET /api/v1/lesson-search`
- `GET /content/*` *(static lesson files)*

---

### 👤 Profile & Admin
- `GET /api/v1/profile`
- `GET /api/v1/admin/users`
- `POST /api/v1/admin/users/{id}/activate`
- `POST /api/v1/admin/users/{id}/deactivate`

---

<p><em>※ 세부 파라미터 및 스키마는 <code>backend/backend_src/main.py</code> 참조</em></p>

</details>


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


