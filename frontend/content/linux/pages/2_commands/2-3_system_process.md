---
title: 시스템/프로세스 관리
slug: 2-3_system_process
section: 2. 리눅스 명령어
duration: 60m
prereqs: [2-2_users_perms]
---

## 학습 목표
- 프로세스/서비스/유닛의 차이를 설명한다.
- `systemctl`과 `journalctl`로 서비스를 운영/디버깅한다.
- 스케줄링(cron/at/systemd timer)과 시간 동기화를 설정한다.
- 자원 제한(ulimit)과 OOM 동작을 이해한다.

![systemd Flow](../../assets/systemd_flow.svg)

## 핵심 개념
- 프로세스 상태, `ps`/`top`/`htop`
- systemd unit: service/timer/target
- 로깅(journal)과 rsyslog
- chrony/ntpd 시간 동기화
- cgroups 개요, OOM Killer

## 전문가 포인트
- Unit 파일 섹션: `[Unit]`(After/Requires), `[Service]`(Type=, ExecStart=, Restart=), `[Install]`
- `Restart=` 정책과 backoff, `StartLimitBurst/IntervalSec` 튜닝
- `journalctl -u svc -b -1`로 이전 부팅 로그 추적, `-g` 패턴 필터링
- timer 유닛: `OnCalendar=`(systemd‑timesyncd 적용 고려), `Persistent=true`
- cgroups v2 컨트롤러: `cpu.max`, `memory.high/max`, `io.max`

## 명령어 조합 레시피
- 서비스 디버그 3단계: `systemctl status svc` → `journalctl -u svc -n 200 --no-pager` → `SYSTEMD_LOG_LEVEL=debug systemctl restart svc`
- 포트 충돌 추적: `ss -lptn '( sport = :8080 )'` → `pid`로 `journalctl -p info..alert _PID=xxx`
- 일시 리소스 제한 실행: `systemd-run --scope -p CPUWeight=200 -p MemoryMax=1G -- bash -c 'cmd'`
- 실패 서비스 한눈에: `systemctl --failed --no-legend | awk '{print $1}' | xargs -r -I{} journalctl -u {} -b --since today -p warning..alert --no-pager | rg -n "(error|fail|timeout)"`
- 타이머 상태 요약: `systemctl list-timers --all | sed -n '1,200p'`

## 방어적 사용 팁
- 유닛 편집은 drop‑in 우선: `systemctl edit svc` (원본은 패키지 업데이트 영향)
- `KillMode=process`/`control-group` 선택으로 하위 프로세스 종료 거동 제어
- `TimeoutStartSec`/`TimeoutStopSec` 적정화로 데드락 회피

## 실행 예시 (출력 스니펫)
- `systemctl status nginx` (예시)
```
● nginx.service - A high performance web server and a reverse proxy server
     Loaded: loaded (/lib/systemd/system/nginx.service; enabled)
     Active: active (running) since Wed 2025-09-10 09:02:11 UTC; 3min ago
   Main PID: 1123 (nginx)
      Tasks: 2 (limit: 9409)
     Memory: 3.8M
     CGroup: /system.slice/nginx.service
             ├─1123 nginx: master process /usr/sbin/nginx
             └─1125 nginx: worker process
```

- `systemctl list-timers --all | head -n 8`
```
NEXT                        LEFT     LAST                        PASSED UNIT                         ACTIVATES
Wed 2025-09-10 10:00:00 UTC 56min    Wed 2025-09-10 09:00:00 UTC 4min   logrotate.timer              logrotate.service
Wed 2025-09-10 10:15:00 UTC 1h 11min Wed 2025-09-10 09:15:00 UTC 49min  apt-daily.timer              apt-daily.service
```

- `ss -lptn '( sport = :8080 )'`
```
State   Recv-Q  Send-Q   Local Address:Port  Peer Address:Port Process
LISTEN  0       4096     0.0.0.0:8080        0.0.0.0:*      users:(("myapp",pid=2345,fd=7))
```

## 핵심 명령/도구
- `ps`, `top`, `htop`, `kill`
- `systemctl`, `journalctl`, `timedatectl`
- `crontab`, `at`, systemd timer 유닛

## 실무 팁
- `systemctl edit --full` 대신 drop‑in(`systemctl edit`)으로 유지보수성 확보
- OOM 분석: `dmesg | rg -i oom`, `systemd-oomd` 활성화 여부 확인

## 체크리스트/퀴즈
- 실패한 유닛 원인 파악 절차를 3단계로 적어보기

## 외부 참고(가이드)
- systemd 매뉴얼, chrony 문서

## 연계 실습
- 타이머 유닛으로 로그 백업 자동화
## 필수 레시피 (바로 써먹기)
- 상위 자원 소비 프로세스: `ps -eo pid,comm,%cpu,%mem --sort=-%cpu | head`
- 프로세스 종료(이름): `pkill -f myapp` (신중히 사용)
- 서비스 활성화+시작: `sudo systemctl enable --now mysvc`
- 최근 10분 서비스 로그: `journalctl -u mysvc --since "-10 min" -n 200 --no-pager`

## 현장 꿀팁 10선
- 유닛 내용 확인: `systemctl cat svc` (원본+drop-in 한눈에)
- 유닛 속성 값만: `systemctl show -p ExecStart,Restart,TimeoutStartSec svc`
- 부팅 대상 변경은 `isolate`로: `systemctl isolate rescue.target` (원복 경로 숙지)
- 재시작 폭주 방지: `Restart=on-failure` + `StartLimitBurst/IntervalSec` 조합
- 타이머는 `Persistent=true`로 부팅 중 누락된 실행 보전
- journal 디스크 보존: `/etc/systemd/journald.conf`의 `Storage=persistent`
- 서비스 환경 변수 주입: `/etc/systemd/system/svc.service.d/override.conf`에 `Environment=`
- `pidstat -dur 1`로 CPU/IO 모니터링(패키지: sysstat)
- `systemd-run --scope`로 임시 cgroup 격리 실행
- 포크형 데몬은 `Type=forking`, 간단한 전경은 `Type=simple`로 구분
