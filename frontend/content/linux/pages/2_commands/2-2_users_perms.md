---
title: 사용자/권한
slug: 2-2_users_perms
section: 2. 리눅스 명령어
duration: 50m
prereqs: [2-1_basics]
---

## 학습 목표
- 사용자/그룹/보조그룹 모델을 설명한다.
- 권한 비트와 특수 권한(SUID/SGID/Sticky)을 구분한다.
- ACL/불변 플래그로 세밀 권한 제어를 구성한다.
- `sudo` 정책과 보안 관점을 이해한다.

![Permissions](../../assets/linux_permissions.svg)

## 핵심 개념
- `uid`/`gid`/`umask`/`ACL`
- `chattr`/`lsattr`, SUID/SGID/Sticky 동작
- 로그인 셸과 환경 변수, `secure_path`

## 전문가 포인트
- SUID의 진짜 동작: 실행 중 effective UID 상승, `cap_setuid` 대안
- SGID 디렉터리: 신규 파일의 그룹 상속, 협업 디렉터리 패턴
- Sticky bit: 디렉터리 내 삭제 제한(/tmp), 파일에는 역사적 유산
- ACL vs POSIX 모드: 마스킹 비트, `umask` 상호 작용 주의
- 불변 플래그+i: 루트도 삭제 불가, 유지보수시 일시 해제 권고

## 명령어 조합 레시피
- SUID/SGID 진단: `find / -xdev \( -perm -4000 -o -perm -2000 \) -type f -printf '%m %u:%g %p\n' 2>/dev/null`
- world-writable 디렉터리 점검: `find /var /tmp -xdev -type d -perm -0002 -printf '%m %p\n'`
- 불변 플래그 확인/해제: `lsattr -R /var/app && chattr -i /var/app/config.yaml`
- ACL 백업/복원: `getfacl -R --absolute-names proj > proj.acl && setfacl --restore=proj.acl`
- 디렉터리 협업 패턴: `chmod 2775 team && chgrp dev team && setfacl -m g:qa:rX team`
- 특정 파일의 권한 전이: `install -m 0640 -o root -g app config.yaml /etc/app/`

## 방어적 사용 팁
- 기본 `umask` 점검: `grep -R '^UMASK' /etc/login.defs /etc/pam.d/* /etc/profile*`
- sudo 규칙은 파일 분리: `/etc/sudoers.d/팀명` + `visudo -f /etc/sudoers.d/팀명`
- `secure_path`로 PATH 고정, `requiretty` 비활성화는 신중히

## 확장/능력치
- Capabilities로 root 없이 바인드: `setcap 'cap_net_bind_service=+ep' /usr/bin/myapp`
- 유효 ID 확인: `id -u -n; id -G -n`와 `stat -c '%U:%G %a' file`

## 실행 예시 (권한/ACL)
```
mkdir -p team && sudo chgrp dev team && sudo chmod 2775 team
getfacl team
```
예상 출력(요약)
```
# file: team
# owner: youruser
# group: dev
user::rwx
group::r-x
group:qa:r-x
mask::r-x
other::r-x
```

Sticky bit 예시
```
sudo chmod 1777 /tmp/shared
ls -ld /tmp/shared
```
예상 출력
```
drwxrwxrwt 2 root root 4096 Sep 10 10:00 /tmp/shared
```

## 핵심 명령/도구
- `useradd`, `groupadd`, `passwd`, `usermod`
- `chmod`, `chown`, `getfacl`, `setfacl`, `sudo`, `visudo`

## 실무 팁
- `/etc/sudoers.d/팀명`로 정책 분리, `visudo -f`로 검증
- ACL을 사용할 때 `getfacl -R --absolute-names`로 백업

## 체크리스트/퀴즈
- 공유 디렉터리에서 Sticky bit가 필요한 이유는?

## 외부 참고(가이드)
- RHEL/Arch Wiki: Users and groups, ACL

## 연계 실습
- 팀 폴더에 ACL로 프로젝트별 접근 통제 구성
## 필수 레시피 (바로 써먹기)
- 소유권/권한 재귀 적용: `sudo chown -R app:app /srv/app && sudo chmod -R u=rwX,g=rX,o= /srv/app`
- 새 파일 기본 권한(umask) 확인: `umask` → 일반적 기본값 `0022` 또는 `0027`
- 사용자 sudo 권한 확인: `sudo -l -U username`
- 숫자권한 빠르게: `chmod 640 file` = `u=rw,g=r,o=`

## 현장 꿀팁 10선
- 경로별 권한 체인 확인: `namei -l /path/to/file`로 각 디렉터리 권한 확인
- 서비스 계정 홈 디렉터리 권한은 최소화: `chmod 750 /home/svc`
- 비밀 키/토큰은 불변 플래그로 보호: `chattr +i /etc/app/secret` (변경 시 해제)
- 협업 디렉터리는 SGID+기본 ACL: `chmod 2775` + `setfacl -dm g:team:rwx dir`
- Sticky 디렉터리는 파일 소유자만 삭제 가능: `/tmp` 패턴 재사용
- sudoers는 include 디렉터리 사용: `/etc/sudoers.d/*` + `visudo -f`로 검증
- 실패한 sudo 시도는 로그 확인: `journalctl -p notice -t sudo`
- 특정 포트 바인드는 capability로: `setcap 'cap_net_bind_service=+ep' /path/app`
- 새 파일 마스킹은 서비스 단위에서 `UMask=`로 강제 가능(systemd)
- 대량 권한 변경 전 스냅샷/백업/ACL 백업 필수: `getfacl -R > acl.bak`
