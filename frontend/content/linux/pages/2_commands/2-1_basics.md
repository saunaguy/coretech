---
title: 기본 명령어
slug: 2-1_basics
section: 2. 리눅스 명령어
duration: 60m
prereqs: [1-2_install_virtualization]
---

## 학습 목표
- 파일/디렉토리/탐색 명령의 목적과 차이를 설명한다.
- 리다이렉션/파이프/명령 치환을 활용해 작업을 자동화한다.
- `vim` 또는 `nano`로 빠른 편집이 가능하다.

![Streams & Pipes](../../assets/streams_pipes.svg)

## 핵심 개념
- 글로빙/와일드카드, 히스토리, `alias`
- `stdin`/`stdout`/`stderr`, `>`/`>>`/`2>`/`|`
- 서브쉘, `$()` 명령 치환

## 명령어 조합 레시피
- 안전 삭제: `find . -type f -name "*.log" -mtime +14 -print0 | xargs -0 -r rm -v` (미리 `-print`로 검증)
- 로그 팔로우 + 키워드: `journalctl -f -u mysvc | rg -i "(error|fail|timeout)"`
- 상위 N 큰 파일: `du -x -h --max-depth=1 | sort -h | tail -n 10`
- 최근 변경 TOP: `find . -type f -printf '%T@ %p\n' | sort -nr | head -n 20 | cut -d' ' -f2-`
- 라인/단어/문자수: `wc -lwm file.txt` (or `rg -n "^" | wc -l` for 속도)
- 중복 라인 카운트: `sort file | uniq -c | sort -nr | head`
- CSV 컬럼 추출: `cut -d, -f2,5 file.csv | sed 's/ //g'`
- 병렬 처리: `printf '%s\n' *.jpg | xargs -P $(nproc) -I{} convert {} -resize 50% out/{}`

## 방어적 사용 팁
- `rm -I` 또는 `alias rm='rm -i'`로 대량 삭제 방지
- `set -o pipefail`(bash)로 파이프라인 오류 전파, `set -euo pipefail`로 스크립트 방어
- 공백/특수문자 안전: `-print0 | xargs -0`, `IFS=$'\n'` 사용
- 로케일 영향 최소화: 정렬은 `LC_ALL=C sort`로 바이트 정렬 가속

## 성능/확장 포인트
- `rg`(ripgrep)으로 대규모 코드 검색: `rg -n "pattern" src/ --glob '!node_modules'`
- `sed -n '1,200p'`처럼 범위 출력으로 I/O 절감
- 파이프라인에서 I/O 복제: `tee out.log | command2`

## 유용한 셸 기능
- 히스토리 검색: `Ctrl+R`, 직전 명령 재사용 `!!`, 직전 인자 `!$`
- 브레이스 확장: `mkdir -p logs/{app,db,proxy}`
- 프로세스 치환: `diff <(sort a) <(sort b)`

## 실행 예시 (샘플 데이터 포함)
- 샘플 파일: `assets/samples/app.log`

- 오류만 추려서 상위 키워드 빈도 보기
```
rg -n "ERROR|timeout|refused" assets/samples/app.log | awk '{print $4}' | sort | uniq -c | sort -nr
```
예상 출력
```
  2 ERROR
  2 timeout
  1 refused
```

- 최근 3줄 팔로우 느낌(정적 예시)
```
tail -n 3 assets/samples/app.log
```
예상 출력
```
2025-09-10T09:03:42Z INFO  api: request method=GET path=/health status=200
2025-09-10T09:04:01Z ERROR api: timeout on /v1/items duration=5s
2025-09-10T09:04:03Z INFO  shutdown: signal=TERM
```

- CSV 컬럼 추출/정리
```
cut -d, -f2,3 assets/samples/users.csv | sed '1d;s/ //g'
```
예상 출력
```
Alice,dev
Bob,dev
Carol,qa
Dan,dev
Eve,qa
Frank,ops
```

## 전문가 포인트
- GNU coreutils와 bash built‑in 구분(예: `echo` vs `/bin/echo`)
- 파이프라인에서 `set -o pipefail`의 오류 전파 의미
- xargs 병렬화: `xargs -P`와 안전한 null‑delimited(`-0`) 사용
- 로케일/정렬 차이: `LC_ALL=C sort`로 바이트 정렬 가속

## 핵심 명령/도구
- `ls`, `cp`, `mv`, `rm`, `mkdir`, `pwd`, `cd`
- `cat`, `less`, `head`, `tail`, `man`, `help`
- `vim`, `nano`

## 실무 팁
- 안전한 삭제: `rm -i`/`-I`와 `--preserve-root`
- 대용량 tail: `tail -F` vs `-f`, 로테이션 대응

## 체크리스트/퀴즈
- 한 줄 파이프로 로그에서 오류 상위 5개 출력하기

## 외부 참고(가이드)
- GNU coreutils 매뉴얼, TLDP 초급 가이드

## 연계 실습
- 파이프/리다이렉션만으로 간단 리포트 생성
## 필수 레시피 (바로 써먹기)
- 빠른 검색: `rg -n "keyword" .` (숨김 제외, 매우 빠름)
- 다중 이동/이름변경: `mv report{,_old}.txt` → `report.txt`가 `report_old.txt`로 변경
- 압축/해제(폴더): `tar -czf backup.tgz dir/` · `tar -xzf backup.tgz`
- 크기 요약: `du -sh ./* | sort -h` (상대적으로 큰 순)
- 변경시간 기준 찾기: `find . -type f -mtime -1 -print` (24시간 이내)

## 현장 꿀팁 10선
- `--`로 옵션 종료: `rm -- -weird` 처럼 하이픈으로 시작하는 이름 안전 처리
- 공백/특수문자 안전: `printf '%s\n' "${files[@]}" | xargs -0`와 `-print0`
- `less -S`로 긴 줄 가로 스크롤, `-R`로 ANSI 색 보존
- `grep -RIn --color=auto PATTERN .` 대신 `rg` 사용해 속도/편의↑
- `history -a`로 세션 종료 전 히스토리 즉시 저장, `Ctrl+R`로 탐색
- `set -euo pipefail` 스크립트 상단에 두고 예외는 `|| true`로 예외 처리
- 글로빙 확장 켜기: `shopt -s globstar` → `**/*.log` 재귀 매칭
- `nohup cmd >/var/log/cmd.log 2>&1 & disown`으로 세션 분리 실행
- `time`으로 체감 아닌 실제 실행시간 측정(실/사용자/커널)
- `fc`로 직전 명령 에디터에서 수정 후 재실행
