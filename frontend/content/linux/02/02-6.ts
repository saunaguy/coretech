export default [
  { type: 'heading', text: '2-6 원격 접속과 CLI 기초 (PuTTY/SSH)' },
  { type: 'paragraph', text: '리눅스 서버/가상머신에 접속하는 표준 방법은 SSH입니다. Windows에서는 PuTTY, macOS/Linux에서는 기본 SSH 클라이언트를 사용합니다.' },

  { type: 'heading', text: 'SSH 기본' },
  { type: 'list', items: [
    '프로토콜/포트: SSH(기본 22/tcp). 서버 측 `openssh-server` 필요.',
    '기본 접속: `ssh 사용자명@호스트` (예: `ssh ubuntu@192.168.0.50`).',
    '키 기반 인증: `ssh -i ~/.ssh/id_rsa 사용자명@호스트`.',
    '서버 지문 확인: 최초 접속 시 호스트 키 지문을 확인하고 신뢰 여부 저장(`~/.ssh/known_hosts`).',
  ]},

  { type: 'heading', text: 'PuTTY 사용(Windows)' },
  { type: 'list', items: [
    '설치: PuTTY 다운로드/설치(PuTTYgen 포함).',
    '새 세션: Host Name(IP), Port(22), Connection type=SSH → Open.',
    '지문 경고: 서버 호스트 키 지문을 확인 후 Accept.',
    '로그인: 사용자명/비밀번호 입력. 키 인증은 PuTTYgen으로 `.ppk` 생성 후 Connection → SSH → Auth에서 키 지정.',
    '세션 저장: Session → Saved Sessions에 이름 입력 → Save(재사용).',
  ]},

  { type: 'heading', text: '터미널과 프롬프트 이해' },
  { type: 'list', items: [
    '쉘: 명령을 해석/실행하는 프로그램(Bash 등).',
    '프롬프트 예: `user@host:~/project$` (일반 사용자 `$`), `#`(root).',
    '현재 디렉터리: `pwd`, 이동: `cd`, 목록: `ls -al`.',
  ]},

  { type: 'heading', text: '기본 명령 빠른 모음' },
  { type: 'list', items: [
    '`cat/less/head/tail`: 파일 내용 확인.',
    '`cp/mv/rm/mkdir/touch`: 파일/디렉터리 조작.',
    '`man <명령>` / `<명령> --help`: 도움말.',
    '`sudo <명령>`: 관리자 권한으로 실행(권장). 직접 root 로그인은 지양.',
  ]},

  { type: 'heading', text: '보안/운영 팁' },
  { type: 'list', items: [
    '비밀번호 대신 키 인증 사용 권장, `PasswordAuthentication no` 고려.',
    '방화벽에서 22/tcp 허용, 필요 시 포트 변경.',
    '키 파일 권한: `chmod 600 ~/.ssh/id_rsa`.',
    '파일 전송: `scp`, `rsync -e ssh` 활용.',
  ]},

  { type: 'aside', text: 'Windows 10 이상은 OpenSSH 클라이언트를 기본 제공(선택 기능). PowerShell에서 바로 `ssh user@host`를 사용할 수 있습니다.' },
  { type: 'divider' },
  { type: 'heading', text: 'SSH 하드닝 스니펫(/etc/ssh/sshd_config 일부)' },
  { type: 'code', text: 'Port 22\nPubkeyAuthentication yes\nPasswordAuthentication no\nPermitRootLogin prohibit-password\nClientAliveInterval 60\nClientAliveCountMax 3' },
  { type: 'paragraph', text: '설정 변경 후 `sudo systemctl reload sshd`(배포판에 따라 서비스명이 ssh/sshd 상이)로 적용하세요.' },
  { type: 'heading', text: '첫 부팅 체크리스트' },
  { type: 'list', items: [
    '계정/비밀번호/호스트명 설정 확인',
    '네트워크 연결 확인: ip addr, ping',
    '업데이트 수행: apt update && apt upgrade / dnf update',
    'SSH 서버 설치/활성화 및 방화벽 규칙 확인',
  ]},
]
