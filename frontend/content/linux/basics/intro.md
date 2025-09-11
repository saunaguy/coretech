# 📚 리눅스 커리큘럼 (개정본)

> 구조 업데이트: 콘텐츠 파일/폴더 구조가 linux-data.ts의 키 규칙과 정합되도록 정리되었습니다. 상위 섹션은 `./NN/NN-M.ts`, 중첩 스텝은 명시 매핑을 사용하며(예: `01-1-1`), 현재는 `./01/1-1/1.ts` 형태로 배치되어 있습니다.

구조 요약
- 상위 섹션: `content/linux/02/02-1.ts`, `03/03-1.ts`, `04/04-1.ts`, `05/05-0.ts` 등
- 1장 중첩 스텝: `content/linux/01/1-1/1.ts..4.ts`, `content/linux/01/1-2/5.ts..10.ts`
- 랩 가이드: `content/linux/05/05-0.ts` (공통 안내)

## 1. 운영체제와 설치(두 묶음 구성)
### 묶음 A · 운영체제·하드웨어
- 운영체제 개념 (커널, 쉘, 시스템 콜)
- 프로세스와 스레드 차이
- 컴퓨터 구조 (CPU, 메모리, 디스크, I/O)
- 메모리 관리 (페이징, 스와핑, 가상메모리)
- 스케줄링 개념 (CFS, 우선순위, nice/renice)
- 파일시스템 기본 (inode, 저널링, ext4/xfs/btrfs 개요)
- 부팅 과정 (BIOS/UEFI → 부트로더 → initramfs → systemd)
- 커널 모듈과 드라이버 (lsmod, modprobe, modinfo)

### 묶음 B · 설치·가상화·유틸리티
- 리눅스 배포판 종류 (RHEL, Ubuntu, Rocky 등)
- 설치 방법 (ISO, USB, 네트워크 설치)
- 가상화 개념 (하이퍼바이저, VM vs Container)
- VMware, VirtualBox 설치 및 네트워크 모드
- 기본 CLI 사용법
- 파티셔닝/파일시스템 선택 가이드 (ext4 vs xfs, 스왑)
- 설치 자동화 (Kickstart/Preseed, cloud-init 기초)
- 네트워크 모드 비교 (NAT/Bridged/Host-only)와 활용 사례
- 스냅샷/클론/템플릿 이미지 관리
- 클라우드 이미지 형식(qcow2, vmdk)과 변환(qemu-img)
- 듀얼부트 vs VM vs 컨테이너 트레이드오프

---

## 2. 리눅스 명령어
### 2-1 기본 명령어
- 파일/디렉토리 관리 (ls, cp, mv, rm, mkdir 등)
- 탐색 (pwd, cd, find, locate)
- 텍스트 확인 (cat, less, more, head, tail)
- 도움말 (man, help)
- 에디터 기초 (vim, nano)와 기본 단축키
- 경로/글로빙, 와일드카드, 히스토리/alias
- 리다이렉션/파이프/서브쉘과 명령 치환

### 2-2 사용자/권한 관련
- 사용자/그룹 관리 (useradd, groupadd, passwd)
- 파일 권한 (chmod, chown, umask)
- sudo, visudo
- 특수 권한 (SUID/SGID/Sticky bit) 동작 원리
- 파일 속성/불변 플래그 (chattr, lsattr)
- ACL 관리 (getfacl, setfacl)
- 로그인 셸과 환경 변수 (profile, bashrc, secure_path)

### 2-3 시스템/프로세스 관리
- 프로세스 관리 (ps, top, htop, kill)
- systemctl, 서비스 관리
- 런레벨(target) 개념
- 작업 스케줄링 (cron, at, systemd timer)
- 로깅 (journalctl, rsyslog 기본)
- 시간 동기화 (chrony/ntpd)
- 커널 로그/모듈 (dmesg, lsmod, modprobe)
- 자원 제한/격리 (ulimit, cgroups 개요, OOM Killer)

### 2-4 고급/관리 명령어
- 텍스트 처리 (grep, awk, sed, cut, sort)
- 아카이빙/압축 (tar, gzip, bzip2, xz)
- 스트림 편집 (tee, xargs, tr)
- 파일 비교/검증 (diff, cmp, md5sum)
- 패키지 관리 (yum/dnf, apt, rpm/dpkg)
- 스토리지 관리 (fdisk, LVM, RAID, multipath)
- 네트워크 기초 도구 (ping, traceroute, netstat, ss)
- 보안/네트워크 심화 (iptables, firewalld, tcpdump, wireshark, ssh, scp, rsync)
- 패키지 저장소/리포지토리 설정 (EPEL, PPA, repo 파일)
- 부팅/서비스 트러블슈팅 (systemd unit 작성과 디버깅)
- 파일 시스템 점검/마운트 (fsck, mount, fstab, automount)
- 디스크 용량 분석 (df, du, ncdu)
- 빠른 파일 검색 (mlocate/updatedb, ripgrep)
- 네트워크 진단 보강 (nmap, dig, nslookup, curl, nc)
- 무결성/해시 (sha256sum, shasum) 및 감사(auditd) 기초

---

## 3. 리눅스 서버 운영 & 트러블슈팅
### 3-1 서버 운영
- 서비스 운영 표준: systemd 유닛 구조, 의존성 관리(After/Wants/Requires)
- 구성 관리 포인트: 환경변수/시크릿, Drop-in vs 유닛 복제, 재시작 정책(Restart=)
- 로깅 운영: journal 보존/로테이션, rsyslog 연동, 구조화 로그
- 성능/자원 운영: ulimit, cgroups v2(cpu/memory/io), OOM 대응 전략
- 스토리지 운영: fstab 옵션(noatime, discard), LVM 스냅샷, 파일시스템 점검(fsck)
- 접근 제어: sudo 정책 분리(/etc/sudoers.d), 계정 잠금, MFA/SSH 하드닝
- 백업/복구: rsync/tar, 보관주기/오프사이트, 복구 리허설(RPO/RTO)

### 3-2 트러블슈팅
- 부팅 실패 대응: GRUB 수동 부팅, initramfs 검증(lsinitrd), 커널 파라미터
- 서비스 장애 분석: `systemctl status`/`journalctl -u`, StartLimit/Restart loop 진단
- 네트워크 이슈: 라우팅/방화벽/네임해결 점검(ip/ss/nft/dig)
- 파일/디스크: 열림 파일(lsof/fuser), orphan inode, 로테이션 후 핸들 유지
- 성능 병목: vmstat/iostat/sar로 CPU/메모리/디스크/네트워크 분류
- SELinux/PAM: AVC 로그 해석(semanage/chcon), 인증 실패 원인 추적
- 감사/포렌식: auditd 규칙 설계, 중요 파일 무결성 및 이벤트 검색(ausearch)

---

## 4. 네트워크
### 4-1 인터페이스/라우팅 기초
- OSI/TCP-IP 계층, MTU/MSS/PMTUD
- 인터페이스 관리: `ip`/`nmcli`, 주소/링크/라우트
- 라우팅 테이블/메트릭, 기본 게이트웨이, 소스 기반 라우팅 개요
- IPv4/IPv6 기초, CIDR/프리픽스 계산

### 4-2 이름 해석/주소할당 (DNS/DHCP)
- DNS 동작(재귀/권한/캐시), DNSSEC, split‑horizon
- 도구: `dig`/`nslookup`/`drill`, 레코드 유형(A/AAAA/CNAME/TXT/SRV)
- DHCP 기본(DORA), 예약/옵션, PXE 부팅 개념

### 4-3 방화벽/보안 접속
- iptables/nftables 개념 및 테이블/체인 구조
- firewalld 존/서비스, 리치 규칙
- SSH 하드닝, 포트포워딩/프록시점프, fail2ban
- TLS/인증서 기초(키/CSR/CA), 실무 검증(OCSP, ALPN, HSTS)

### 4-4 로드밸런서/프록시
- L4/L7 기본: Health check, 세션 유지, 프로브 설계
- HAProxy/Nginx 역방향/정방향 프록시 구성
- 캐싱, 압축, WAF 개요 및 배치 패턴

### 4-5 고가용성/고급 토폴로지
- VLAN/trunk, bonding(team) 설계
- 게이트웨이 이중화: VRRP/GLBP/HSRP, keepalived
- 정책 기반 라우팅(PBR), 다중 회선/게이트웨이
- VPN: OpenVPN/IPSec 기본, 터널/라우팅 상호작용
- 컨테이너 네트워킹/네임스페이스, veth/브리지 개요

### 4-6 진단/성능 분석
- 네트워크 성능 측정: `iperf3`, `mtr`, `ping` 방법론
- 패킷 캡처/분석: `tcpdump`, Wireshark, pcap 필터
- 서비스 레벨 점검: `ss`/`curl`/`nmap`로 종단 상태 확인
- 병목 분류 절차: 링크/전송/네트워크/애플리케이션 층 구분

---

## 5. 실습 코너
### 5-0 랩 가이드
- 실습 공통 가이드와 환경 요구사항, 제출 형식 안내(준비됨)

### 5-1 리눅스 실습
- 1단계~4단계 예제 스텝 파일 구비(진행 중)

### 5-2 네트워크 실습
- 여긴 아직 구성준비중

### 5-3 복합 실습
- 여긴 아직 구성준비중
