export default [
  { type: 'heading', text: '3-2 트러블슈팅 개요' },
  { type: 'paragraph', text: '부팅/서비스/네트워크/파일·디스크/성능/SELinux·PAM/감사 영역별로 원인 분류 → 증거 수집 → 조치 순으로 접근합니다.' },
  { type: 'heading', text: '대표 시나리오' },
  { type: 'list', items: [
    '부팅 실패: GRUB 수동 부팅, initramfs 검증(lsinitrd), 커널 파라미터',
    '서비스 장애: systemctl/journalctl, StartLimit/Restart loop 분석',
    '네트워크: 라우팅/방화벽/네임해결 점검(ip/ss/nft/dig)',
    '파일/디스크: lsof/fuser, orphan inode, 로테이션 후 핸들 잔존',
    '성능 병목: vmstat/iostat/sar로 CPU·메모리·디스크·네트워크 분류',
    'SELinux/PAM: AVC 로그 해석(semanage/chcon), 인증 실패 추적',
    '감사/포렌식: auditd 규칙, 중요 이벤트 검색(ausearch)',
  ]},
  { type: 'aside', text: '🧩 팁: “증상→계층→원인 후보→검증→완화/해결”의 루틴을 표준화하세요.' },
]

