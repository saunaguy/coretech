# CoreTech (A2A 협업 프로젝트)

---

## ✨ 주요 기능
- 🏠 **개인화된 홈**: 공지사항, 퀴즈 진행률, 즐겨찾기·최근 풀이 문제, Q&A/게시판 하이라이트  
- 📝 **데일리 퀴즈**: Linux·Server Ops·Network·Database 각 50문제, 풀이 여부 저장, 오답노트·즐겨찾기, 정답률 통계, 레벨업 표시  
- 💬 **커뮤니티 도구**: 게시판, Q&A, 태그, 댓글, 좋아요, 조회수, 답변 채택·검색/정렬 기능, 강의/문제 연계 토론  
- 📚 **구조화된 강의 자료**: Markdown 기반 커리큘럼, 학습 진행률, 강의 내 퀴즈/예제 연동, PDF 다운로드 및 북마크  
- 🔐 **인증 + 권한**: JWT 인증·쿠키 세션, 관리자 전용 API(공지·게시물·권한 관리), 활동 로그·학습 데이터 통계  
- ⭐ **학습 편의 기능**: 즐겨찾기, 오답노트, 난이도/정답률 기반 추천 문제, 강의-퀴즈-커뮤니티 연결, 다크 모드·반응형 UI  
- 🐳 **개발 및 운영 환경**: FastAPI + Next.js 풀스택, Docker Compose, CI/CD, pytest 기반 개발/운영 환경 분리  



# CoreTech

Linux · Server · Network 학습 플랫폼 🚀

## 📂 문서
- [부하 테스트 보고서 (2025-10-01)](docs/test-report(10.01).md)
- [패치 노트 (Patch Notes)](docs/patchnote.md)


---

## 📂 저장소 구조
```text
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
```

---

## 🛠️ 기술 스택
- 🎨 **프론트엔드**: Next.js 15, React 18, Tailwind CSS, shadcn/ui, Playwright  
- ⚙️ **백엔드**: FastAPI, SQLAlchemy, Pydantic, JWT 인증, SQLite / PostgreSQL  
- 🌐 **리버스 프록시**: Nginx (HTTPS 처리, 로드밸런싱, 정적 자원 서빙)  
- 🧰 **개발 도구**: npm, pip, Docker Compose, pytest, Ruff / Black, eslint  

---

## 🚀 필수 준비물
- **Node.js ≥ 20**  
- **Python ≥ 3.11**  
- **npm & pip**  
- **(선택)** Docker Desktop  

---

## 📑 프론트엔드 라우트
| 경로 | 설명 |
|------|------|
| `/` | 대시보드 (공지, 진행도, Q&A 티저 등) |
| `/daily` | 카테고리별 퀴즈 목록 |
| `/daily/[id]` | 퀴즈 상세 및 풀이 |
| `/daily/sets` | 전체 퀴즈 카탈로그 (즐겨찾기/필터 지원) |
| `/board` | 게시판 글 목록 및 상세 |
| `/qna` | Q&A 피드 및 태깅 |
| `/lessons`, `/lessons/[group]` | 강의 디렉토리 및 렌더링 |
| `/admin/*` | 관리자 콘솔 (권한 필요) |
| `/login`, `/register`, `/profile` | 인증/회원 관련 페이지 |

---

<details>
<summary>📡 <strong>Backend Full API Catalog (펼치기/접기)</strong></summary>

### 🔑 Authentication
- **POST** `/api/v1/auth/register`  
- **POST** `/api/v1/auth/login`  
- **POST** `/api/v1/auth/logout`  
- **POST** `/api/v1/auth/verify-token`  
- **POST** `/api/v1/auth/refresh`  

---

### 📢 Notices
- **GET** `/api/v1/notice`  
- **POST** `/api/v1/notice` *(admin)*  
- **GET** `/api/v1/notice/{id}`  
- **PUT** `/api/v1/notice/{id}` *(admin)*  
- **DELETE** `/api/v1/notice/{id}` *(admin)*  

---

### 📝 Board
- **GET** `/api/v1/board/posts`  
- **GET** `/api/v1/board/posts/{id}`  
- **POST** `/api/v1/board/posts`  
- **PUT** `/api/v1/board/posts/{id}`  
- **DELETE** `/api/v1/board/posts/{id}`  
- **POST** `/api/v1/board/posts/{id}/view`  
- **POST** `/api/v1/board/posts/{id}/like`  

---

### ❓ Q&A
- **GET** `/api/v1/qna/questions`  
- **GET** `/api/v1/qna/questions/{id}`  
- **POST** `/api/v1/qna/questions`  
- **PUT** `/api/v1/qna/questions/{id}`  
- **DELETE** `/api/v1/qna/questions/{id}`  
- **POST** `/api/v1/qna/questions/{id}/answers`  
- **POST** `/api/v1/qna/questions/{id}/view`  

---

### 💬 Comments
- **GET** `/api/v1/comments`  
- **POST** `/api/v1/comments`  
- **DELETE** `/api/v1/comments/{id}`  

---

### 👍 Likes
- **POST** `/api/v1/likes`  
- **DELETE** `/api/v1/likes/{id}`  

---

### 🎯 Daily Quizzes
- **GET** `/api/v1/daily/tests`  
- **GET** `/api/v1/daily/tests/{id}`  
- **POST** `/api/v1/daily/tests`  
- **PUT** `/api/v1/daily/tests/{id}`  
- **DELETE** `/api/v1/daily/tests/{id}`  
- **POST** `/api/v1/daily/tests/{id}/submit`  
- **POST** `/api/v1/daily/tests/{id}/solved`  
- **POST** `/api/v1/daily/tests/{id}/favorite`  
- **GET** `/api/v1/daily/user-state`  
- **GET** `/api/v1/daily/progress`  
- **POST** `/api/v1/daily/import`  

---

### 📚 Lessons & Search
- **GET** `/api/v1/lesson-search`  
- **GET** `/content/*` *(static lesson files)*  

---

### 👤 Profile & Admin
- **GET** `/api/v1/profile`  
- **GET** `/api/v1/admin/users`  
- **POST** `/api/v1/admin/users/{id}/activate`  
- **POST** `/api/v1/admin/users/{id}/deactivate`  

---

<p><em>※ 세부 파라미터 및 스키마는 <code>backend/backend_src/main.py</code> 참조</em></p>
</details>
