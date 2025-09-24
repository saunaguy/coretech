---
title: 5-3 메일 실습 레퍼런스
slug: 5-3_mail_reference
section: 5. 복합 실습
duration: 60-90m
prereqs: [4-2_dns_dhcp, 4-3_firewall_secure_access]
---

## 핵심 개념 (DNS/로컬 메일)
- DNS는 메일의 길잡이: 수신 도메인의 MX를 조회하고, 해당 호스트의 A(또는 AAAA)로 최종 접속한다.
- 로컬 발신/수신 구분: 발신은 submission(587) 또는 SMTP(25)로 아웃바운드, 수신은 SMTP(25)로 인바운드.
- 바인딩 확인이 핵심: `127.0.0.1:25`는 로컬 전용, `0.0.0.0:25`는 외부 수신 가능.
- 로컬 배달 경로: MTA(Postfix/Sendmail) → LDA/IMAP(예: Dovecot) → 사용자의 Mailbox/Maildir.
- 방화벽/라우팅이 실패의 70%: 53(UDP/TCP)과 25/TCP가 막히면 DNS 또는 SMTP가 막힌다.

## 목표
- 위 개념을 바탕으로 DNS/MX와 포트/방화벽/바인딩을 우선 점검한다.
- 큐 메시지/로그에서 에러 유형을 분류해 즉시 조치한다.

## 그림 1: 내부 두 서버 + DNS (간단)
번호 순서를 따라가며 흐름을 확인하세요.
![Simple Mail Flow](../../assets/mail_simple.svg)

## 그림 2: 외부 경유(라우터/NAT/ISP) + 원격 MTA (상세)
라우터/NAT/인터넷을 통한 왕복 DNS와 SMTP 경로를 단계로 표기했습니다.
![External Mail Flow](../../assets/mail_external.svg)

## 빠른 체크리스트 (5분 점검)
- DNS: `dig MX domain.com +short` → 대상 MTA 호스트명, `dig A mail.domain.com +short`
- 라우팅: `ip route get 8.8.8.8` / `ping mail.domain.com`
- 포트: `ss -lptn | rg ':25\b'` 수신 대기, `:587`(submission) 필요 시 함께
- 방화벽: `firewall-cmd --list-ports`에 `25/tcp`(및 587/465/110/143/993/995) 허용
- 계정/메일박스: `id user`, `/var/mail/user` 또는 Maildir 존재/권한
- 서비스: `systemctl status postfix|sendmail|dovecot` (배포판에 따라 택일)

## 큐에서 자주 보는 에러와 원인 후보
- Relay access denied → 릴레이 허용 범위 미설정(mynetworks, relay_domains)
- Host unknown / Name service error → DNS 문제, MX/A 누락, `resolv.conf` 오류
- No route to host → 네트워크 경로/방화벽 문제
- Connection refused → IP 도달은 가능, 대상 포트(25) 미열림/서비스 다운
- User unknown → 로컬 계정/메일박스 미생성
- nslookup loop/recursion → named.conf/위임 오류

## 필수 명령 묶음
- DNS 확인: `dig +short MX example.com && dig +short A mail.example.com`
- 수신 상태: `ss -lptn | rg ':25\b' || echo 'SMTP not listening'`
- 방화벽: `sudo firewall-cmd --add-service=smtp --permanent && sudo firewall-cmd --reload`
- 로컬 발송 테스트: `printf 'Subject: test\n\nhello\n' | sendmail -v user@domain`
- 로그 추적: `journalctl -u postfix -n 200 --no-pager | rg -n '(deferred|reject|relay|timeout)'`

## 트러블슈팅 4가지 (실습 사례 정리)
1) sendmail.cf 갱신 누락(m4 미실행)
- 증상: 큐 로그에 `Deferred: Connection refused by mail.test1.com.`
- 원인: `sendmail.mc` 변경 후 `m4`로 `sendmail.cf` 재생성/재시작 누락
- 조치: `m4 /etc/mail/sendmail.mc > /etc/mail/sendmail.cf && systemctl restart sendmail`
- 검증: `ss -lptn | rg ':25\b'` 가 `0.0.0.0:25`로 리스닝, 테스트 메일 전송 OK

2) DNS 서버 방화벽(firewalld) 차단
- 증상: `No route to host` 또는 DNS 질의 타임아웃
- 원인: DNS(53/udp,tcp) 또는 SMTP(25/tcp)가 방화벽에서 차단
- 조치: `firewall-cmd --add-service=dns --permanent && firewall-cmd --add-service=smtp --permanent && firewall-cmd --reload`
- 검증: `dig @dns-ip mail.test1.com MX +short` 응답, `telnet mail.test1.com 25` 응답

3) 로컬 계정/메일박스 미생성
- 증상: `User unknown` 또는 로컬 배달 실패
- 원인: 사용자/그룹/메일박스 부재 또는 권한 오류
- 조치: `useradd test1 && passwd test1` 후 `/var/mail/test1` 권한 확인(또는 Maildir 초기화)
- 검증: 로컬 발송 → `/var/mail/test1` 크기 증가, `dovecot`로 POP3/IMAP 로그인 확인

4) nslookup 루프/리졸버 설정 오류
- 증상: 질의가 루프되거나 NXDOMAIN/서버 실패 반복
- 원인: 잘못된 `named.conf` 포워딩/존 위임, 순환 의존
- 조치: `named-checkconf`, `named-checkzone`로 검증, 포워더와 존 위임 수정
- 검증: `dig @local-dns mail.test1.com MX +trace` 경로 정상, MTA MX/A 조회 성공

## 포트/서비스 요약 (현장용)
- SMTP 25, Submission 587, SMTPS 465
- POP3 110/995, IMAP 143/993
- DNS 53/udp,tcp

## 부록: 설정 스니펫(예시)
- Postfix(`main.cf`) 핵심
```
myhostname = mail.test1.com
mydomain = test1.com
myorigin = $mydomain
inet_interfaces = all
mynetworks = 127.0.0.0/8, 192.168.0.0/24
relay_domains = $mydestination
```

- Dovecot 리스닝 확인: `ss -lptn | rg ':(110|143|993|995)\b'`

## 참고 링크/요약 제거 안내
이 문서는 실습 중심 가독성을 위해 외부 링크/요약을 제거했습니다. 상세한 공식 문서는 필요 시 별도로 찾아보세요.
