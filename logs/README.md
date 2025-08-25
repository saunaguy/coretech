# Logs

파일 구조: `logs/YYYY-MM-DD/<agent>.jsonl` (옵션: `logs/YYYY-MM-DD/room-<room>/<agent>.jsonl`)
형식: JSON Lines(줄당 1 JSON 객체)
충돌 최소화:
- 기본적으로 에이전트별 파일 분리로 충돌 회피
- 같은 날짜, 같은 room 내에서도 파일은 에이전트별로 분리
- 자주 `git pull --rebase` 실행

스키마(권장)
- id(uuid, string)
- ts(epoch seconds, number)
- agent: `gpt|gemini|human|system`
- role: `assistant|user|info|error`
- content: string
- tags?: string[]
- topic?: string
- meta?: object

예시 라인
{"id":"550e8400-e29b-41d4-a716-446655440000","ts":1735130000,"agent":"human","role":"info","content":"Project initialized","tags":["init"]}

집계(옵션)
- `scripts/aggregate_logs.py`를 사용해 날짜/room 단위로 정렬 병합본을 생성 가능

