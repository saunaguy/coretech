# 진행 로그

| 날짜 | 작업 | 범주 | 상태 | 산출물 |
|---|---|---|---|---|
| 2025-09-03 | 홈 섹션 레이아웃(공지/테스트 2열) | 프론트 | 진행 | `app/page.tsx`, `components/site/*` |
| 2025-09-03 | 카테고리 4타일 컴포넌트 | 프론트 | 진행 | `components/site/CategoryGrid.tsx` |
| 2025-09-03 | 공지 API/카드(5건 + 더보기) | 프론트/백 | 예정 | `NoticeListCard.tsx`, `/api/v1/notice` |
| 2025-09-03 | 간단한 테스트 진행률 API/카드 | 프론트/백 | 예정 | `QuickTestsCard.tsx`, `/api/v1/daily/*` |
| 2025-09-03 | 커뮤니티 허브 탭 프레임 | 프론트 | 예정 | `app/community/page.tsx` |
| 2025-09-03 | 문서 검토: index/spec/todos 확인 및 계획 동기화 | 관리 | 완료 | `docs/index.md`, `docs/spec.md`, `docs/todos.md` |
| 2025-09-03 | 홈 카테고리 4타일 컴포넌트 | 프론트 | 완료 | `components/site/CategoryGrid.tsx` |
| 2025-09-03 | 공지/테스트 카드 스캐폴딩 | 프론트 | 완료 | `components/site/NoticeListCard.tsx`, `components/site/QuickTestsCard.tsx` |
| 2025-09-03 | 홈 레이아웃에 공지/테스트 섹션 반영 | 프론트 | 완료 | `app/page.tsx` |
| 2025-09-03 | 백엔드 Notice/Progress API 구현 | 백엔드 | 완료 | `GET /api/v1/notice`, `GET /api/v1/daily/progress` |
| 2025-09-03 | UI 기본 컴포넌트 추가 | 프론트 | 완료 | `components/ui/button.tsx`, `components/ui/card.tsx` |
| 2025-09-03 | 공지 라우트 구현(목록/상세) | 프론트 | 완료 | `app/notice/page.tsx`, `app/notice/[id]/page.tsx` |
| 2025-09-03 | Next.js 빌드 오류 수정: 루트 레이아웃 추가 | 프론트 | 완료 | `app/layout.tsx`, `app/globals.css` |
| 2025-09-03 | 헤더 복원 및 네비 정리 | 프론트 | 완료 | `components/site/Header.tsx`, `app/layout.tsx` |

| 2025-09-04 16:20 | 실습 랜딩/상세 연결, 전역 헤더 정리, 노션 링크 적용 | 프론트 | 완료 | app/practice/page.tsx, app/practice/linux-exam1/page.tsx, components/ui/*, next.config.mjs |
| 2025-09-08 | 리눅스 레슨: 사이드바/상세 구조 확인 및 가이드 문서화 | 프론트/문서 | 완료 | docs/error.md (가이드), frontend/app/linux/page.tsx, components/linux/LinuxSidebar.tsx |
| 2025-09-08 | 리눅스 커리큘럼 페이지 초안 추가 후 제거 | 프론트 | 완료 | +frontend/app/linux/plan/page.tsx (추가) → 삭제 |
| 2025-09-08 | 사이드바에 커리큘럼(대단원/장/소목차) 데이터 통합 | 프론트 | 완료 | frontend/lib/linux-data.ts |
| 2025-09-08 | 사이드바 개선: 기본 전개/검색 연동, 글자 크기/들여쓰기 조정 | 프론트 | 완료 | components/linux/LinuxSidebar.tsx |
| 2025-09-08 | 동적 MD→블록 유틸/API 추가 후 실효성 문제로 롤백 | 프론트/문서 | 완료 | +frontend/lib/md-blocks.ts, +app/api/linux/blocks → 삭제, +docs/docsutil.md → 삭제 |
| 2025-09-08 | 01장 콘텐츠 확충(1-1~1-4) — 문서 톤 반영 | 프론트 | 완료 | frontend/lib/linux-data.ts |
| 2025-09-08 | 모듈화 1차: 01장 콘텐츠 파일 분리 + 동적 import | 프론트 | 완료 | +frontend/content/linux/01/01-1.ts~01-4.ts, +frontend/content/linux/loader.ts, app/linux/page.tsx (동적 로딩), linux-data.ts (loaderKey 추가) |
| 2025-09-08 | 대단원 토글(접기/펼치기) 지원 | 프론트 | 완료 | components/linux/LinuxSidebar.tsx |
| 2025-09-08 | 리팩터링 계획서 작성(데이터/콘텐츠 분리, 청크 로딩) | 문서 | 완료 | docs/think.md |
