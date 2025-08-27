# 리눅스 교육 과정 커리큘럼
## 각각 과정이 끝날떄쯤 실습예제를 통해, 다음단계로 넘어간다.(dns,3tier라든가)

## 왕초보 과정
- **컴퓨터/운영체제 기초**
- 컴퓨터 구조와 OS의 역할
- OS란 무엇인가
- 리눅스와 유닉스의 역사와 차이
- 리눅스 배포판 소개 (Ubuntu, CentOS, Rocky 등)
- **설치 및 가상화 기초**
- ISO 이미지 개념과 사용법
- VirtualBox, VMware ESXi 개요 및 설치 실습
- 가상머신 네트워크 설정 (NAT, Bridged, Host-only)
- 원격 접속 도구: PuTTY 사용법 (SSH 기본)


## 🟢 초급 과정

- **기본 명령어 실습**
- 파일/디렉토리: `ls`, `cd`, `pwd`, `mkdir`, `rmdir`, `touch`
- 파일 내용 확인: `cat`, `more`, `less`
- 파일 조작: `cp`, `mv`, `rm`
- **권한과 사용자 개념**
- 파일 권한 구조 (rwx)
- `chmod`, `chown`, `whoami`, `id`
- SUID/SGID, umask 기본
- **파일시스템 개념**
- inode란 무엇인가
- 하드링크 vs 소프트링크 (`ln`, `ln -s`)
- 파일시스템 마운트/언마운트 (`mount`, `umount`)
- **프로세스 관리**
- `ps`, `top`, `kill`, `jobs`, `fg`, `bg`
- **네트워크 기초**
- OSI 7계층 개요
- HTTP 프로토콜 기본 개념 (GET/POST), 간단한 프로토콜 소개 (FTP, SSH)
- DNS 개념과 간단 실습 (hosts 파일 수정, `dig`, `nslookup`)


---


## 🟡 중급 과정
- **리눅스 고급 명령어**
- `find`, `grep`, `awk`, `sed`
- `tar`, `gzip`, `zip`
- `systemctl`, `journalctl`
- **사용자/그룹 관리**
- `useradd`, `usermod`, `groupadd`, `passwd`
- sudo 개념과 설정
- **파일시스템/스토리지**
- 디스크 파티션 (`fdisk`, `parted`)
- 파일시스템 생성 (`mkfs`)
- `/etc/fstab` 자동 마운트 설정
- **패키지 관리**
- RPM 기반 (`yum`, `dnf`)
- DEB 기반 (`apt`)
- 로컬 레포지토리 구축 (USB 활용)
- `/etc/yum.repos.d/`와 repo 파일 구조 이해
- **네트워크 명령어**
- `ifconfig`, `ip`, `ping`, `traceroute`, `netstat`, `ss`
- **실습: 로컬 레포지토리 구축**
- USB/DVD 기반 로컬 미러
- Repo 설정 및 패키지 설치 테스트
- **3-Tier 아키텍처 개요 및 실습**
- Web / App / DB 구조 이해
- 간단한 웹서버 (Apache/Nginx) + DB (MySQL/PostgreSQL) 구축
- DB 연결 테스트 및 간단한 웹 애플리케이션
- **쉘 스크립트 실습**
- 변수, 반복문, 조건문
- 간단한 자동화 스크립트 작성
- 실습: 사용자 계정 생성 자동화, 로그 백업 스크립트


---


## 🔴 고급 과정
- **네트워크 융합 실습**
- 본딩(Bonding)과 NIC Teaming
- VLAN 구성
- 방화벽/보안 (`firewalld`, `iptables`)
- SELinux 개요 및 관리
- **고가용성(HA) 및 클러스터링**
- Pacemaker/Corosync 기본
- 클러스터 리소스 관리
- VIP + Web 서버 클러스터 실습
- **고급 스토리지**
- LVM (볼륨 그룹, 논리 볼륨)
- iSCSI
- Multipath
- **메일 및 그룹웨어 실습**
- Webmail 구축 (Postfix + Dovecot + Roundcube)
- DNS + 메일서버(MX 레코드) 설정
- **모니터링 & 관리**
- Zabbix, Grafana 기본 연동
- 로그 수집/분석 (`rsyslog`, ELK 스택 개요)
- **자동화 심화**
- 3-Tier 아키텍처 설치 자동화 (쉘스크립트)
- Ansible 기본 소개


---


## 📌 과정 흐름 요약
1. **왕초보** : 완전 기본
2. **초급**: 설치/가상화 → 리눅스 입문 → 기본 명령어 → 권한/inode → 네트워크/DNS 기초
3. **중급**: 파일시스템/패키지 관리 → 로컬 레포지토리 → 3-Tier 아키텍처/스크립트
4. **고급**: 네트워크/스토리지/클러스터링 → 메일/Webmail → 자동화/모니터링