---
title: 서버 운영
slug: 3-1_ops
section: 3. 리눅스 서버 운영 & 트러블슈팅
duration: 70m
prereqs: [2-4_advanced_admin]
---

## 학습 목표
- systemd 유닛 운영 표준과 의존성(After/Wants/Requires)을 이해한다.
- 로깅 보존/로테이션과 rsyslog 연동을 설정한다.
- ulimit와 cgroups v2로 자원 한계를 설계한다.
- fstab/LVM/fsck 등 스토리지 운영 포인트를 설명한다.
- sudo 정책/계정 잠금/SSH 하드닝을 적용한다.
- 백업/복구의 RPO/RTO 관점에서 정책을 수립한다.

## 핵심 개념
- Unit 구조: [Unit]/[Service]/[Install], Drop‑in 우선
- Restart 정책과 StartLimit, 환경변수/시크릿 주입
- journal 보존과 rsyslog 파이프라인, 구조화 로그
- cgroups v2 컨트롤러(cpu/memory/io), OOM 대응
- fstab 옵션(noatime, discard, x-systemd.automount)
- 백업 설계: 주기/보관/오프사이트, 복구 리허설

## 핵심 명령/도구
- `systemctl`, `journalctl`, `loginctl`
- `ulimit`, `systemd-run --scope`(cgroup 격리)
- `mount`, `fsck`, `/etc/fstab`, `lvs`/`vgs`
- `sudo`, `visudo`, `chage`, `ssh-keygen`

## 체크리스트/퀴즈
- Drop‑in과 유닛 파일 직접 편집의 장단점을 비교하라.
- RPO/RTO가 서로 다른 서비스의 백업 주기를 어떻게 다르게 설계할까?

## 필수 레시피 (바로 써먹기)
- 저널 보존 설정: `/etc/systemd/journald.conf`에서 `Storage=persistent` 후 `systemctl restart systemd-journald`
- 서비스 환경 주입(drop‑in): `systemctl edit mysvc` → `[Service]\nEnvironment=APP_ENV=prod`
- 재시작 정책: `Restart=on-failure` + `RestartSec=5s`
- 자원 제한: `[Service]\nMemoryMax=1G\nCPUWeight=200\nIOReadBandwidthMax=/var/log 5M`
- 로테이션 확인: `journalctl --disk-usage` 및 `vacuum-time --since 7d`
- cgroup에서 실행: `systemd-run --scope -p MemoryMax=512M htop`
- fstab 옵션 점검: `findmnt -no OPTIONS /var | tr ',' '\n'`
- sudo 정책 분리: `/etc/sudoers.d/app`에 `app ALL=(root) NOPASSWD:/usr/bin/systemctl restart mysvc`
- 백업 리허설: `rsync --dry-run -av /data /backup` + 복구 테스트
- 유닛 상태/의존: `systemctl list-dependencies mysvc`

## 실행 예시 (출력 스니펫)
- `journalctl --disk-usage`
```
Archived and active journals take up 128.0M in the file system.
```

- `systemctl show -p Restart,RestartSec,CPUWeight,MemoryMax mysvc`
```
Restart=on-failure
RestartSec=5s
CPUWeight=200
MemoryMax=1073741824
```

## 현장 꿀팁 10선
- 유닛 덮어쓰기 대신 drop‑in: 패키지 업데이트에도 안전
- 로깅은 구조화 키-값 추천: 파이프라인 필터링 용이
- `PrivateTmp=true`, `ProtectSystem=strict` 등 sandboxing 옵션 적극 활용
- `RuntimeDirectory=`로 런타임 파일/소켓 경로 표준화
- `journalctl -u svc -S "yesterday" -p warning..alert`로 빠른 이슈 확인
- `loginctl session-status`로 세션 문제 확인, linger 사용자 관리
- `systemctl daemon-reload` 잊지 않기(유닛 수정 후)
- LVM 스냅샷은 짧게 쓰고 즉시 정리, I/O 영향 고려
- `sudo -l`로 최소 권한 검증, 필요 범위만 허용
- 백업은 복구까지가 완성: 정기 복구 테스트 체크리스트 유지

## 외부 참고 요약

See the respective man pages for more information: systemd.service (5) , systemd.socket (5) , systemd.device (5) , systemd.mount (5) , systemd.automount (5) , systemd.swap (5) , systemd.target (5) , systemd.path (5) , systemd.timer (5) , systemd.slice (5) , systemd.scope (5) .

--user $XDG_CONFIG_HOME/systemd/user.control ~/.config/systemd/user.control $XDG_CONFIG_HOME ~/.config $XDG_RUNTIME_DIR/systemd/user.control $XDG_RUNTIME_DIR/systemd/transient $XDG_RUNTIME_DIR/systemd/generator.early early-dir $XDG_CONFIG_HOME/systemd/user $HOME/.config/systemd/user $XDG_CONFIG_HOME ~/.config $XDG_CONFIG_DIRS/systemd/user /etc/xdg/systemd/user $XDG_CONFIG_DIRS /etc/xdg /etc/systemd/user $XDG_RUNTIME_DIR/systemd/user /run/systemd/user $XDG_RUNTIME_DIR/systemd/generator normal-dir $XDG_DATA_HOME/systemd/user $HOME/.local/share/systemd/user $XDG_DATA_HOME ~/.local/share $XDG_DATA_DIRS/systemd/user /usr/local/share/systemd/user /usr/share/systemd/user $XDG_DATA_DIRS /usr/local/share /usr/share $dir/systemd/user $dir $XDG_DATA_DIRS $XDG_DATA_DIRS /usr/local/lib/systemd/user /usr/lib/systemd/user $XDG_RUNTIME_DIR/systemd/generator.late late-dir The set of load paths for the user manager instance may be augmented or changed using various environment variables.

For example, symlinks /etc/systemd/system/alias1.service â service1.service , /etc/systemd/system/alias2.service â /usr/lib/systemd/service1.service , /etc/systemd/system/alias3.service â /etc/systemd/system/service1.service are all valid aliases and service1.service will have four names, even if the unit file is located at /run/systemd/system/service1.service .

/etc/systemd/system/alias1.service service1.service /etc/systemd/system/alias2.service /usr/lib/systemd/service1.service /etc/systemd/system/alias3.service /etc/systemd/system/service1.service service1.service /run/systemd/system/service1.service /etc/systemd/system/link1.service ../link1_service_file link1.service /etc/systemd/link1_service_file Unit Garbage Collection Â¶ The system and service manager loads a unit's configuration automatically when a unit is referenced for the first time.

Requisite=b.service a.service RequisiteOf=a.service b.service RequisiteOf= Added in version 201.

BindsTo=b.service a.service BoundBy=a.service b.service BoundBy= Added in version 201.

PartOf=b.service a.service ConsistsOf=a.service b.service ConsistsOf= Added in version 201.

Upholds=b.service a.service UpheldBy=a.service b.service Added in version 249.

Name systemd.service â Service unit configuration Synopsis service .service service .service service Description Â¶ A unit configuration file whose name ends in " .service " encodes information about a process controlled and supervised by systemd.

.service .scope Service Templates Â¶ It is possible for systemd services to take a single argument via the " service @ argument .service " syntax.

Service unit files must include a [Service] section, which carries information about the service and the process it supervises.

_SYSTEMD_CGROUP= _SYSTEMD_SLICE= _SYSTEMD_UNIT= _SYSTEMD_USER_UNIT= _SYSTEMD_USER_SLICE= _SYSTEMD_SESSION= _SYSTEMD_OWNER_UID= The control group path in the systemd hierarchy, the systemd slice unit name, the systemd unit name, the unit name in the systemd user manager (if any), the systemd session ID (if any), and the owner UID of the systemd user unit or systemd session (if any) of the process the journal entry originates from.

### 출처
- https://www.freedesktop.org/software/systemd/man/systemd.unit.html
- https://www.freedesktop.org/software/systemd/man/systemd.service.html
- https://www.freedesktop.org/software/systemd/man/systemd.journal-fields.html
