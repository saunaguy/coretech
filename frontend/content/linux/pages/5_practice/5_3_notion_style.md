# 5-3 메일 실습 (Notion Style)

> 💡 핵심 개념
> - 메일 경로는 DNS(MX→A/AAAA)로 시작한다.
> - 발신은 submission(587) 또는 SMTP(25), 수신은 SMTP(25)로 들어온다.
> - `127.0.0.1:25`는 로컬 전용, `0.0.0.0:25`는 외부 수신 가능 여부를 의미한다.
> - 실패의 다수는 방화벽/라우팅(53/udp,tcp, 25/tcp)에서 발생한다.

## 🖼️ 흐름도

### 그림 1: 내부 두 서버 + DNS (간단)
![Simple Mail Flow](../../assets/mail_simple.svg)
- 1: A → DNS 질의(mail.test.com)
- 2: DNS → A IP 응답
- 3: A → B SMTP 25/tcp 전송
- 4: B 수신 → Mailbox/IMAP

### 그림 2: 외부 경유(라우터/NAT/ISP) + 원격 MTA (상세)
![External Mail Flow](../../assets/mail_external.svg)
- 1: A → ISP DNS 질의 (Router/NAT/Internet 경유)
- 2: DNS → A IP 응답
- 3: A → Remote MTA SMTP 25/tcp (경유)
- 4: Remote MTA 수신 → 배달

## ✅ 5분 점검 체크리스트
- [ ] DNS: `dig MX domain.com +short`, `dig A mail.domain.com +short`
- [ ] 라우팅: `ip route get 8.8.8.8` / `ping mail.domain.com`
- [ ] 포트: `ss -lptn | rg ':25\b'` (필요 시 `:587`도)
- [ ] 방화벽: `firewall-cmd --list-ports`에 `25/tcp` (및 587/465/110/143/993/995)
- [ ] 계정/메일박스: `id user`, `/var/mail/user`/Maildir 권한
- [ ] 서비스: `systemctl status postfix|sendmail|dovecot`

## 🧭 큐 에러 → 원인 매핑
| 에러 | 의미 | 주 원인 |
|---|---|---|
| Relay access denied | 릴레이 거부 | `mynetworks`, `relay_domains` 미설정 |
| Host unknown / Name service error | 호스트 해석 불가 | DNS 문제, MX/A 누락, `resolv.conf` 오류 |
| No route to host | 경로 없음 | 라우팅/방화벽 drop, 게이트웨이 문제 |
| Connection refused | 포트 거부 | 대상 서버 도달은 가능, `25` 미열림/서비스 다운 |
| User unknown | 계정 없음 | 사용자/메일박스 미생성 또는 권한 오류 |
| nslookup loop/recursion | DNS 루프 | `named.conf`/존 위임 오류 |

## 🛠️ 필수 명령 묶음
```bash
# DNS 확인
dig +short MX example.com && dig +short A mail.example.com

# 수신 상태
ss -lptn | rg ':25\b' || echo 'SMTP not listening'

# 방화벽 열기(예)
sudo firewall-cmd --add-service=smtp --permanent && sudo firewall-cmd --reload

# 로컬 발송 테스트
printf 'Subject: test\n\nhello\n' | sendmail -v user@domain

# 로그 추적
journalctl -u postfix -n 200 --no-pager | rg -n '(deferred|reject|relay|timeout)'
```

## 🧩 트러블슈팅 4가지 (실습 사례)

### 1) sendmail.cf 갱신 누락(m4 미실행)
- 증상: `Deferred: Connection refused by mail.test1.com.`
- 원인: `sendmail.mc` 변경 후 `m4`로 `sendmail.cf` 재생성/재시작 누락
- 조치:
```bash
m4 /etc/mail/sendmail.mc > /etc/mail/sendmail.cf
systemctl restart sendmail
ss -lptn | rg ':25\b'   # 0.0.0.0:25 리스닝 확인
```

### 2) DNS 서버 방화벽(firewalld) 차단
- 증상: `No route to host` 또는 DNS 질의 타임아웃
- 원인: DNS(53/udp,tcp) 또는 SMTP(25/tcp) 차단
- 조치:
```bash
firewall-cmd --add-service=dns --permanent
firewall-cmd --add-service=smtp --permanent
firewall-cmd --reload
dig @<dns-ip> mail.test1.com MX +short
```

### 3) 로컬 계정/메일박스 미생성
- 증상: `User unknown` 또는 로컬 배달 실패
- 조치:
```bash
useradd test1 && passwd test1
# mbox 사용 시
ls -l /var/mail/test1
# Maildir 사용 시 초기화/권한 확인
```

### 4) nslookup 루프/리졸버 설정 오류
- 증상: 루프/NXDOMAIN/서버 실패 반복
- 조치:
```bash
named-checkconf
named-checkzone zone.name /var/named/zone.name
# 포워더/존 위임 수정 후
systemctl reload named
dig @local-dns mail.test1.com MX +trace
```

## 🔌 포트/서비스 요약
| 서비스 | 프로토콜 | 포트 |
|---|---|---|
| SMTP(전송) | TCP | 25 |
| Submission | TCP | 587 |
| SMTPS | TCP | 465 |
| POP3/POP3s | TCP | 110/995 |
| IMAP/IMAPs | TCP | 143/993 |
| DNS | UDP/TCP | 53 |

## 📄 설정 스니펫(예시: Postfix main.cf)
```ini
myhostname = mail.test1.com
mydomain = test1.com
myorigin = $mydomain
inet_interfaces = all
mynetworks = 127.0.0.0/8, 192.168.0.0/24
relay_domains = $mydestination
```
