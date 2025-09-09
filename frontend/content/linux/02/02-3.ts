export default [
  { type: 'heading', text: '2-3 가상화 개념 (하이퍼바이저, VM vs Container)' },
  { type: 'paragraph', text: '가상화는 하드웨어를, 컨테이너는 운영체제를 가상화합니다. 요구사항에 따라 둘을 적절히 선택하거나 혼용합니다.' },

  { type: 'heading', text: '하이퍼바이저(Hypervisor)' },
  { type: 'list', items: [
    'Type-1 (Bare-metal): 서버 하드웨어 위에 직접 설치 (예: VMware ESXi). 높은 성능/안정성.',
    'Type-2 (Hosted): 기존 OS 위에서 동작 (예: VirtualBox, VMware Workstation). 개발/테스트에 적합.',
  ]},

  { type: 'heading', text: '가상 머신(VM)의 특징' },
  { type: 'list', items: [
    '각 VM은 독립적인 게스트 OS를 포함 → 강한 격리/보안.',
    '서버/데스크톱 등 서로 다른 OS 동시 운영 가능.',
    '단점: 부팅이 느리고(수십 초~분), 이미지가 큼(GB 단위).',
  ]},

  { type: 'heading', text: '컨테이너(Container)의 특징' },
  { type: 'list', items: [
    '호스트 커널을 공유하는 OS 수준 가상화 → 매우 가볍고 빠름(MB, 수 초).',
    '애플리케이션과 의존성만 패키징 → 이식성/재현성 우수.',
    '단점: 커널 공유로 VM 대비 격리 수준이 낮고, 커널 기능 제약을 받음.',
  ]},

  { type: 'heading', text: '언제 무엇을 쓸까?' },
  { type: 'list', items: [
    '서로 다른 OS 필요, 강한 격리/보안 → VM 권장.',
    '마이크로서비스, 빠른 배포/스케일 → 컨테이너 권장.',
    '교육/실습: 둘 다 유용하나, 시스템 전반 학습에는 VM이 직관적.',
  ]},

  { type: 'aside', text: '컨테이너는 cgroups/namespaces로 리소스와 네임스페이스를 격리합니다. 시스템 서비스(systemd) 학습 등 OS 전반을 다루려면 VM이 더 자연스럽습니다.' },
]
