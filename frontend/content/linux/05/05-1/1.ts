const blocks = [
  { type: 'heading', text: '리눅스 실습 1 · 3-Tier 서비스 실습' },
  { type: 'aside', text: '💡 Nginx(프론트) + App(백엔드) + DB(데이터) 3계층을 분리 배치하고, 로그/상태/연결을 종단 간 확인합니다.' },

  { type: 'divider' },
  { type: 'heading', text: '아키텍처 구성' },
  { type: 'list', items: [
    'Web: Nginx (리버스 프록시, 정적 서빙)',
    'App: 예시 Python/Node 앱 (포트 3000)',
    'DB: MariaDB/PostgreSQL (3306/5432)',
    '네트워크: 같은 브리지/서브넷, 각 호스트 고정 IP'
  ]},

  { type: 'heading', text: '설치/구성 요약' },
  { type: 'list', items: [
    'Web: nginx 설치 후 /etc/nginx/conf.d/app.conf 에 upstream→proxy_pass 구성',
    'App: 서비스 유닛 작성(ExecStart=), 로그 journalctl로 확인',
    'DB: 사용자/스키마 생성, App의 DB 접속 env 주입(비밀은 파일/환경 분리)',
    '방화벽: Web 포트(80/443), App/DB는 내부망 제한'
  ]},

  { type: 'heading', text: '연결/상태 점검' },
  { type: 'list', items: [
    'Nginx → App: curl -sv http://web/ → proxy 통과 확인',
    'App → DB: 앱 로그에서 DB 연결 성공 확인, 또는 nc -vz db 5432',
    '엔드투엔드: 브라우저/cli로 Web 엔드포인트 호출→응답 상태코드/본문 확인'
  ]},

  { type: 'heading', text: '장애 주입/트러블슈팅' },
  { type: 'list', items: [
    'App 다운 → Nginx 502/504: systemctl status app, journalctl -u app',
    'DB 포트 차단 → 연결 실패: firewall-cmd 룰 확인',
    'App 환경 변수 오타 → 5xx: Environment= 재확인, 재배포'
  ]},

  { type: 'divider' },
  { type: 'heading', text: '요약' },
  { type: 'list', items: [
    '3계층을 분리하고 최소권한/내부망만 허용',
    '로그/상태를 한눈에 보는 명령 세트 준비'
  ]},
]

export default blocks as any
