# TODO — 홈/커뮤니티 우선 작업

## 프론트 (우선순위 상→하)
- [ ] `app/page.tsx` 홈 레이아웃 섹션 그리드(좌: 공지 / 우: 테스트)
- [ ] `components/site/CategoryGrid.tsx` 4타일
- [ ] `components/site/NoticeListCard.tsx` + fetch(`/api/v1/notice?limit=5`)
- [ ] `components/site/QuickTestsCard.tsx` + fetch 진행률 API
- [ ] `/community` 탭 페이지 프레임 + 빈상태/에러/페이지네이션 공통
- [ ] `/notice` 목록/상세 라우트
- [ ] `/quiz` 목록/상세 라우트
- [ ] 상단 네비게이션 라벨/링크 정리: “Linux 기초 / 게시판 / Q&A / 소개 / 로그인”

## 백엔드
- [ ] `GET /api/v1/notice?limit=` (pin 우선, label 포함)
- [ ] `GET /api/v1/daily/tests?category=...`
- [ ] `GET /api/v1/daily/progress?by=category` (더미 계산/고정값 허용)
- [ ] 게시판/Q&A API는 `ai-prompt-lab (4)` 규격 유지

## 품질/DoD
- [ ] 모바일 1열 반응형, 로딩 스켈레톤
- [ ] 더보기 링크 정상 이동
- [ ] 404/에러 경계
