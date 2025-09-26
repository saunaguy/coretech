## /lesson 콘텐츠 구조와 검색 방식 요약

### 로컬 인덱싱(프론트)
- 개념: 프론트가 로컬 소스(`frontend/content/linux/**`)를 동적 import로 불러와 텍스트를 추출하고, 클라이언트 메모리에서 검색/필터링.
- 위치/코드: `frontend/components/linux/LinuxSidebar.tsx`가 `loadLinuxContent`를 통해 로컬 블록(heading/paragraph/list/code 등)을 읽어 인덱스 생성.
- 트리거: 사이드바에서 "내용 포함 검색" 체크 시(로컬 인덱싱 모드일 때).
- 장점: 백엔드 없이도 즉시 검색 가능, 오프라인/데모 용이.
- 단점: 번들 비대화/빌드시간 증가, 백엔드 MD와 이중화 시 유지보수 부담, `loader.ts`가 참조하는 `./01`, `./02` 경로가 없으면 빌드 에러.

### 원격 검색(백엔드)
- 개념: 백엔드가 Markdown을 인덱싱해 API로 검색 결과를 반환. 프론트는 섹션/인덱스 키만 받아 목록을 필터링.
- 정적 서빙: FastAPI가 `backend/content`를 `/content`로 마운트 → `GET /content/lesson/{section}/{index}.md`.
- 검색 API: `GET /api/v1/lesson-search?q=...&limit=...` (FastAPI: `backend/backend_src/main.py`). 내부적으로 `backend/content/lesson/**.md`를 스캔하여 캐시/TTL(기본 45초) 유지.
- 장점: 프론트 번들 경량, 단일 소스(MD)로 일원화, 대량 문서 확장성 우수.
- 단점: 백엔드 기동 필요, 최초 인덱스 빌드 시 약간의 레이턴시.

### /lesson 화면 동작 흐름
1) 사이드바 데이터: `frontend/lib/linux-data.ts`의 `linuxTopics`로 트리 렌더링.
2) 항목 선택 → 섹션/인덱스 추출: `page.tsx`가 `id/loaderKey`에서 `2-1`, `3` 같은 값을 파싱.
3) 본문 로드: `fetch(\`${API_BASE}/content/lesson/${section}/${index}.md\`)`로 MD를 가져와 렌더.
   - `API_BASE`: `NEXT_PUBLIC_API_BASE_URL`(예: `http://localhost:8000`), 미설정 시 기본값 사용.
4) 내용 포함 검색: 원격 모드일 때 `/api/v1/lesson-search` 호출 결과의 `{section,index}` 키로 사이드바 항목 필터링.

### 환경/설정 메모
- 백엔드 실행 시 예시 경로:
  - 정적 파일: `http://<backend>/content/lesson/1-1/3.md`
  - 검색 API: `http://<backend>/api/v1/lesson-search?q=ls&limit=200`
- 프론트 실행 시:
  - `.env`에 `NEXT_PUBLIC_API_BASE_URL=http://<backend>` 설정 → `/lesson`에서 백엔드 콘텐츠 직접 fetch.
- E2E(Playwright): `/lesson` UI와 `/api/v1/lesson-search` 스모크 테스트 포함.

### 선택 가이드
- 데모/백엔드 없이 빠른 확인: 로컬 인덱싱.
- 운영/유지보수 단순화(권장): 원격 검색 + 백엔드 정적 서빙.

### 관련 경로/파일
- 백엔드 콘텐츠: `backend/content/lesson/{section}/{index}.md`
- 백엔드 API: `backend/backend_src/main.py` 내 `/api/v1/lesson-search` 및 `/content` 정적 서빙 마운트
- 프론트 페이지: `frontend/app/lesson/page.tsx`
- 프론트 사이드바: `frontend/components/linux/LinuxSidebar.tsx`
- 사이드바 데이터: `frontend/lib/linux-data.ts`
- 로컬 인덱싱 소스/로더(옵션): `frontend/content/linux/**`, `frontend/content/linux/loader.ts`

### 정리 팁
- 원격 검색만 사용할 계획이면: `LinuxSidebar`의 로컬 인덱싱 분기/`loadLinuxContent` 의존 제거 후 `frontend/content/linux/**` 전체 삭제 가능(번들 경량화).

