# Linux Basics — Lecture Draft

## Outline (from intro.md)

# 📚 리눅스 커리큘럼 (최종 정리본)

## 🖥️ 운영체제와 설치
### 01장 컴퓨터/운영체제 기초
- 운영체제 기본 개념 (커널, 쉘, 시스템 콜)
- 프로세스와 스레드 차이
- 컴퓨터 구조 (CPU, 메모리, 디스크, I/O)
- BIOS/UEFI, 부트 과정

### 02장 설치 및 가상화 기초
- 리눅스 배포판 종류 (RHEL, Ubuntu, Rocky 등)
- 설치 방법 (ISO, USB, 네트워크 설치)
- 가상화 개념 (하이퍼바이저, VM vs Container)
- VMware, VirtualBox 설치 및 기본 설정
- 가상 머신 네트워크 모드 (NAT, 브리지, 호스트 전용)
- 기본 CLI 사용법 (터미널, 프롬프트 이해)

---

## ⚙️ 리눅스 핵심 명령어
### 03장 기본 명령어 실습
- 파일/디렉토리 명령어: ls, cp, mv, rm, touch, mkdir, rmdir
- 탐색 명령어: pwd, cd, find, locate
- 텍스트 확인: cat, less, more, head, tail
- 도움말: man, help, --help

### 04장 권한과 사용자 개념
- 사용자/그룹 관리: useradd, userdel, groupadd
- 파일 권한: rwx, chmod, chown, chgrp
- umask 기본값
- sudo 개념 및 visudo 설정

### 05장 파일시스템 개념
- 파일시스템 구조: EXT4, XFS, Btrfs
- FHS (Filesystem Hierarchy Standard)
- 마운트/언마운트: mount, umount
- /etc/fstab 설정
- inodes 개념

### 06장 프로세스 관리
- 프로세스 조회: ps, top, htop
- 프로세스 제어: kill, pkill, jobs, fg, bg
- systemd 서비스 관리: systemctl start/stop/status
- 런레벨(target) 개념

---

## 🛠️ 관리·스토리지·네트워크
### 07장 네트워크 기초
- 네트워크 인터페이스 관리: ip addr, ifconfig, nmcli
- 기본 네트워킹: ping, traceroute, netstat, ss
- DNS 확인: nslookup, dig
- 라우팅 테이블: ip route

### 08장 사용자/그룹 관리 심화
- PAM 인증 모듈
- /etc/passwd, /etc/shadow 구조
- 비밀번호 정책 (chage, passwd)
- ACL (Access Control List)

### 09장 리눅스 고급 명령어
- 고급 텍스트 처리: grep, awk, sed, cut, sort, uniq
- 아카이빙/압축: tar, gzip, bzip2, xz
- 스트림 편집: tee, xargs, tr
- 파일 비교: diff, cmp, md5sum

### 10장 스토리지 관리
- 디스크 파티셔닝: fdisk, parted
- 파일시스템/마운트 관리
- LVM 관리: pvcreate, vgcreate, lvcreate
- RAID 개념 및 mdadm 사용법
- multipath 기본 설정
- 스토리지 모니터링: iostat, df, du
- 분산 스토리지 개요 (Ceph, GlusterFS)

### 11장 패키지 관리
- RHEL 계열: yum, dnf, rpm
- Debian 계열: apt, dpkg
- 리포지토리 관리 (/etc/yum.repos.d/)
- 소스 코드 컴파일 설치 (make, gcc)

### 12장 네트워크 심화
- netcat (nc) 활용
- tcpdump, wireshark 기초
- iptables / firewalld 룰 설정
- ssh, scp, rsync
- curl, wget

### 13장 실습: 로컬 레포지토리 구축
- HTTP 기반 리포지토리 구성 (nginx, httpd)
- createrepo, reposync 사용
- 로컬 미러링 개념
- GPG 키 서명

### 14장 3-Tier 아키텍처 개요 및 실습
- Web / WAS / DB 개념
- Apache, Nginx 기본 설정
- Tomcat 설치 및 연동 (mod_jk, mod_proxy)
- MySQL/MariaDB 기초 설치
- 간단한 웹 애플리케이션 배포

### 15장 쉘 스크립트 실습
- Bash 스크립트 기초 (변수, 조건문, 반복문)
- 함수, exit code, 파라미터
- 크론탭 (crontab)
- 로깅 및 디버깅

---

## 🌐 고급 실무
### 16장 네트워크 융합 실습
- VLAN, trunk, access 개념
- Bonding, LACP 구성
- VRRP/GLBP/HSRP 실습
- iptables 고급 설정, NAT
- VPN 기초 (OpenVPN, IPSec)

### 17장 고가용성(HA) 및 클러스터링
- Pacemaker + Corosync 구성
- STONITH, fencing 개념
- DRBD 미러링
- Keepalived 기반 VIP
- HAProxy 로드밸런싱

### 18장 메일 및 그룹웨어 실습
- Postfix 설치 및 큐 관리
- Dovecot IMAP/POP3 설정
- Roundcube 웹메일 연동
- PostgreSQL 백엔드 DB 연동
- Zimbra, Exchange 개요

### 19장 모니터링 & 관리
- Zabbix 설치 및 에이전트 연동
- Prometheus + Grafana 기초
- systemd-journald, rsyslog 관리
- 로그 분석 툴 (ELK 스택 개요)
- SNMP 기초

### 20장 자동화 심화
- Ansible 기초 (Playbook 작성)
- Terraform 개요
- Git + CI/CD 파이프라인 (Jenkins, GitLab CI)
- Kubernetes 기초 (Pod, Deployment, Service)
- 자동화 스크립트 설계 원칙


---

## Sources & Summaries

### 01_os_overview
- [missing] https://en.wikipedia.org/wiki/Operating_system
- [missing] https://wiki.archlinux.org/title/Linux

### 02_install_virtualization
- [missing] https://ubuntu.com/tutorials/install-ubuntu-desktop
- [missing] https://docs.rockylinux.org/guides/installation/
- [missing] https://www.virtualbox.org/manual/ch01.html

### 03_basic_commands
- [missing] https://man7.org/linux/man-pages/man1/ls.1.html
- [missing] https://man7.org/linux/man-pages/man1/cp.1.html
- [missing] https://man7.org/linux/man-pages/man1/mv.1.html
- [missing] https://man7.org/linux/man-pages/man1/rm.1.html
- [missing] https://man7.org/linux/man-pages/man1/find.1.html

### 04_users_permissions
- [missing] https://wiki.archlinux.org/title/Users_and_groups
- [missing] https://man7.org/linux/man-pages/man1/chmod.1.html
- [missing] https://man7.org/linux/man-pages/man1/chown.1.html

### 05_filesystems
- [missing] https://refspecs.linuxfoundation.org/FHS_3.0/fhs-3.0.html
- [missing] https://kernel.org/doc/html/latest/filesystems/ext4/index.html
- [missing] https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/9/html/managing_file_systems/index

### 06_processes_systemd
- [missing] https://man7.org/linux/man-pages/man1/ps.1.html
- [missing] https://man7.org/linux/man-pages/man1/top.1.html
- [missing] https://www.freedesktop.org/software/systemd/man/latest/systemctl.html

### 07_networking_basics
- [missing] https://man7.org/linux/man-pages/man8/ip.8.html
- [missing] https://man7.org/linux/man-pages/man8/ss.8.html
- [missing] https://man7.org/linux/man-pages/man8/ping.8.html

### 08_auth_security
- [missing] https://wiki.archlinux.org/title/PAM
- [missing] https://man7.org/linux/man-pages/man5/passwd.5.html
- [missing] https://man7.org/linux/man-pages/man5/shadow.5.html

### 09_text_processing
- [missing] https://www.gnu.org/software/grep/manual/grep.html
- [missing] https://www.gnu.org/software/sed/manual/sed.html
- [missing] https://www.gnu.org/software/gawk/manual/gawk.html

### 10_storage_lvm_raid
- [missing] https://man7.org/linux/man-pages/man8/fdisk.8.html
- [missing] https://www.gnu.org/software/parted/manual/parted.html
- [missing] https://tldp.org/HOWTO/LVM-HOWTO/
- [missing] https://man7.org/linux/man-pages/man8/mdadm.8.html

### 11_package_management
- [missing] https://dnf.readthedocs.io/en/latest/command_ref.html
- [missing] https://wiki.debian.org/apt
- [missing] https://manpages.debian.org/apt

### 12_network_tools
- [missing] https://nc110.sourceforge.net/
- [missing] https://www.tcpdump.org/manpages/tcpdump.1.html
- [missing] https://firewalld.org/documentation/
- [missing] https://www.openssh.com/manual.html

### 13_repo_practice
- [missing] https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/packaging_and_distributing_software/assembly_creating-a-customized-offline-repository_pds
- [missing] https://createrepo.baseurl.org/
- [missing] https://docs.fedoraproject.org/en-US/epel/

### 14_three_tier
- [missing] https://nginx.org/en/docs/
- [missing] https://httpd.apache.org/docs/
- [missing] https://dev.mysql.com/doc/
