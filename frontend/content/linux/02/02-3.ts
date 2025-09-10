export default [
  { type: 'heading', text: '2-3 시스템/프로세스 관리' },
  { type: 'paragraph', text: '프로세스/서비스/스케줄링/로깅/시간 동기화/커널 로그/자원 제한 등 운영의 필수 명령을 묶어 정리합니다.' },
  { type: 'list', items: [
    '프로세스: ps/top/htop/kill',
    '서비스: systemctl',
    '런레벨(target)',
    '작업 스케줄링: cron, at, systemd timer',
    '로깅: journalctl, rsyslog',
    '시간 동기화: chrony/ntpd',
    '커널 로그/모듈: dmesg, lsmod, modprobe',
    '자원 제한/격리: ulimit, cgroups 개요, OOM Killer',
  ]},
  { type: 'aside', text: '🧩 팁: systemctl/journalctl 조합으로 80% 문제를 좁힐 수 있습니다.' },
]

