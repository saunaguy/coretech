# TODOs (MVP 우선순위)

본 문서는 ai‑prompt‑lab 디자인을 Vite 기반 MVP에 통합하고, 학습 기능(콘텐츠 렌더/퀴즈/진도)을 완성하기 위한 실행 가능한 작업 목록입니다. 체크박스는 PR 단위로 갱신합니다.

## Frontend (Vite, ai‑prompt‑lab 디자인 통합)
- [ ] Tailwind/POSTCSS 정합화: 글로벌 토큰/베이스 레이어 이식(`app/globals.css` → `src/frontend/index.css`)
- [ ] 유틸 추가: `cn` 유틸, `class-variance-authority`, `clsx`, `tailwind-merge`
- [ ] 컴포넌트 포팅 1차: Button, Card, Tabs, Alert
- [ ] 레이아웃 적용: Header/Sidebar/Layout 프레임(ai‑prompt‑lab 스타일 반영)
- [ ] 다크모드(간소화): `html.classList` 토글 기반
- [ ] Markdown 렌더러: TOC/코드 하이라이트, 내부 링크/이전·다음 네비
- [ ] 레슨 네비게이션: 사이드바 트리(Track/Module/Lesson), 완료 배지
- [ ] 검색/태그: 제목/태그/본문 간단 검색 + 태그 필터

## Backend (FastAPI)
- [ ] `/api/v1/content` 목록/상세: `content/` 경로 인덱싱 및 메타 반환
- [ ] `/api/v1/quiz` 제출(스텁): 클라이언트 채점과 호환되는 요청/응답 스키마
- [ ] `/api/v1/qna` 스켈레톤 유지(목록/생성/조회), 테스트 보강
- [ ] CORS/헬스체크 재검증, pytest 커버리지 ≥80% 목표(핵심 로직 기준)

## Content
- [ ] 소스 표준화: `content/<track>/<module>/<lesson>.md`로 일원화
- [ ] Front‑matter 템플릿: `title`, `slug`, `tags[]`, `difficulty`, `duration_min`
- [ ] 목차/메타 생성 스크립트: `assets` 또는 `scripts`에 인덱서 추가
- [ ] 예제 3~5개 레슨으로 엔드투엔드 흐름 검증

## DevEx/CI
- [ ] 패키지 매니저 통일(pnpm 또는 npm) 및 lock 파일 하나만 유지
- [ ] lint/format/test 스크립트 정리 및 README 반영
- [ ] 프론트/백 통합 프리뷰 스크립트(`npm run dev:all`) 추가(선택)

## Decisions (記錄)
- [ ] 디자인 통합 방식 확정: Vite에 포팅 vs Next.js로 전환(비용/효익 비교)
- [ ] 콘텐츠 경로/배포 전략 확정(정적 빌드 vs API 페치)
- [ ] 브라우저 랩(Phase 3) PoC 범위/보안 정책

---
담당/기한/연계 이슈는 PR에서 링크합니다.

