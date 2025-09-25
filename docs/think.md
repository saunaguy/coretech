## /lesson 전환 후 정리 가이드

현재 프런트 학습 경로는 단일 `/lesson`로 통일되었습니다. 백엔드의 정적 파일(`/content/lesson/**.md`)을 클라이언트에서 fetch하여 렌더하고, 본문 검색은 `/api/v1/lesson-search?q=&limit=` API를 사용합니다(최대 200).

### 삭제해도 되는 것 (안전)
- `frontend/app/linux/` 전체: 이전 리액트 기반 학습 화면. 현재 라우트/네비에서 진입 경로 없음.
- `frontend/app/linuxtest/` 전체: 옛 마크다운 뷰어 경로. 현 라우팅에서 사용하지 않음.
- `frontend/e2e/linuxtest2.spec.ts`: `/lesson`용 `lesson.spec.ts`로 대체됨.

### 상황 봐서 정리 권장 (사용 계획에 따라)
- `frontend/content/linux/pages/` 디렉터리: 과거 `/linuxtest`에서 사용한 로컬 MD 모음. `/lesson`은 백엔드의 `/content/lesson/**.md`만 사용하므로 필요 없다면 삭제 가능. 외부 문서/직접 링크 의존성 여부 확인 후 제거 권장.
- `components/linux/LinuxSidebar.tsx`의 로컬 인덱싱 분기: 현재 `/lesson`에서는 `remoteLessonSearch={true}`로 원격 검색만 사용. 로컬 인덱싱을 영구 비활성화할 계획이면
  - `loadLinuxContent` import 및 관련 인덱싱 코드 제거
  - 혹은 동적 import로 전환하여 번들 경량화 권장

### 유지해야 하는 것 (필수/권장)
- `frontend/app/lesson/page.tsx`: 새 학습 메인 화면.
- `frontend/lib/linux-data.ts`: 사이드바 토픽/항목 정의. `/lesson`에서도 그대로 사용됨.
- `frontend/content/linux/01`, `02`, `03`, `04`, `05`, `basics`, `loader.ts`: 추후 로컬 인덱싱(옵션) 또는 콘텐츠 구성 참조에 대비해 유지 권장.
- `frontend/app/lessons/**`: 별도 강의자료 섹션으로 `/lesson` 전환과 무관. 그대로 유지.
- 백엔드 `GET /api/v1/lesson-search` 및 `/content/lesson/**` 서빙 로직: `/lesson`의 검색/본문 로딩에 필요.

### 라우팅/네비게이션 반영 상태
- 홈 그리드, 헤더, 모바일 사이드바의 "Linux 기초" 링크: `/lesson`으로 변경됨.
- `/linuxtest2` → `/lesson` 이전 완료(페이지 파일 이동). 별도 리다이렉트는 없음.

### 선택 사항 (필요 시)
- 외부 북마크/SEO 고려해 `/linux`, `/linuxtest2`를 `/lesson`으로 리다이렉트하는 얇은 페이지 추가 가능.

### 검색/제한 값
- 프런트: `limit=200`으로 호출
- 백엔드: `limit` 검증 상한 `le=200`(FastAPI) — 필요 시 상향 조정 가능

### 정리 후 체크리스트
- 타입체크/빌드 통과 확인: `npm run build`(프런트)
- 라우팅 점검: `/lesson` 진입, 사이드바 선택, 본문 로딩 OK
- 검색 점검: 내용 포함 검색 활성화 시 결과 반환 OK(422 미발생)
- 사용하지 않는 폴더/파일 삭제 후, 번들 크기/빌드 시간 감소 확인
