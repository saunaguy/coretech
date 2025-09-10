import { osAndSetup } from "./topics/os-and-setup"

// 1장은 유지 (osAndSetup). 2~5장은 think.md 구조에 맞춰 재편성.
export const linuxTopics = {
  "🖥️ 운영체제와 설치": osAndSetup,

  // 2. 리눅스 명령어 (콘텐츠 02장은 설치/가상화이므로, 명령어 파트는 03장부터 시작)
  "⚙️ 리눅스 핵심 명령어": {
    "03장 기본 명령어 실습": [
      { id: "plan-03-1", name: "3-1 파일/디렉토리 명령어: ls, cp, mv, rm, touch, mkdir, rmdir", title: "커리큘럼: 3-1 파일/디렉토리", description: "docs/lessonplan.md 참조" },
      { id: "plan-03-2", name: "3-2 탐색 명령어: pwd, cd, find, locate", title: "커리큘럼: 3-2 탐색", description: "docs/lessonplan.md 참조" },
      { id: "plan-03-3", name: "3-3 텍스트 확인: cat, less, more, head, tail", title: "커리큘럼: 3-3 텍스트 확인", description: "docs/lessonplan.md 참조" },
      { id: "plan-03-4", name: "3-4 도움말: man, help, --help", title: "커리큘럼: 3-4 도움말", description: "docs/lessonplan.md 참조" },
    ],
    "04장 권한과 사용자 개념": [
      { id: "plan-04-1", name: "4-1 사용자/그룹 관리: useradd, userdel, groupadd", title: "커리큘럼: 4-1 사용자/그룹 관리", description: "docs/lessonplan.md 참조" },
      { id: "plan-04-2", name: "4-2 파일 권한: rwx, chmod, chown, chgrp", title: "커리큘럼: 4-2 파일 권한", description: "docs/lessonplan.md 참조" },
      { id: "plan-04-3", name: "4-3 umask 기본값", title: "커리큘럼: 4-3 umask", description: "docs/lessonplan.md 참조" },
      { id: "plan-04-4", name: "4-4 sudo 개념 및 visudo 설정", title: "커리큘럼: 4-4 sudo/visudo", description: "docs/lessonplan.md 참조" },
    ],
    "05장 파일시스템 개념": [
      { id: "plan-05-1", name: "5-1 파일시스템 구조: EXT4, XFS, Btrfs", title: "커리큘럼: 5-1 파일시스템 구조", description: "docs/lessonplan.md 참조" },
      { id: "plan-05-2", name: "5-2 FHS (Filesystem Hierarchy Standard)", title: "커리큘럼: 5-2 FHS", description: "docs/lessonplan.md 참조" },
      { id: "plan-05-3", name: "5-3 마운트/언마운트: mount, umount", title: "커리큘럼: 5-3 마운트/언마운트", description: "docs/lessonplan.md 참조" },
      { id: "plan-05-4", name: "5-4 /etc/fstab 설정", title: "커리큘럼: 5-4 fstab", description: "docs/lessonplan.md 참조" },
      { id: "plan-05-5", name: "5-5 inodes 개념", title: "커리큘럼: 5-5 inodes", description: "docs/lessonplan.md 참조" },
    ],
    "06장 프로세스 관리": [
      { id: "plan-06-1", name: "6-1 프로세스 조회: ps, top, htop", title: "커리큘럼: 6-1 프로세스 조회", description: "docs/lessonplan.md 참조" },
      { id: "plan-06-2", name: "6-2 프로세스 제어: kill, pkill, jobs, fg, bg", title: "커리큘럼: 6-2 프로세스 제어", description: "docs/lessonplan.md 참조" },
      { id: "plan-06-3", name: "6-3 systemd 서비스 관리: systemctl start/stop/status", title: "커리큘럼: 6-3 systemd 서비스", description: "docs/lessonplan.md 참조" },
      { id: "plan-06-4", name: "6-4 런레벨(target) 개념", title: "커리큘럼: 6-4 런레벨", description: "docs/lessonplan.md 참조" },
    ],
    "07장 네트워크 기초": [
      { id: "plan-07-1", name: "7-1 네트워크 인터페이스 관리: ip addr, ifconfig, nmcli", title: "커리큘럼: 7-1 인터페이스 관리", description: "docs/lessonplan.md 참조" },
      { id: "plan-07-2", name: "7-2 기본 네트워킹: ping, traceroute, netstat, ss", title: "커리큘럼: 7-2 기본 네트워킹", description: "docs/lessonplan.md 참조" },
      { id: "plan-07-3", name: "7-3 DNS 확인: nslookup, dig", title: "커리큘럼: 7-3 DNS", description: "docs/lessonplan.md 참조" },
      { id: "plan-07-4", name: "7-4 라우팅 테이블: ip route", title: "커리큘럼: 7-4 라우팅", description: "docs/lessonplan.md 참조" },
    ],
  },

  // 3. 리눅스 서버 운영 & 트러블슈팅
  "🧰 리눅스 서버 운영 & 트러블슈팅": {
    "3-1 서버 운영": [
      { id: "plan-3-1-1", name: "3-1 서비스 운영 표준: systemd 유닛/의존성(After/Wants/Requires)", title: "커리큘럼: 3-1 systemd 유닛/의존성", description: "docs/think.md 기준" },
      { id: "plan-3-1-2", name: "3-1 구성 관리: env/시크릿, Drop-in vs 유닛 복제, Restart=", title: "커리큘럼: 3-1 구성 관리 포인트", description: "docs/think.md 기준" },
      { id: "plan-3-1-3", name: "3-1 로깅 운영: journal 보존/로테이션, rsyslog, 구조화 로그", title: "커리큘럼: 3-1 로깅 운영", description: "docs/think.md 기준" },
      { id: "plan-3-1-4", name: "3-1 성능/자원 운영: ulimit, cgroups v2, OOM 대응", title: "커리큘럼: 3-1 성능/자원 운영", description: "docs/think.md 기준" },
      { id: "plan-3-1-5", name: "3-1 스토리지 운영: fstab(noatime/discard), LVM 스냅샷, fsck", title: "커리큘럼: 3-1 스토리지 운영", description: "docs/think.md 기준" },
      { id: "plan-3-1-6", name: "3-1 접근 제어: sudo 분리(/etc/sudoers.d), 계정 잠금, MFA/SSH 하드닝", title: "커리큘럼: 3-1 접근 제어", description: "docs/think.md 기준" },
      { id: "plan-3-1-7", name: "3-1 백업/복구: rsync/tar, 보관주기/오프사이트, RPO/RTO", title: "커리큘럼: 3-1 백업/복구", description: "docs/think.md 기준" },
    ],
    "3-2 트러블슈팅": [
      { id: "plan-3-2-1", name: "3-2 부팅 실패: GRUB 수동 부팅, initramfs 검증(lsinitrd), 커널 파라미터", title: "커리큘럼: 3-2 부팅 실패 대응", description: "docs/think.md 기준" },
      { id: "plan-3-2-2", name: "3-2 서비스 장애: systemctl/journalctl, StartLimit/Restart loop", title: "커리큘럼: 3-2 서비스 장애 분석", description: "docs/think.md 기준" },
      { id: "plan-3-2-3", name: "3-2 네트워크 이슈: 라우팅/방화벽/네임해결 점검(ip/ss/nft/dig)", title: "커리큘럼: 3-2 네트워크 이슈", description: "docs/think.md 기준" },
      { id: "plan-3-2-4", name: "3-2 파일/디스크: lsof/fuser, orphan inode, 로테이션 후 핸들", title: "커리큘럼: 3-2 파일/디스크 이슈", description: "docs/think.md 기준" },
      { id: "plan-3-2-5", name: "3-2 성능 병목: vmstat/iostat/sar로 분류", title: "커리큘럼: 3-2 성능 병목", description: "docs/think.md 기준" },
      { id: "plan-3-2-6", name: "3-2 SELinux/PAM: AVC 해석(semanage/chcon), 인증 실패 추적", title: "커리큘럼: 3-2 SELinux/PAM", description: "docs/think.md 기준" },
      { id: "plan-3-2-7", name: "3-2 감사/포렌식: auditd 규칙, 무결성/이벤트 검색(ausearch)", title: "커리큘럼: 3-2 감사/포렌식", description: "docs/think.md 기준" },
    ],
  },

  // 4. 네트워크 (섹션 그룹 재편: 4-1 ~ 4-6)
  "🌐 네트워크": {
    "4-1 인터페이스/라우팅 기초": [
      { id: "plan-4-1-1", name: "4-1 OSI/TCP-IP 계층, MTU/MSS/PMTUD", title: "커리큘럼: 4-1 OSI/TCP-IP/MTU", description: "docs/think.md 기준" },
      { id: "plan-4-1-2", name: "4-1 인터페이스 관리: ip/nmcli, 주소/링크/라우트", title: "커리큘럼: 4-1 인터페이스 관리", description: "docs/think.md 기준" },
      { id: "plan-4-1-3", name: "4-1 라우팅 테이블/메트릭, 기본 게이트웨이", title: "커리큘럼: 4-1 라우팅/메트릭", description: "docs/think.md 기준" },
      { id: "plan-4-1-4", name: "4-1 IPv4/IPv6 기초, CIDR/프리픽스", title: "커리큘럼: 4-1 IPv4/IPv6/CIDR", description: "docs/think.md 기준" },
    ],
    "4-2 이름 해석/주소할당 (DNS/DHCP)": [
      { id: "plan-4-2-1", name: "4-2 DNS 동작(재귀/권한/캐시), DNSSEC/split-horizon", title: "커리큘럼: 4-2 DNS 동작", description: "docs/think.md 기준" },
      { id: "plan-4-2-2", name: "4-2 도구: dig/nslookup/drill, 레코드 유형", title: "커리큘럼: 4-2 DNS 도구/레코드", description: "docs/think.md 기준" },
      { id: "plan-4-2-3", name: "4-2 DHCP 기본(DORA), 예약/옵션, PXE", title: "커리큘럼: 4-2 DHCP 기본", description: "docs/think.md 기준" },
    ],
    "4-3 방화벽/보안 접속": [
      { id: "plan-4-3-1", name: "4-3 iptables/nftables 개념 및 테이블/체인", title: "커리큘럼: 4-3 iptables/nftables", description: "docs/think.md 기준" },
      { id: "plan-4-3-2", name: "4-3 firewalld 존/서비스, 리치 규칙", title: "커리큘럼: 4-3 firewalld", description: "docs/think.md 기준" },
      { id: "plan-4-3-3", name: "4-3 SSH 하드닝, 포트포워딩/프록시점프, fail2ban", title: "커리큘럼: 4-3 SSH/보안 접속", description: "docs/think.md 기준" },
      { id: "plan-4-3-4", name: "4-3 TLS/인증서 기초, OCSP/ALPN/HSTS", title: "커리큘럼: 4-3 TLS/인증서", description: "docs/think.md 기준" },
    ],
    "4-4 로드밸런서/프록시": [
      { id: "plan-4-4-1", name: "4-4 L4/L7 기본: 헬스체크/세션유지/프로브", title: "커리큘럼: 4-4 L4/L7 기본", description: "docs/think.md 기준" },
      { id: "plan-4-4-2", name: "4-4 HAProxy/Nginx 역/정방향 프록시 구성", title: "커리큘럼: 4-4 HAProxy/Nginx", description: "docs/think.md 기준" },
      { id: "plan-4-4-3", name: "4-4 캐싱/압축, WAF 개요/배치 패턴", title: "커리큘럼: 4-4 캐싱/WAF", description: "docs/think.md 기준" },
    ],
    "4-5 고가용성/고급 토폴로지": [
      { id: "plan-4-5-1", name: "4-5 VLAN/trunk, bonding(team) 설계", title: "커리큘럼: 4-5 VLAN/본딩", description: "docs/think.md 기준" },
      { id: "plan-4-5-2", name: "4-5 게이트웨이 이중화: VRRP/GLBP/HSRP, keepalived", title: "커리큘럼: 4-5 게이트웨이 이중화", description: "docs/think.md 기준" },
      { id: "plan-4-5-3", name: "4-5 정책 기반 라우팅(PBR), 다중 회선/게이트웨이", title: "커리큘럼: 4-5 PBR/다중 회선", description: "docs/think.md 기준" },
      { id: "plan-4-5-4", name: "4-5 VPN(OpenVPN/IPSec), 터널/라우팅 상호작용", title: "커리큘럼: 4-5 VPN/터널", description: "docs/think.md 기준" },
      { id: "plan-4-5-5", name: "4-5 컨테이너 네트워킹/네임스페이스, veth/브리지", title: "커리큘럼: 4-5 컨테이너 네트워킹", description: "docs/think.md 기준" },
    ],
    "4-6 진단/성능 분석": [
      { id: "plan-4-6-1", name: "4-6 성능 측정: iperf3/mtr/ping 방법론", title: "커리큘럼: 4-6 성능 측정", description: "docs/think.md 기준" },
      { id: "plan-4-6-2", name: "4-6 패킷 캡처/분석: tcpdump/Wireshark/pcap", title: "커리큘럼: 4-6 패킷 분석", description: "docs/think.md 기준" },
      { id: "plan-4-6-3", name: "4-6 서비스 레벨 점검: ss/curl/nmap", title: "커리큘럼: 4-6 서비스 점검", description: "docs/think.md 기준" },
      { id: "plan-4-6-4", name: "4-6 병목 분류 절차: 링크/전송/네트워크/애플리케이션", title: "커리큘럼: 4-6 병목 분류", description: "docs/think.md 기준" },
    ],
  },

  // 5. 실습 코너 (준비중)
  "🧪 실습 코너": {
    "5장 실습": [
      { id: "plan-5-1", name: "5-1 리눅스 실습 (준비중)", title: "5-1 리눅스 실습", description: "구성 준비중" },
      { id: "plan-5-2", name: "5-2 네트워크 실습 (준비중)", title: "5-2 네트워크 실습", description: "구성 준비중" },
      { id: "plan-5-3", name: "5-3 복합 실습 (준비중)", title: "5-3 복합 실습", description: "구성 준비중" },
    ],
  },
}
