const blocks = [
  { type: 'heading', text: '5-3 메일 실습 (Notion Style)' },
  { type: 'aside', text: '💡 핵심: 메일 경로는 DNS(MX→A/AAAA)로 시작, 발신은 587/25, 수신은 25. 바인딩(127.0.0.1:25 vs 0.0.0.0:25)과 방화벽/라우팅(53,25)이 핵심 체크 포인트. SPF/PTR 미설정은 외부 스팸판정의 주요 원인.' },
  { type: 'divider' },

  { type: 'heading', text: '흐름도 (간단: 내부 두 서버 + DNS)' },
  { type: 'aside', text: '그림: ../../assets/mail_simple.svg' },
  { type: 'list', items: [
    '1) A서버가 DNS에 mail.test.com 질의',
    '2) DNS가 A서버로 IP 응답',
    '3) A서버가 응답받은 IP로 SMTP 25/tcp 전송',
    '4) B서버가 수신 후 로컬 배달(Mailbox/IMAP)'
  ]},

  { type: 'heading', text: '흐름도 (상세: 라우터/NAT/ISP 경유 + 원격 MTA)' },
  { type: 'aside', text: '그림: ../../assets/mail_external.svg' },
  { type: 'list', items: [
    '1) A→(Router/NAT/Internet 경유)→ISP DNS로 질의',
    '2) ISP DNS→(Internet/NAT/Router 경유)→A로 IP 응답',
    '3) A→(Router/NAT/Internet 경유)→Remote MTA로 SMTP 25/tcp 전송',
    '4) Remote MTA 수신/배달'
  ]},

  { type: 'divider' },
  { type: 'heading', text: '현장 Quick-Start (5단계)' },
  { type: 'list', items: [
    '1) 호스트명/도메인: hostnamectl set-hostname mail.test1.com',
    '2) DNS 확인: dig +short MX test1.com / dig +short A mail.test1.com',
    '3) 포트/바인딩: ss -lptn | rg ":(25|587)\\b" (127.0.0.1 vs 0.0.0.0)',
    '4) 방화벽: firewall-cmd --add-service=smtp --permanent && firewall-cmd --reload',
    "5) 로컬 발송: printf 'Subject: test\\n\\nhello\\n' | sendmail -v user@test1.com"
  ]},

  { type: 'divider' },
  { type: 'heading', text: '5분 점검 체크리스트' },
  { type: 'list', items: [
    '[ ] DNS: "dig MX domain.com +short", "dig A mail.domain.com +short"',
    '[ ] 라우팅: "ip route get 8.8.8.8" 또는 "ping mail.domain.com"',
    '[ ] 포트: ss -lptn | rg ":25\\b" (필요 시 :587도)',
    '[ ] 방화벽: firewalld에 25/tcp (및 587/465/110/143/993/995) 허용',
    '[ ] 계정/메일박스: id user, /var/mail/user 또는 Maildir 권한',
    '[ ] 서비스: systemctl status postfix|sendmail|dovecot'
  ]},

  { type: 'divider' },
  { type: 'heading', text: '큐 에러 → 원인 매핑' },
  { type: 'list', items: [
    'Relay access denied → mynetworks/relay_domains 미설정',
    'Host unknown / Name service error → DNS 문제·MX/A 누락·resolv.conf 오류',
    'No route to host → 라우팅/방화벽 drop',
    'Connection refused → IP 도달 ok, 25/tcp 미열림/서비스 다운',
    'User unknown → 계정/메일박스 없음',
    'nslookup loop/recursion → named.conf/존 위임 오류'
  ]},

  { type: 'heading', text: 'DNS 점검 포인트(외부 발신 신뢰)' },
  { type: 'list', items: [
    'MX: 수신 도메인에 MX 레코드 존재, MX가 가리키는 호스트에 A/AAAA 존재',
    'PTR(역방향): 발신 IP → 도메인 역방향 등록 (없으면 스팸 처리 위험)',
    'SPF: 도메인 TXT에 허용 발신 IP/호스트 반영 (v=spf1 ... -all)',
    'DKIM/DMARC: 선택적이지만 외부 신뢰/전달성 향상',
    'resolv.conf: 내부 리졸버 IP 정확, 루프/순환 의존 금지'
  ]},

  { type: 'divider' },
  { type: 'heading', text: '필수 명령 묶음' },
  { type: 'list', items: [
    'DNS: dig +short MX example.com && dig +short A mail.example.com',
    "수신 상태: ss -lptn | rg ':25\\b' || echo 'SMTP not listening'",
    '방화벽: firewall-cmd --add-service=smtp --permanent && firewall-cmd --reload',
    "로컬 발송: printf 'Subject: test\\n\\nhello\\n' | sendmail -v user@domain",
    "로그: journalctl -u postfix -n 200 --no-pager | rg -n '(deferred|reject|relay|timeout)'"
  ]},

  { type: 'heading', text: 'SMTP 수동 진단(핸드셰이크)' },
  { type: 'list', items: [
    'telnet mail.test1.com 25 (또는 nc -vz mail.test1.com 25)',
    'HELO test1.com / EHLO test1.com',
    'MAIL FROM:<you@test1.com>',
    'RCPT TO:<user@test1.com>',
    'DATA → Subject: test → 본문 → . → QUIT',
    '상태코드: 220(서비스 준비), 250(성공), 450/451(임시 오류), 550(영구 오류)'
  ]},

  { type: 'divider' },
  { type: 'heading', text: '트러블슈팅 4가지 (실습 사례, 증상→확인→조치)' },

  { type: 'heading', text: '1) sendmail.cf 갱신 누락(m4 미실행)' },
  { type: 'list', items: [
    '증상: Deferred: Connection refused by mail.test1.com.',
    '확인: ps aux | rg sendmail, ss -lptn | rg :25\\b (127.0.0.1:25 인지 확인)',
    '조치: m4 /etc/mail/sendmail.mc > /etc/mail/sendmail.cf; systemctl restart sendmail; (필요시) inet_interfaces=all 설정 적용'
  ]},

  { type: 'heading', text: '2) DNS 서버 방화벽 차단' },
  { type: 'list', items: [
    '증상: No route to host / DNS 타임아웃',
    '확인: ping dns-ip, dig @dns-ip mail.test1.com MX +timeout=2 +tries=1',
    '조치: firewall-cmd --add-service=dns --permanent; firewall-cmd --add-service=smtp --permanent; firewall-cmd --reload'
  ]},

  { type: 'heading', text: '3) 로컬 계정/메일박스 미생성' },
  { type: 'list', items: [
    '증상: User unknown / 로컬 배달 실패',
    '확인: id test1, ls -l /var/mail/test1 (또는 Maildir 경로), dovecot 로그',
    '조치: useradd test1 && passwd test1; 권한/소유자 수정(chown test1:mail)'
  ]},

  { type: 'heading', text: '4) nslookup 루프/리졸버 설정 오류' },
  { type: 'list', items: [
    '증상: 루프/NXDOMAIN/서버 실패 반복',
    '확인: resolv.conf 네임서버 순서, dig +trace, 반복되는 네임서버 확인',
    '조치: named-checkconf; named-checkzone; systemctl reload named; 포워더/위임 수정'
  ]},

  { type: 'divider' },
  { type: 'heading', text: '큐/로그 빠른 파악' },
  { type: 'list', items: [
    '큐 조회: mailq / postqueue -p (deferred 다수면 네트워크/DNS 원인 의심)',
    '큐 삭제(주의): postsuper -d QUEUE_ID (또는 -d ALL for deferred)',
    '로그 단서: journalctl -u postfix|sendmail -g "(deferred|reject|timeout|relay)"',
    '헤더 검사: 받은 메일 원본 보기(Received: 경로, SPF 결과 확인)'
  ]},

  { type: 'divider' },
  { type: 'heading', text: '포트/서비스 요약' },
  { type: 'list', items: [
    'SMTP 25', 'Submission 587', 'SMTPS 465', 'POP3 110/995', 'IMAP 143/993', 'DNS 53(udp/tcp)'
  ]},

  { type: 'divider' },
  { type: 'heading', text: 'Postfix main.cf 스니펫(예시)' },
  { type: 'list', items: [
    'myhostname = mail.test1.com',
    'mydomain = test1.com',
    'myorigin = $mydomain',
    'inet_interfaces = all',
    'mynetworks = 127.0.0.0/8, 192.168.0.0/24',
    'relay_domains = $mydestination',
    '# 외부 발신 신뢰 향상: SPF/PTR 설정(메일 시스템 밖 DNS 작업)'
  ]},
]

export default blocks as any
