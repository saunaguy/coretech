# 홈/커뮤니티 스펙 (for Codex)

## 공통
- UI: Next.js(App Router) + Tailwind + 재사용 컴포넌트(`components/site/*`)
- 데이터: 내부 API(`INTERNAL_API_BASE_URL`), 서버 컴포넌트에서 fetch
- 에러/로딩/빈상태 컴포넌트 필수

## 1) 홈 `/`
### 섹션 A — 카테고리 4타일
- 컴포넌트: `CategoryGrid.tsx`
- 항목: Linux 기초(`/lectures/linux`), 서버 관리(`/lectures/server`), 네트워크(`/lectures/network`), 커뮤니티(`/community`)
- 카드 아이콘/타이틀/설명, hover 강조

### 섹션 B — 공지사항 (좌)
- 컴포넌트: `NoticeListCard.tsx`
- API: `GET /api/v1/notice?limit=5` (pin 우선 정렬)
- 아이템: 제목, 라벨(`중요|공지|업데이트|이벤트`), 작성자, 게시 시간
- “더보기” → `/notice`

### 섹션 C — 간단한 테스트 (우)
- 컴포넌트: `QuickTestsCard.tsx`
- API: 
  - 목록: `GET /api/v1/daily/tests?category=linux|server|network`
  - 진행률: `GET /api/v1/daily/progress?by=category`
- 카드 행: 카테고리 배지 + 제목 + 진행률 바(퍼센트)
- “더보기” → `/quiz`

## 2) 커뮤니티 허브 `/community`
- 상단 탭: **게시판 | Q&A | 공지**  
- 탭별 리스트는 내부 구현을 `ai-prompt-lab (4)` 스타일로 (카드형 목록, 페이지네이션, 검색/정렬)
- 공유 컴포넌트: `EmptyState`, `ErrorState`, `Pagination`

## 3) 자유게시판 `/board` (내부: ai-prompt-lab 4 참조)
- API
  - `GET /api/v1/board/posts?query=&sort=&page=1`
  - `GET /api/v1/board/posts/{id}`
  - `POST/PUT/DELETE` 보호 라우트
- 컴포넌트: `BoardList`, `BoardCard`, `BoardForm`

## 4) Q&A `/qna` (내부: ai-prompt-lab 4 참조)
- API
  - `GET /api/v1/qna/questions?status=&tag=&page=1`
  - `GET /api/v1/qna/questions/{id}`
  - `POST/PUT/DELETE` + `POST /qna/questions/{id}/replies`
- 컴포넌트: `QnaList`, `QnaDetail`, `QnaForm`, `ReplyList`

## 5) 데이터 모델(백엔드)
- `notices(id, title, body_md, label, is_pinned, author_id, created_at, updated_at)`
- `daily_tests(id, category, type, question, options(json), answer, explanation, difficulty, created_at)`
- `progress_user(category, user_id, percent)`  ← 간단한 진행률 계산용(없으면 API에서 계산)
- 게시판/질문/답변 모델은 기존 정의 사용

## 6) 완료 기준(DoD)
- 홈: 공지 5건/테스트 진행률 3~5행 렌더, “더보기” 동작
- 커뮤니티 허브: 탭 전환, 각 탭에서 리스트/페이지네이션
- 게시판/Q&A: 목록/상세/작성(로그인 게이트), 에러/로딩/빈상태 처리