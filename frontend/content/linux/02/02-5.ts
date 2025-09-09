export default [
  { type: 'heading', text: '2-5 가상 머신 네트워크 모드 (NAT, Bridged, Host-only)' },
  { type: 'paragraph', text: '가상 머신의 네트워크 모드는 외부 접근성과 보안, 실습 목적에 따라 선택합니다. 기본은 NAT이며, 필요에 따라 Bridged/Host-only를 조합합니다.' },

  { type: 'heading', text: 'NAT (Network Address Translation)' },
  { type: 'list', items: [
    '특징: 게스트가 외부로 나가는 통신은 가능, 외부에서 게스트로 직접 진입은 기본 차단.',
    '장점: 설정 간단, 안전함. 인터넷 접속/업데이트/패키지 설치에 적합.',
    '단점: 호스트/외부에서 게스트로 서비스 접속하려면 포트 포워딩 필요.',
    '활용: 웹/패키지 설치, 일반 개발/학습 기본값.',
  ]},

  { type: 'heading', text: 'Bridged (브리지)' },
  { type: 'list', items: [
    '특징: 게스트가 물리 네트워크에 직접 연결된 것처럼 동작, 공유기에서 독립 IP 부여.',
    '장점: 같은 네트워크의 다른 기기에서 게스트로 직접 접속 가능.',
    '단점: 일부 공용/회사 Wi-Fi에서 차단될 수 있음, 보안 노출 면 고려 필요.',
    '활용: 서버 서비스 테스트, 다중 장비와의 상호 접속 실습.',
  ]},

  { type: 'heading', text: 'Host-only (호스트 전용)' },
  { type: 'list', items: [
    '특징: 호스트 ↔ 게스트만 통신, 외부 인터넷과 단절.',
    '장점: 외부와 격리된 안전한 실습 환경 구성.',
    '단점: 인터넷 미접속. 필요 시 NAT 어댑터를 추가해 병행 사용.',
    '활용: 보안/격리 실습, 내부 전용 테스트 네트워크.',
  ]},

  { type: 'heading', text: '권장 조합' },
  { type: 'list', items: [
    '단일 어댑터: NAT(기본).',
    '이중 어댑터: NAT + Host-only (인터넷 사용 + 호스트 전용 접근).',
    '서버 공개 테스트: Bridged 단독 또는 NAT+포트포워딩.',
  ]},

  { type: 'heading', text: '그림으로 보기: VM 네트워크 모드' },
  { type: 'image', src: '/assets/vm_network_modes.svg', alt: 'VM 네트워크 모드 비교', caption: 'NAT / Bridged / Host-only 한눈에' },

  { type: 'heading', text: 'NAT 포트 포워딩(예: 호스트 8080 → 게스트 80)' },
  { type: 'list', items: [
    'VirtualBox: VM 설정 → 네트워크 → 고급 → 포트 포워딩 → 규칙 추가',
    '예) 이름: web, 프로토콜: TCP, 호스트포트: 8080, 게스트IP: 게스트IP, 게스트포트: 80',
    'VMware(버전별 상이): NAT 어댑터 포트 포워딩 메뉴에서 규칙 추가',
    '확인: 호스트 브라우저에서 http://localhost:8080 접속',
  ]},

  { type: 'heading', text: '문제 해결(트러블슈팅) 팁' },
  { type: 'list', items: [
    '브리지에서 IP가 안 나올 때: 공유기에서 무선 격리(AP isolation)·브리지 금지 설정 확인',
    'Host-only 통신 실패: Host-only 어댑터의 DHCP/서브넷 설정 확인, 게스트에 IP가 있는지 확인',
    'NAT 인터넷 불가: 게스트 라우팅(`ip route`)과 DNS(`/etc/resolv.conf`) 확인',
    'Windows 호스트: Hyper-V/VPN/보안SW가 가상 어댑터를 가로막는지 점검(우선순위/네트워크 프로필)',
  ]},

  { type: 'heading', text: '빠른 점검 명령' },
  { type: 'list', items: [
    '`ip addr` / `ip a`: 인터페이스/IP 확인.',
    '`ip route`: 기본 게이트웨이 확인.',
    '`ping 8.8.8.8`: 외부 연결 확인(Bridged/NAT).',
    '`curl ifconfig.me`: 공인 IP 확인(NAT의 경우 호스트 공인 IP가 표시될 수 있음).',
  ]},

  { type: 'aside', text: 'Windows 호스트에서 Hyper-V, VPN, 보안 소프트웨어가 네트워킹에 간섭할 수 있습니다. 문제가 생기면 가상 어댑터 순서/상태, 방화벽, 브리지 허용 여부를 함께 확인하세요.' },
]
