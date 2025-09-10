export default [
  { type: 'heading', text: '3-1 서버 운영 개요' },
  { type: 'paragraph', text: 'systemd 유닛 구조, 구성 관리, 로깅, 자원/스토리지 운영, 접근제어, 백업 등 서버 운영의 기본 원칙을 빠르게 훑습니다.' },
  { type: 'heading', text: '핵심 주제' },
  { type: 'list', items: [
    'systemd 유닛/의존성: After/Wants/Requires, 재시작 정책(Restart=)',
    '구성 관리: 환경변수/시크릿, Drop-in 디렉터리 vs 유닛 복제',
    '로깅 운영: journal 보존·로테이션, rsyslog 연동, 구조화 로그',
    '자원 운영: ulimit, cgroups v2(cpu/memory/io), OOM 대응',
    '스토리지 운영: fstab 옵션(noatime/discard), LVM 스냅샷, fsck',
    '접근 제어: sudo 분리(/etc/sudoers.d), 계정 잠금, SSH 하드닝, MFA',
    '백업/복구: rsync/tar, 보관주기·오프사이트, RPO/RTO 설계',
  ]},
  { type: 'aside', text: '🧭 실무 팁: 운영 표준을 “체크리스트”로 만들고 배포 전/후 점검을 자동화하세요.' },
]

