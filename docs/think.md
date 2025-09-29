## Daily Tests Seeding — Examples and Structure

- 목적: 데일리 테스트(linux/server/network/database)를 파일로 관리하고 API로 일괄 반영.
- 엔드포인트: `POST /api/v1/daily/tests` (단일), `GET /api/v1/daily/tests` (목록), `POST /api/v1/daily/tests/{id}/submit` (채점)
- 스키마(단일 테스트):
  - `title: string`
  - `category: "linux" | "server" | "network" | "database"`
  - `questions: [{ id?: string, question: string, options: string[4], answer: 0..3 }]`

### 디렉터리 구조 옵션

- 옵션 A(간단/기본): 평면 구조 — 파일명에 카테고리 포함
  - `app/data/daily/linux-001.json`
  - `app/data/daily/server-001.json`
  - `app/data/daily/network-001.json`
  - `app/data/daily/database-001.json`

- 옵션 B(카테고리 폴더): 하위 폴더 사용 — 시드 스크립트가 재귀로 수집(rglob)
  - `app/data/daily/linux/001.json`
  - `app/data/daily/server/001.json`
  - `app/data/daily/network/001.json`
  - `app/data/daily/database/001.json`
  - 또는 `app/data/daily/server/quiz.json`처럼 한 파일에 여러 테스트(JSON 배열) 저장 가능

시드 실행: `python scripts/seed_daily_from_files.py --base http://localhost:8000`

### 단일 테스트 JSON 템플릿

```json
{
  "title": "제목",
  "category": "linux",
  "questions": [
    { "id": "q1", "question": "질문 1", "options": ["보기1", "보기2", "보기3", "보기4"], "answer": 0 },
    { "id": "q2", "question": "질문 2", "options": ["보기1", "보기2", "보기3", "보기4"], "answer": 2 }
  ]
}
```

### 예시 — linux

```json
{
  "title": "리눅스 기초 1",
  "category": "linux",
  "questions": [
    { "id": "q1", "question": "디렉터리의 상세 목록을 표시하는 명령은?", "options": ["ls -a", "ls -l", "ls -h", "ls -R"], "answer": 1 },
    { "id": "q2", "question": "chmod 644 권한 설정의 의미로 올바른 것은?", "options": ["소유자 읽기/쓰기, 그룹 읽기, 기타 읽기", "소유자 읽기/쓰기/실행, 그룹 읽기, 기타 읽기", "소유자 읽기, 그룹 읽기/쓰기, 기타 읽기", "소유자 읽기/쓰기, 그룹 읽기/쓰기, 기타 읽기"], "answer": 0 },
    { "id": "q3", "question": "현재 작업 디렉터리를 출력하는 명령은?", "options": ["pwd", "whoami", "cd ~", "echo $PWD"], "answer": 0 }
  ]
}
```

### 예시 — server

```json
{
  "title": "서버 운영 기초 1",
  "category": "server",
  "questions": [
    { "id": "q1", "question": "Nginx 서비스를 시작하는 명령은? (systemd)", "options": ["systemctl start nginx", "service nginx enable", "nginx -s start", "systemctl run nginx"], "answer": 0 },
    { "id": "q2", "question": "리눅스에서 포트 80을 리스닝 중인 프로세스를 확인하는 방법은?", "options": ["ss -ltnp | grep :80", "top | grep :80", "du -sh /var/www/html", "df -h | grep 80"], "answer": 0 },
    { "id": "q3", "question": "환경변수를 영구 반영하려면 일반적으로 어느 파일을 수정하나요? (bash)", "options": ["~/.bashrc 또는 ~/.bash_profile", "/etc/hosts", "/etc/fstab", "/etc/resolv.conf"], "answer": 0 }
  ]
}
```

### 예시 — network

```json
{
  "title": "네트워크 기초 1",
  "category": "network",
  "questions": [
    { "id": "q1", "question": "ping은 어떤 프로토콜을 사용하나요?", "options": ["ICMP", "TCP", "UDP", "ARP"], "answer": 0 },
    { "id": "q2", "question": "TCP 3-way 핸드셰이크의 올바른 순서는?", "options": ["SYN → SYN-ACK → ACK", "ACK → SYN → SYN-ACK", "SYN → ACK → SYN-ACK", "SYN-ACK → SYN → ACK"], "answer": 0 },
    { "id": "q3", "question": "서브넷 마스크 255.255.255.0의 CIDR 표기는?", "options": ["/24", "/16", "/25", "/8"], "answer": 0 }
  ]
}
```

### 예시 — database

```json
{
  "title": "데이터베이스 기초 1",
  "category": "database",
  "questions": [
    { "id": "q1", "question": "employees 테이블의 전체 행 수를 구하는 SQL은?", "options": ["SELECT COUNT(*) FROM employees;", "SELECT SUM(*) FROM employees;", "SELECT * FROM employees LIMIT 1;", "COUNT employees;"], "answer": 0 },
    { "id": "q2", "question": "ACID 중 Isolation의 의미로 가장 알맞은 것은?", "options": ["트랜잭션 간 간섭 없이 독립적으로 실행되어야 함", "시스템 장애에도 트랜잭션 결과가 유지됨", "트랜잭션 전후 데이터 일관성 보장", "모든 트랜잭션은 영구 저장소에 기록됨"], "answer": 0 },
    { "id": "q3", "question": "인덱스의 일반적인 효과는?", "options": ["조회 성능 향상(삽입/수정은 느려질 수 있음)", "모든 쿼리 성능 향상 보장", "디스크 사용량 감소", "잠금 경합 증가 방지"], "answer": 0 }
  ]
}
```

### 대량 작성/투입 팁(Gemini 활용)

- Gemini에 “순수 JSON만, 코드블록/설명 금지, 위 스키마 준수”를 명시.
- 여러 테스트를 한 파일에 담을 경우: JSON 배열로 생성 → `app/data/daily/<category>/quiz.json`에 저장 → 시드 스크립트가 개별 테스트로 분해하여 등록.
- 등록: `python scripts/seed_daily_from_files.py --base http://localhost:8000`

