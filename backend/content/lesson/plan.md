# Linux 목차 (세분화 버전)

## 🖥️ 1장 운영체제와 설치

### 운영체제·하드웨어
- 1-1-1 하드웨어 기초
- 1-1-2 프로세스/메모리/스왑
- 1-1-3 스토리지/파일시스템
- 1-1-4 시스템 콜/핸즈온
- 1-1-5 OS 정의/하는 일
- 1-1-6 운영체제 종류/역할
- 1-1-7 구성요소/분류
- 1-1-8 커널 기능(심화)
- 1-1-9 사용자/커널 모드·시스콜
- 1-1-10 핸즈온/체크/요약

### 설치·가상화·유틸리티
- 1-2-1 배포판 종류
- 1-2-2 설치 방법
- 1-2-3 가상화 개념
- 1-2-4 가상화 도구 설치
- 1-2-5 VM 네트워크 모드
- 1-2-6 기본 CLI

---

## ⚙️ 리눅스 핵심 명령어

### 2-1 기본 명령어
- 2-1-1 파일/디렉토리 관리 (ls, cp, mv, rm, mkdir 등)
- 2-1-2 탐색 (pwd, cd, find, locate)
- 2-1-3 텍스트 확인 (cat, less, more, head, tail)
- 2-1-4 도움말 (man, help)
- 2-1-5 에디터 기초 (vim, nano)와 기본 단축키
- 2-1-6 경로/글로빙, 와일드카드, 히스토리/alias
- 2-1-7 리다이렉션/파이프/서브쉘과 명령 치환

### 2-2 사용자/권한 관련
- 2-2-1 사용자/그룹 관리 (useradd, groupadd, passwd)
- 2-2-2 파일 권한 (chmod, chown, umask)
- 2-2-3 sudo, visudo
- 2-2-4 특수 권한 (SUID/SGID/Sticky bit) 동작 원리
- 2-2-5 파일 속성/불변 플래그 (chattr, lsattr)
- 2-2-6 ACL 관리 (getfacl, setfacl)
- 2-2-7 로그인 셸과 환경 변수 (profile, bashrc, secure_path)

### 2-3 시스템/프로세스 관리
- 2-3-1 프로세스 관리 (ps, top, htop, kill)
- 2-3-2 systemctl, 서비스 관리
- 2-3-3 런레벨(target) 개념
- 2-3-4 작업 스케줄링 (cron, at, systemd timer)
- 2-3-5 로깅 (journalctl, rsyslog 기본)
- 2-3-6 시간 동기화 (chrony/ntpd)
- 2-3-7 커널 로그/모듈 (dmesg, lsmod, modprobe)
- 2-3-8 자원 제한/격리 (ulimit, cgroups 개요, OOM Killer)

### 2-4 고급/관리 명령어
- 2-4-1 텍스트 처리 (grep, awk, sed, cut, sort)
- 2-4-2 아카이빙/압축 (tar, gzip, bzip2, xz)
- 2-4-3 스트림 편집 (tee, xargs, tr)
- 2-4-4 파일 비교/검증 (diff, cmp, md5sum)
- 2-4-5 패키지 관리 (yum/dnf, apt, rpm/dpkg)
- 2-4-6 스토리지 관리 (fdisk, LVM, RAID, multipath)
- 2-4-7 네트워크 기초 도구 (ping, traceroute, netstat, ss)
- 2-4-8 보안/네트워크 심화 (iptables, firewalld, tcpdump, wireshark, ssh, scp, rsync)
- 2-4-9 패키지 저장소/리포지토리 설정 (EPEL, PPA, repo 파일)
- 2-4-10 부팅/서비스 트러블슈팅 (systemd unit 작성과 디버깅)
- 2-4-11 파일 시스템 점검/마운트 (fsck, mount, fstab, automount)
- 2-4-12 디스크 용량 분석 (df, du, ncdu)
- 2-4-13 빠른 파일 검색 (mlocate/updatedb, ripgrep)
- 2-4-14 네트워크 진단 보강 (nmap, dig, nslookup, curl, nc)
- 2-4-15 무결성/해시 (sha256sum, shasum) 및 감사(auditd) 기초

---

## 🧰 리눅스 서버 운영 & 트러블슈팅

### 3-1 서버 운영
- 3-1-1 서비스 운영 표준: systemd 유닛/의존성(After/Wants/Requires)
- 3-1-2 구성 관리: env/시크릿, Drop-in vs 유닛 복제, Restart=
- 3-1-3 로깅 운영: journal 보존/로테이션, rsyslog, 구조화 로그
- 3-1-4 성능/자원 운영: ulimit, cgroups v2, OOM 대응
- 3-1-5 스토리지 운영: fstab(noatime/discard), LVM 스냅샷, fsck
- 3-1-6 접근 제어: sudo 분리(/etc/sudoers.d), 계정 잠금, MFA/SSH 하드닝
- 3-1-7 백업/복구: rsync/tar, 보관주기/오프사이트, RPO/RTO

### 3-2 트러블슈팅
- 3-2-1 부팅 실패: GRUB 수동 부팅, initramfs 검증(lsinitrd), 커널 파라미터
- 3-2-2 서비스 장애: systemctl/journalctl, StartLimit/Restart loop
- 3-2-3 네트워크 이슈: 라우팅/방화벽/네임해결 점검(ip/ss/nft/dig)
- 3-2-4 파일/디스크: lsof/fuser, orphan inode, 로테이션 후 핸들
- 3-2-5 성능 병목: vmstat/iostat/sar로 분류
- 3-2-6 SELinux/PAM: AVC 해석(semanage/chcon), 인증 실패 추적
- 3-2-7 감사/포렌식: auditd 규칙, 무결성/이벤트 검색(ausearch)

---

## 🌐 네트워크

### 4-1 인터페이스/라우팅 기초
- 4-1-1 OSI/TCP-IP 계층, MTU/MSS/PMTUD
- 4-1-2 인터페이스 관리: ip/nmcli, 주소/링크/라우트
- 4-1-3 라우팅 테이블/메트릭, 기본 게이트웨이
- 4-1-4 IPv4/IPv6 기초, CIDR/프리픽스

### 4-2 이름 해석/주소할당 (DNS/DHCP)
- 4-2-1 DNS 동작(재귀/권한/캐시), DNSSEC/split-horizon
- 4-2-2 도구: dig/nslookup/drill, 레코드 유형
- 4-2-3 DHCP 기본(DORA), 예약/옵션, PXE

### 4-3 방화벽/보안 접속
- 4-3-1 iptables/nftables 개념 및 테이블/체인
- 4-3-2 firewalld 존/서비스, 리치 규칙
- 4-3-3 SSH 하드닝, 포트포워딩/프록시점프, fail2ban
- 4-3-4 TLS/인증서 기초, OCSP/ALPN/HSTS

### 4-4 로드밸런서/프록시
- 4-4-1 L4/L7 기본: 헬스체크/세션유지/프로브
- 4-4-2 HAProxy/Nginx 역/정방향 프록시 구성
- 4-4-3 캐싱/압축, WAF 개요/배치 패턴

### 4-5 고가용성/고급 토폴로지
- 4-5-1 VLAN/trunk, bonding(team) 설계
- 4-5-2 게이트웨이 이중화: VRRP/GLBP/HSRP, keepalived
- 4-5-3 정책 기반 라우팅(PBR), 다중 회선/게이트웨이
- 4-5-4 VPN(OpenVPN/IPSec), 터널/라우팅 상호작용
- 4-5-5 컨테이너 네트워킹/네임스페이스, veth/브리지

### 4-6 진단/성능 분석
- 4-6-1 성능 측정: iperf3/mtr/ping 방법론
- 4-6-2 패킷 캡처/분석: tcpdump/Wireshark/pcap
- 4-6-3 서비스 레벨 점검: ss/curl/nmap
- 4-6-4 병목 분류 절차: 링크/전송/네트워크/애플리케이션
