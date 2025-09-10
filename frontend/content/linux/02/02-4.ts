export default [
  { type: 'heading', text: '2-4 고급/관리 명령어' },
  { type: 'paragraph', text: '텍스트 처리/아카이빙/스트림 편집/비교/패키지/스토리지/네트워크/보안/부팅/파일시스템/용량/검색/진단/무결성 등 관리 명령을 모아 개괄합니다.' },
  { type: 'list', items: [
    '텍스트 처리: grep, awk, sed, cut, sort',
    '아카이빙/압축: tar, gzip, bzip2, xz',
    '스트림 편집: tee, xargs, tr',
    '파일 비교/검증: diff, cmp, md5sum',
    '패키지 관리: yum/dnf, apt, rpm/dpkg',
    '스토리지: fdisk, LVM, RAID, multipath',
    '네트워크 도구: ping, traceroute, netstat, ss',
    '보안/네트워크 심화: iptables, firewalld, tcpdump, wireshark, ssh/scp/rsync',
    '리포지토리: EPEL, PPA, repo 파일',
    '부팅/서비스 트러블슈팅: systemd unit/디버깅',
    '파일 시스템: fsck, mount, fstab, automount',
    '용량 분석: df, du, ncdu',
    '검색: mlocate/updatedb, ripgrep',
    '진단 보강: nmap, dig, nslookup, curl, nc',
    '무결성/감사: sha256sum/shasum, auditd',
  ]},
  { type: 'aside', text: '🛠️ 팁: 반복 작업은 스크립트화하고, 파괴적 명령은 항상 -n/--dry-run을 먼저.' },
]

