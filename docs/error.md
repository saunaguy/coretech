# 작업 메모 (2025-10-10)

- 댓글 API가 HTML을 반환하던 문제 해결: 응답 스키마에 `author`, `is_accepted` 추가.
- 게시글 삭제 권한 검증 시 존재하지 않는 `author_id` 대신 `user_id` 사용.
- 댓글/게시글 UI 한국어 문구 복원, 삭제 확인/경고 메시지 정비.
- 게시판·공지·Q&A 상세 화면 폭을 `max-w-4xl`로 통일해 레이아웃 정렬.
- 자동 로그아웃 기본 시간을 24시간(86,400초)으로 고정하고 docker/env 설정 반영.
- Patch Notes는 `docs/patchnote.md`에서 관리, README에 링크 추가 예정.
