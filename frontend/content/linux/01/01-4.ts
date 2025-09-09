const blocks = [
  { type: 'aside', text: "📚 리눅스는 '커널' 그 자체이고, 여기에 다양한 소프트웨어를 조합하여 사용자가 쉽게 설치하고 사용할 수 있도록 만든 것이 바로 '배포판(Distribution)'입니다." },
  { type: 'heading', text: '주요 리눅스 배포판 계열' },
  { type: 'list', items: [
    'Debian 계열 (데비안): 안정성과 패키지 관리 시스템(APT)의 우수성으로 유명. 데스크톱과 서버 모두에서 인기가 많음.',
    'Ubuntu (우분투): 데비안 기반, 사용자 친화적이며 커뮤니티가 매우 활발.',
    'Red Hat 계열 (레드햇): 기업 환경에서 널리 쓰이는 상용 리눅스. 강력한 기술 지원과 안정성이 특징.',
    'CentOS / Rocky Linux: RHEL과 거의 동일한 무료 대안. 서버 관리자들이 선호.',
    'Fedora (페도라): 최신 기술을 가장 먼저 시험하는 테스트베드 역할.',
  ]},
  { type: 'heading', text: '왜 리눅스인가?' },
  { type: 'list', items: [
    '무료/오픈소스: 비용 부담 없이 커스터마이징 가능',
    '튼튼함/안정성: 서버·클라우드에서 널리 사용',
    '자동화 친화: 스크립팅/도구 생태계가 풍부',
    '컨테이너 친화: Docker/Kubernetes 기반 환경과 궁합 우수',
  ]},
  { type: 'heading', text: '어떤 배포판을 선택해야 할까?' },
  { type: 'list', items: [
    '입문자라면: 가장 큰 사용자 커뮤니티와 풍부한 자료를 가진 Ubuntu 추천.',
    '서버 환경이라면: RHEL 계열(CentOS, Rocky) 또는 Debian/Ubuntu Server가 주로 사용됨.',
  ]},
]

export default blocks as any

