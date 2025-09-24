---
title: 트러블슈팅
slug: 3-2_troubleshooting
section: 3. 리눅스 서버 운영 & 트러블슈팅
duration: 80m
prereqs: [3-1_ops]
---

## 학습 목표
- 부팅/서비스/네트워크/디스크 이슈를 체계적으로 분류하고 해결한다.
- SELinux/PAM 문제를 로그로 추적하고 예외를 처리한다.
- 감사(audit) 규칙을 설계하고 포렌식 데이터를 수집한다.

## 핵심 개념
- GRUB 수동 부팅, initramfs 검증(`lsinitrd`), 커널 파라미터
- 서비스 재시작 루프 진단(StartLimit, ExitStatus)
- 네트워크: 라우팅/방화벽/DNS 확인(`ip`/`ss`/`nft`/`dig`)
- 파일/디스크: `lsof +L1`, orphan inode, 로테이션 이슈
- 성능 병목: `vmstat`/`iostat`/`sar` 지표 해석
- SELinux: AVC 로그, `semanage`/`chcon`/`restorecon`
- 감사: `auditctl` 정책, `ausearch` 쿼리

## 핵심 명령/도구
- `journalctl`, `systemctl`, `grub2-*`, `lsinitrd`
- `lsof`, `fuser`, `vmstat`, `iostat`, `sar`
- `semanage`, `chcon`, `auditctl`, `ausearch`

## 체크리스트/퀴즈
- 삭제된 로그 파일 핸들 때문에 디스크가 가득 찬 상황을 어떻게 해소할까?

## 필수 레시피 (바로 써먹기)
- 이전 부팅 로그: `journalctl -b -1 -p warning..alert --no-pager | sed -n '1,200p'`
- 부팅 실패 시 수동 부팅: GRUB에서 루트/커널/initrd 지정 → chroot → `grub2-install`
- 포트 충돌 즉시 확인: `ss -lptn | rg ':80\b'`
- 방화벽 룰 요약: `nft list ruleset | sed -n '1,60p'` 또는 `firewall-cmd --list-all`
- DNS 빠른 점검: `dig +short A example.com @8.8.8.8` · `resolvectl status`
- 라우팅 확인: `ip route get 8.8.8.8`로 실제 경로 확인
- 삭제된 파일 핸들: `lsof +L1 | awk '{print $2}' | xargs -r -I{} sh -c 'echo >/proc/{}/fd/1'` (서비스 재시작 권장)
- 디스크 I/O 병목: `iostat -x 1 5`에서 `await`/`%util` 확인
- SELinux 거부 요약: `ausearch -m avc -ts recent | aureport -m`
- PAM 잠금: `faillock --user user --reset` (정책 확인 후)

## 실행 예시 (출력 스니펫)
- `journalctl -b -1 -p err..alert | head -n 5`
```
Sep 10 08:59:01 host kernel: EXT4-fs warning ...
Sep 10 08:59:02 host systemd[1]: Failed to start mysvc.service.
...
```

- `lsof +L1 | head -n 3`
```
COMMAND   PID USER   FD   TYPE DEVICE SIZE/OFF NLINK NODE NAME
mysvc    2345 app     1w   REG  253,0  1048576     0 1234 /var/log/app.log (deleted)
```

## 현장 꿀팁 10선
- 3단계 분류: 증상→원인 가설→검증/조치, 로그는 타임라인으로 정리
- `journalctl -g KEYWORD`로 전역 키워드 검색(부팅 범위 지정)
- 네트워크는 층별로 나눠 확인: 링크(링크업/속도)→IP/ARP→라우팅→방화벽→DNS→애플리케이션
- 방화벽 비활성화 대신 임시 허용 룰 추가로 재현(추후 원복)
- 삭제된 파일 핸들 이슈는 서비스 재시작이 근본 해결
- 디스크 가득 참은 대개 로그/코어덤프/로테이션 미흡: 폴더별 TOP 먼저 확인
- SELinux는 정책으로 해결: 임시 `setenforce 0`은 극히 제한적으로
- 변경 전 롤백 플랜 확보: 설정 백업·스냅샷·명령 이력 보관
- 증거 보존: 포렌식 필요시 로그/설정/pcap 보존 후 조치
- 사후 리포트: 재발 방지 액션을 명확히(모니터링/경보/자동화)

## 외부 참고 요약

timers.target basic.target User manager startup Â¶ The system manager starts the user@ uid .service unit for each user, which launches a separate unprivileged instance of systemd for each user â the user manager.

/run/initramfs/shutdown /run/initramfs/ /shutdown /run/ See Also Â¶ systemd (1) , boot (7) , systemd.special (7) , systemd.target (5) , systemd-halt.service (8) , systemd-soft-reboot.service (8)

Core OS Command Line Arguments Â¶ systemd.unit= rd.systemd.unit= systemd.dump_core systemd.crash_chvt systemd.crash_shell systemd.crash_action= systemd.confirm_spawn systemd.service_watchdogs systemd.show_status systemd.status_unit_format= systemd.log_target= systemd.log_level= systemd.log_location= systemd.log_color systemd.log_ratelimit_kmsg systemd.default_standard_output= systemd.default_standard_error= systemd.setenv= systemd.machine_id= systemd.set_credential= systemd.set_credential_binary= systemd.import_credentials= systemd.reload_limit_interval_sec= systemd.reload_limit_burst= Parameters understood by the system and service manager to control system behavior.

For details, see systemd-backlight@.service (8) and systemd-rfkill.service (8) .

systemd.journald.forward_to_syslog= systemd.journald.forward_to_kmsg= systemd.journald.forward_to_console= systemd.journald.forward_to_wall= Parameters understood by the journal service.

veritytab= rd.veritytab= roothash= systemd.verity= rd.systemd.verity= systemd.verity_root_data= systemd.verity_root_hash= systemd.verity_root_options= usrhash= systemd.verity_usr_data= systemd.verity_usr_hash= systemd.verity_usr_options= Configures the integrity protection root hash for the root and /usr file systems, and other related parameters.

systemd.getty_auto= Configures whether the serial-getty@.service will run.

systemd.condition_first_boot= ConditionFirstBoot= systemd-firstboot.service Added in version 233.

ConditionFirstBoot= systemd.firstboot= systemd-firstboot.service Added in version 246.

History Â¶ Kernel command-line arguments systemd.unified_cgroup_hierarchy and systemd.legacy_systemd_cgroup_controller were deprecated.

systemd.unified_cgroup_hierarchy systemd.legacy_systemd_cgroup_controller Added in version 252.

See Also Â¶ systemd (1) , systemd-system.conf (5) , bootparam (7) , systemd.system-credentials (7) , smbios-type-11 (7) , systemd-debug-generator (8) , systemd-fsck@.service (8) , systemd-quotacheck.service (8) , systemd-journald.service (8) , systemd-vconsole-setup.service (8) , systemd-udevd.service (8) , plymouth (8) , systemd-cryptsetup-generator (8) , systemd-veritysetup-generator (8) , systemd-fstab-generator (8) , systemd-getty-generator (8) , systemd-gpt-auto-generator (8) , systemd-volatile-root.service (8) , systemd-modules-load.service (8) , systemd-backlight@.service (8) , systemd-rfkill.service (8) , systemd-hibernate-resume-generator (8) , systemd-firstboot.service (8) , bootctl (1)

### 출처
- https://www.freedesktop.org/software/systemd/man/latest/bootup.html
- https://www.freedesktop.org/software/systemd/man/latest/kernel-command-line.html
- https://access.redhat.com/solutions/
