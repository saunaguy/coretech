# 요구사항 분석표 (Linux 학습 웹사이트)

본 문서는 리눅스/네트워크/도커를 중심으로 한 학습 웹사이트의 요구사항을 정리합니다. 실습 친화적 커리큘럼 구조, 퀴즈/진도 추적, 이후 브라우저 기반 실습 랩(터미널/도커)을 단계적으로 도입합니다.

## 1) 프로젝트 개요
- 목적: 초·중급 학습자를 대상으로 리눅스, 네트워크, 도커 개념과 실습을 체계적으로 제공
- 접근: 트랙(분야) → 모듈(주제) → 레슨(개별 학습) 구조, 퀴즈·요약·실습 과제 포함
- 범주: Linux(파일/권한/프로세스/서비스), Network(TCP/IP, 라우팅, DNS, 방화벽), Docker(이미지/컨테이너/Compose)

## 2) 단계별 범위(로드맵)
- Phase 1: 공개 콘텐츠 뼈대(Markdown 렌더링), 검색/태그, 객관식 퀴즈, 로컬 진도 저장(localStorage)
- Phase 2: 로그인/권한(RBAC), 서버 진도/뱃지 저장, 관리자(CMS) 초안→발행, 댓글/문의
- Phase 3: 브라우저 실습 랩(터미널 에뮬레이터/컨테이너 격리), 자동 채점, 완료증/인증서

## 3) 기능 요구사항 (FR)
| ID | 설명 | 우선순위 | 수용기준(AC) | 상태 |
|----|------|----------|--------------|------|
| FR-01 | 콘텐츠 구조(트랙/모듈/레슨) | High | 목록/상세 뷰 및 API 제공 | 예정 |
| FR-02 | 레슨 렌더링(Markdown→HTML) | High | 코드 하이라이트, TOC, 이전/다음 네비 | 예정 |
| FR-03 | 퀴즈(객관식/단답) | High | 레슨 단위 퀴즈, 즉시 정답/해설 표시 | 예정 |
| FR-04 | 검색/필터 | High | 제목/본문/태그/난이도 검색, 주제 필터(Linux/Network/Docker) | 예정 |
| FR-05 | 진도 추적(MVP) | High | 레슨 완료·퀴즈 결과를 로컬에 저장 및 렌더 | 예정 |
| FR-06 | 학습 경로/목차 | Medium | 트랙/모듈/레슨 사이드바, 완료율 표시 | 예정 |
| FR-07 | 태그/메타데이터 | Medium | 태그(예: shell, systemd, tcp/ip, compose), 난이도, 예상시간 | 예정 |
| FR-08 | 인증/권한(RBAC) | High(P2) | 사용자/에디터/관리자 역할, GitHub OAuth | 예정 |
| FR-09 | CMS(콘텐츠 관리) | High(P2) | 초안→리뷰→발행, 버전 이력, 미리보기 | 예정 |
| FR-10 | 실습 랩(브라우저) | High(P3) | 제한된 터미널/컨테이너 격리, 과제 자동 채점 | 예정 |
| FR-11 | 통계/분석 | Medium | 페이지 뷰/이탈/퀴즈 성과 집계(비식별) | 예정 |
| FR-12 | 국제화(i18n) | Low | ko 기반, en 추가(메뉴/레슨 문자열) | 예정 |
| FR-13 | 인프라/기반 | High | `/health`, 로그 스크립트, CI, 테스트 | 일부 완료 |

참고: FR-13은 현재 레포 상태(헬스체크, 로그 스크립트, CI/테스트 기본)와 연결됩니다.

## 4) 비기능 요구사항 (NFR)
- 접근성: WCAG 2.1 AA 준수(키보드 내비, 명도 대비, ARIA)
- 반응형: 모바일~데스크톱 가독성 최적화
- 성능: Core Web Vitals 준수(LCP < 2.5s, TTI < 3.5s, CLS 안정)
- 보안: OWASP Top 10, 레이트 리밋/입력 검증, 비밀 분리(.env)
- 품질: 린트/포맷 통과, 핵심 로직 테스트 커버리지 확보(백엔드≥80% 권장)
- 신뢰성: 에러 로깅/간단 모니터링, 장애 시 복구 가이드
- SEO: 메타/오픈그래프/사이트맵, 구조화 데이터(필요 시)
- 국제화: 언어 토글 및 폴백 문자열 관리

## 5) 정보 구조 & 내비게이션
- 글로벌 내비: 트랙(Linux/Network/Docker), 검색, 진행도
- 사이드바: 모듈/레슨 계층, 현재 위치/완료 상태 표시
- 본문: 목표→개념→예제→실습→요약→퀴즈 흐름 권장

## 6) API 개요(초안, `/api/v1`)
- 콘텐츠
  - `GET /tracks` / `GET /tracks/{id}`
  - `GET /modules?track_id=` / `GET /modules/{id}`
  - `GET /lessons/{id}`
  - `GET /search?q=&tags=&difficulty=`
- 학습 상태(Phase 2)
  - `GET /progress/me` / `POST /progress`(완료/점수)
  - `POST /quiz/submit`
- 관리(Phase 2)
  - `POST /content`(초안) / `POST /content/{id}/publish` / 버전 이력

## 7) 데이터 모델(초안)
- Track(id, title, slug, description, order)
- Module(id, track_id, title, slug, order)
- Lesson(id, module_id, title, slug, md_path, tags[], difficulty, duration_min)
- Quiz(id, lesson_id, type, prompt, options[], answer, explanation)
- Progress(user_id, lesson_id, status[done/partial], score, updated_at)

초기에는 Markdown 기반 콘텐츠 저장을 권장(`content/<track>/<module>/<lesson>.md`). 이후 CMS로 이관.

## 8) 제약사항 & 가정
- 스택: FE(React+Vite) / BE(FastAPI) / DB(SQLite→Postgres)
- 실습 랩: 보안/리소스 고려로 Phase 3에 도입(컨테이너 격리, 시간/명령 제한)
- 인증: GitHub OAuth 우선, 이메일/패스워드는 차후 검토

## 9) 리스크 및 대응
- 랩 격리/보안 난이도↑ → 도입 전 PoC, 자원/비용 산정, 제한된 커맨드 화이트리스트
- 콘텐츠 제작 리소스 → 템플릿/스타일가이드 제공, 우선순위 트랙부터 발행
- 스팸/악성 댓글 → 모더레이션/신고, 속도 제한

## 10) 완료 기준(DoD)
- 코드/문서/테스트/로그를 포함한 PR, CI 그린
- 레슨 페이지·퀴즈·진도(해당 단계 범위 내) 동작 확인
- README/문서 실행 가이드 최신화

## 11) 변경 관리
- 이슈(Decision 템플릿) → 토론 → PR → 머지, 주요 결정은 `logs/YYYY-MM-DD/room-<room>/` 기록

---
문서 위치: `docs/requirements.md`
<!-- INACTIVE for MVP: 본 문서는 향후 단계에서 재검토/적용 예정입니다. 현재 범위: 홈 → Linux 페이지 최소 기능. -->

