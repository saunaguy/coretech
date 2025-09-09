import { osAndSetup } from "./topics/os-and-setup"

export const linuxTopics = {
  "🖥️ 운영체제와 설치": osAndSetup,
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
  "🛠️ 관리·스토리지·네트워크": {
    "08장 사용자/그룹 관리 심화": [
      { id: "plan-08-1", name: "8-1 PAM 인증 모듈", title: "커리큘럼: 8-1 PAM", description: "docs/lessonplan.md 참조" },
      { id: "plan-08-2", name: "8-2 /etc/passwd, /etc/shadow 구조", title: "커리큘럼: 8-2 계정 파일", description: "docs/lessonplan.md 참조" },
      { id: "plan-08-3", name: "8-3 비밀번호 정책 (chage, passwd)", title: "커리큘럼: 8-3 비밀번호 정책", description: "docs/lessonplan.md 참조" },
      { id: "plan-08-4", name: "8-4 ACL (Access Control List)", title: "커리큘럼: 8-4 ACL", description: "docs/lessonplan.md 참조" },
    ],
    "09장 리눅스 고급 명령어": [
      { id: "plan-09-1", name: "9-1 고급 텍스트 처리: grep, awk, sed, cut, sort, uniq", title: "커리큘럼: 9-1 텍스트 처리", description: "docs/lessonplan.md 참조" },
      { id: "plan-09-2", name: "9-2 아카이빙/압축: tar, gzip, bzip2, xz", title: "커리큘럼: 9-2 아카이빙/압축", description: "docs/lessonplan.md 참조" },
      { id: "plan-09-3", name: "9-3 스트림 편집: tee, xargs, tr", title: "커리큘럼: 9-3 스트림/파이프", description: "docs/lessonplan.md 참조" },
      { id: "plan-09-4", name: "9-4 파일 비교: diff, cmp, md5sum", title: "커리큘럼: 9-4 파일 비교", description: "docs/lessonplan.md 참조" },
    ],
  },
  "🌐 고급 실무": {
  },
}
