---
title: 고급/관리 명령어
slug: 2-4_advanced_admin
section: 2. 리눅스 명령어
duration: 75m
prereqs: [2-3_system_process]
---

## 학습 목표
- 텍스트 처리 도구로 로그/데이터를 효율적으로 가공한다.
- 패키지/리포지토리/서비스 유닛을 운영 관점에서 관리한다.
- 파일시스템 점검/마운트/용량 분석으로 장애 원인을 추적한다.
- 네트워크/보안 도구로 진단과 하드닝 기초를 수행한다.

## 핵심 개념
- `grep`/`awk`/`sed`/`sort`/`xargs` 파이프라인 패턴
- `dnf`/`apt`/`rpm`/`dpkg`, repo 설정(EPEL/PPA)
- `fstab`/`fsck`/`mount`/`automount`, `df`/`du`
- 네트워크 진단: `ss`/`nmap`/`dig`/`curl`/`nc`
- 보안: `firewalld`/`iptables`/`nftables`, 무결성 해시

## 전문가 포인트
- 텍스트 처리: `LC_ALL=C`와 정규식 엔진 차이, `grep -P` 유의
- `awk`로 컬럼 집계/피벗, `sort -S` 메모리 사용량 조절, `--parallel` 활용
- repo 보안: GPG 키 서명, 핀닝/홀드, 미러 캐시 관리
- fstab 옵션: `noatime`, `discard`(SSD), `x-systemd.automount` 콜드부트 가속
- nftables: family/chain/table 구조, set/map로 정책 간결화

## 명령어 조합 레시피
- 로그 트리아지: `journalctl -p warning..alert --since -1h | rg -n "(panic|oom|segfault|refused|denied)" | tee errors.log`
- 디스크 용량 TOP 디렉터리: `du -x -m --max-depth=2 /var | sort -n | tail -n 20 | numfmt --to=iec --suffix=B`
- 대용량 파일 검색: `find / -xdev -type f -size +1G -printf '%s %p\n' 2>/dev/null | sort -nr | head`
- 최근 24시간 수정 파일: `find /etc /var -type f -mtime -1 -printf '%TY-%Tm-%Td %TH:%TM %p\n' | sort -r | head -n 50`
- 패키지 소유 파일 역조회:
  - RPM: `rpm -qf /path/to/file` / `repoquery -f /path/*`
  - DEB: `dpkg -S /path/to/file`
- 무결성 검사(디렉터리): `find dir -type f -print0 | xargs -0 -P $(nproc) sha256sum > SHA256SUMS && sha256sum -c SHA256SUMS`
- 네트워크 1분 진단: `set -o pipefail; mtr -rwzc 60 host | tee mtr.txt && ss -tuna | rg ESTAB | wc -l && curl -sv https://host --max-time 5 -o /dev/null`
- DNS/HTTPS 체인 검증: `dig +dnssec example.com any | sed -n '1,40p' && openssl s_client -connect example.com:443 -servername example.com -alpn h2 -brief < /dev/null`

## 방어적 사용 팁
- `sed -i.bak`로 원본 백업, 정규식은 `-E`(BSD) / `-r`(GNU) 차이 확인
- `awk`는 필드 분리기 주의: `awk -F',' '...'` + `-v OFS=","`로 출력 일관성
- `xargs -P` 병렬화 시 서버 부하 한도 설정(동시성/슬립)

## One‑liners 컬렉션
- 상위 오류 원인: `journalctl -b -p err..alert | rg -o "[A-Z_]{3,}|[A-Za-z]+Exception" | sort | uniq -c | sort -nr | head`
- IP/포트 빈도: `ss -tuna | awk 'NR>1{print $5}' | sed 's/.*://g' | sort | uniq -c | sort -nr | head`
- 텍스트 열 피벗: `awk -F, '{a[$2]+=$5} END{for(k in a) printf "%s,%d\n", k, a[k]}' data.csv | sort -t, -k2,2nr | column -s, -t`

## 실행 예시 (샘플 데이터 포함)
- 샘플 파일: `assets/samples/users.csv`, `assets/samples/nginx_access.log`, `assets/samples/app.log`

- CSV 피벗(팀별 합계)
```
awk -F, 'NR>1{a[$3]+=$4} END{for(k in a) printf "%s,%d\n", k, a[k]}' assets/samples/users.csv | sort -t, -k2,2nr
```
예상 출력
```
dev,45
qa,16
ops,12
```

- Nginx 상태 코드 분포
```
awk '{print $9}' assets/samples/nginx_access.log | sort | uniq -c | sort -nr
```
예상 출력
```
  3 200
  1 504
  1 404
  1 302
```

- 오류 로그 요약 상위 3건
```
rg -n "ERROR|timeout|refused" assets/samples/app.log | awk '{print $4}' | sort | uniq -c | sort -nr | head -n 3
```
예상 출력
```
  2 ERROR
  2 timeout
  1 refused
```

## 핵심 명령/도구
- `grep`, `awk`, `sed`, `cut`, `sort`, `xargs`, `tee`, `tr`
- `dnf`, `yum`, `apt`, `rpm`, `dpkg`
- `fsck`, `mount`, `/etc/fstab`, `df`, `du`, `ncdu`
- `ss`, `nmap`, `dig`, `nslookup`, `curl`, `nc`
- `firewalld`, `iptables`/`nftables`, `sha256sum`

## 실무 팁
- `ss -lptn`으로 포트/프로세스 즉시 매핑, `nmap --top-ports`로 표적 스캔
- `curl -v --resolve`로 DNS 무시하고 TLS 테스트, SNI/ALPN 확인

## 체크리스트/퀴즈
- 1GB 이상 디렉터리 TOP5를 한 줄로 출력해보자.

## 외부 참고(가이드)
- EPEL/PPA 설정 가이드, nftables wiki, GNU findutils

## 연계 실습
- `journalctl`→텍스트 처리→요약 리포트 자동 생성
## 필수 레시피 (바로 써먹기)
- tar 백업 제외 포함: `tar --exclude='node_modules' -czf proj.tgz proj/`
- rsync 동기화(진행률): `rsync -avh --delete --progress ./dist/ user@host:/srv/app/`
- curl 가용성 체크: `curl -sfS http://localhost:8080/health || echo "down"`
- dig 기본: `dig +short A example.com` · `dig +short MX example.com`
- nmap 간단 포트 스캔: `nmap --top-ports 100 target`

## 현장 꿀팁 10선
- 파이프라인은 로케일 고정: `LC_ALL=C`로 예측 가능한 정렬/대소문자 처리
- ripgrep은 Git 무시파일 자동 반영: `rg -n "pat"`가 `.gitignore` 존중
- `sort -S 50% --parallel=$(nproc)`로 대용량 정렬 가속
- `xargs -P $(nproc)` 병렬 시 과부하 방지 위해 `sleep` 삽입 고려
- `curl --retry 3 --retry-all-errors --max-time 5`로 네트워크 불안정 대비
- nftables 정책은 `nft list ruleset`로 백업, 파일 관리형으로 운영 권장
- `ss -Htn state estab '( sport = :443 )'`로 잡음 줄인 통계
- `dig +trace`로 권한 체인 문제 파악, `+dnssec`로 서명상태 확인
- `tar -I 'xz -T0'`로 멀티스레드 압축, 또는 `zstd -T0` 권장
- rsync는 `--partial --inplace`로 대용량 중단 복구, 단 백업 전용 스토리지에서 사용
