# Auth/Board 연동 점검 보고서 (2025-09-12)

## 요약
- 로그인/회원가입과 게시판 DB 연동 과정에서 API 경로/토큰 파싱/인증 적용 누락 이슈를 확인하고 수정했습니다.
- 이제 로그인한 사용자로 게시글 생성/삭제가 동작하며, 목록·상세에 작성자명이 포함됩니다.

## 주요 수정 사항
1) 백엔드
- JWT 파싱 수정: `get_current_user`가 토큰의 `sub`(email)가 아닌 `id`로 사용자 조회하도록 변경.
- 게시판 API 보호 및 작성자 저장:
  - `POST /api/v1/board/posts` → `Depends(get_current_user)` 적용, `author_id=current_user.id` 저장, 응답에 `author` 포함.
  - `DELETE /api/v1/board/posts/{pid}` → 인증 및 본인 글만 삭제 가능(권한 없으면 403).
  - `GET /api/v1/board/posts`, `GET /api/v1/board/posts/{pid}` → 작성자명 포함되도록 `User.username` 조회.

2) 프론트엔드
- 로그인 API 경로 수정: `POST ${API_BASE_URL}/api/v1/auth/login`로 교정.
- 공통 인증 요청 유틸: `authenticatedFetch` 사용(토큰 자동 첨부, 204 처리 보완).
- 게시글 작성/삭제 토큰 전송:
  - `board/new` 글쓰기 페이지 → `authenticatedFetch`로 POST.
  - 삭제 버튼 → `authenticatedFetch`로 DELETE, 실패 시 안내.

## 현재 동작 상태
- 회원가입(`POST /api/v1/auth/register`) → 로그인 → 글 작성/삭제: 정상 동작.
- 목록/상세에 작성자 표시: 정상(미가입/무명 글은 null/익명).
- 권한 제어: 본인 글만 삭제 가능.

## 재현/검증 절차
1. 백엔드/프론트 실행(환경변수 `API_BASE_URL` 일치 확인).
2. 회원가입 페이지에서 가입 후 로그인.
3. 게시판 글 작성 → 생성된 상세로 이동 확인(본인 작성자명 표시).
4. 목록에서 글 보임/작성자명 표시 확인.
5. 삭제 버튼 동작 확인(본인 글만 삭제 가능).

## 비고/추가 개선 제안
- 헤더 UX: 로그인 상태일 때 사용자명/로그아웃 노출(현재는 항상 “로그인” 링크 보임).
- 수정 페이지 보호: `/board/[id]/edit`에도 인증/권한 체크 적용 필요.
- 목록 작성자 조회: 현 구현은 행별 조회라 포스트 수가 많아지면 N+1 우려(필요시 조인/프리패치 고려).
- 라벨/텍스트: 로그인 폼의 ID 라벨이 email 입력과 혼용되어 있어 용어 정리 권장.

## 변경 파일 목록(요약)
- backend/backend_src/auth.py
- backend/backend_src/main.py
- frontend/lib/auth.ts
- frontend/app/board/new/page.tsx
- frontend/components/board/DeleteButton.tsx
