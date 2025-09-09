export default [
  { type: 'heading', text: '2-1 리눅스 배포판 비교' },
  { type: 'paragraph', text: '리눅스는 커널을 중심으로 다양한 소프트웨어를 묶어 배포하는 "배포판(Distro)" 형태로 제공됩니다. 대표적으로 데비안(Debian) 계열과 레드햇(Red Hat) 계열이 있으며, 패키지 관리 도구와 운영 철학이 다릅니다.' },

  { type: 'heading', text: '주요 계열과 패키지 관리' },
  { type: 'list', items: [
    'Debian 계열: 안정성과 방대한 저장소가 강점. 패키지 관리: APT/DPKG.',
    'Ubuntu (Debian 기반): 사용자 친화적, 데스크톱/서버 모두 인기. LTS 버전은 5년 지원.',
    'Linux Mint (Ubuntu 기반): Windows와 유사한 UI로 초보자 적합.',
    'Red Hat 계열: 기업 환경 중심, 안정성/지원에 초점. 패키지 관리: DNF/YUM/RPM.',
    'RHEL: 유료 기술지원, 기업 표준 배포판.',
    'Fedora: 최신 기술 선도, 빠른 릴리스 주기(롤링에 가까움).',
    'Rocky Linux / AlmaLinux: RHEL과 1:1 호환을 목표로 하는 무료 서버용 배포판.',
  ]},

  { type: 'heading', text: '어떤 배포판을 선택할까?' },
  { type: 'list', items: [
    '개인/학습용 데스크톱: Ubuntu LTS, Linux Mint 추천.',
    '서버/실무 학습: Rocky Linux, AlmaLinux, Ubuntu Server.',
    '엔터프라이즈 운영: RHEL (공식 지원 필요 시).',
    '최신 기술 테스트/개발: Fedora.',
  ]},

  { type: 'aside', text: 'LTS(Long-Term Support)는 장기 지원 버전으로 안정성과 보안 업데이트가 장기간 제공됩니다. 학습/운영 환경에서는 LTS 사용을 권장합니다.' },

  { type: 'heading', text: '버전 정책과 지원 주기' },
  { type: 'list', items: [
    'Ubuntu: LTS는 보통 2년 주기로 출시, 각 5년 지원.',
    'RHEL: 메이저 버전은 10년까지 장기 지원(구독 필요).',
    'Fedora: 약 6개월 주기 릴리스, 상대적으로 짧은 지원.',
  ]},

  { type: 'heading', text: '패키지 관리자 차이' },
  { type: 'list', items: [
    'Debian/Ubuntu: apt, apt-get, dpkg 사용. 예) `sudo apt update && sudo apt install nginx`',
    'RHEL/Rocky/Alma: dnf(또는 yum), rpm 사용. 예) `sudo dnf install nginx`',
  ]},

  { type: 'aside', text: '동일 소프트웨어라도 배포판에 따라 패키지 이름/버전/설정 경로가 다를 수 있습니다. 공식 문서에서 자신의 배포판을 기준으로 확인하세요.' },

  { type: 'heading', text: '공식 다운로드 경로' },
  { type: 'list', items: [
    'Ubuntu: https://ubuntu.com/download',
    'Linux Mint: https://linuxmint.com/download.php',
    'Rocky Linux: https://rockylinux.org/download',
    'AlmaLinux: https://almalinux.org',
    'RHEL: https://access.redhat.com (개발자 구독 제공)',
    'Fedora: https://getfedora.org',
  ]},
]
