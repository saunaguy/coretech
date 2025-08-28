# 고도화 전략 및 로드맵

본 문서는 Linux/Network/Docker 학습 사이트의 단계별 고도화 전략을 정의합니다. 프론트엔드는 ai‑prompt‑lab(Next.js)을 주 애플리케이션으로 채택합니다.

## 원칙
- 콘텐츠 우선: 레슨/퀴즈가 학습 흐름을 끊지 않게 단순하고 빠르게 동작
- 점진적 설계: MVP → 개선 → 확장, 리스크 높은 실습 랩은 별도 PoC 후 도입
- 측정 가능: 완료 기준(DoD)과 간단 지표를 각 작업에 부여

## 디자인 베이스라인(ai‑prompt‑lab, Next.js)
- 토큰: OKLCH 기반 컬러 토큰과 radius 변수 적용(`app/globals.css` 스타일 이식)
- 컴포넌트: shadcn/ui 패턴(`cva` + `cn` 유틸)에서 필요한 최소 컴포넌트부터 포팅(Button, Card, Sidebar, Tabs 등)
- 테마: `next-themes` 유사 다크모드 토글은 MVP에선 간소화(클래스 토글)로 대체 가능
- 빌드: Tailwind v4 + PostCSS 설정은 Next.js 환경에 맞춰 유지

## 아키텍처 개요
- 프론트: Next.js 15 + Tailwind v4(ai‑prompt‑lab), Markdown 렌더, 퀴즈/Q&A UI
- 백엔드: FastAPI, `/api/v1`(콘텐츠/퀴즈/Q&A/진도), SQLite(개발), Postgres(운영)
- 콘텐츠: `content/<track>/<module>/<lesson>.md` + front‑matter, 빌드 시/런타임 변환
- 검색: 초기엔 클라이언트/간단 서버 검색 → 이후 색인

## Phase 1 — 학습 MVP(Next.js 기반)
- 디자인 통합(주요):
  - 컬러/레이디우스 토큰과 base layer 이식(Tailwind 설정/글로벌 CSS 정합화)
  - `cn` 유틸, `class-variance-authority`, `clsx`, `tailwind-merge` 도입
  - 컴포넌트 포팅 1차: Button, Card, Sidebar, Tabs, Alert
  - 레이아웃: Header/Sidebar/Layout 프레임 구성(홈→Linux 최소 흐름 유지)
- 콘텐츠 파이프라인:
  - 소스 경로 표준화: `content/<track>/<module>/<lesson>.md`를 단일 소스로 채택
  - Markdown → HTML(코드 하이라이트, TOC), 이전/다음 네비게이션
- 학습 기능:
  - 퀴즈: 레슨 단위 객관식/단답(클라이언트 채점 우선)
  - 진도: 완료/점수 `localStorage` 저장 및 UI 배지
  - 검색/태그: 제목/태그/본문 간단 검색과 태그 필터

### Phase 1 DoD
- Next.js 앱(ai‑prompt‑lab)에서 레이아웃·토큰·핵심 컴포넌트 1차 반영
- `content/`의 Markdown이 렌더되고 TOC/코드 하이라이트 동작
- 레슨별 퀴즈와 로컬 진도 저장이 UI에 반영
- 린트/포맷/테스트 통과, 간단 문서(README 실행 가이드, 디자인 통합 노트) 업데이트

## Phase 2 — 협업/운영화
- 인증/권한: GitHub OAuth, 에디터/관리자 권한
- CMS 워크플로: 초안→리뷰→발행, 버전 이력, 미리보기
- 서버 진도/뱃지: 사용자별 진행/점수 저장, 요약 대시보드
- 품질/운영: E2E(선택), 모니터링·로그 집계, 다국어 기초(en)

## Phase 3 — 실습 랩
- 브라우저 터미널/컨테이너 격리, 과제 자동 채점(화이트리스트 명령)
- 코스트/보안 가드레일: 자원 제한, 방화벽/네트워크 격리, 사용량 측정

## 지표(예시)
- 학습: 레슨 완료율, 퀴즈 정답률, Q&A 해결률
- 품질: 빌드/테스트 통과율, 오류율, LCP/TTI
- 운영: 주간 신규 레슨 수, 콘텐츠 리뷰 사이클 타임

---
문서 위치: `docs/roadmap.md`

