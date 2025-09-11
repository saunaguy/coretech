const blocks = [
  { type: 'heading', text: '리눅스 실습 2 · DNS 실습' },
  { type: 'aside', text: '💡 MX→A/AAAA, PTR, SPF/DKIM/DMARC의 역할을 손으로 확인합니다.' },

  { type: 'divider' },
  { type: 'heading', text: '핵심 점검' },
  { type: 'list', items: [
    'MX: dig MX example.com +short',
    'A/AAAA: dig A/AAAA mail.example.com +short',
    'PTR: dig -x <outbound-ip> +short',
    'SPF: dig TXT example.com +short (v=spf1 ... -all)'
  ]},

  { type: 'heading', text: '실습 과제' },
  { type: 'list', items: [
    '1) 로컬 네임서버에 존 파일 구성(BIND/Unbound 등)',
    '2) MX가 가리키는 호스트에 A/AAAA 추가',
    '3) SPF TXT 레코드 추가 후 외부 검증',
    '4) PTR은 ISP/호스팅에 요청 또는 대체 방안 수립'
  ]},

  { type: 'heading', text: '진단/트러블슈팅' },
  { type: 'list', items: [
    'dig +trace 로 권한 체인 확인',
    'resolv.conf 순서/루프 확인',
    'firewalld: 53/udp,tcp 허용',
    'named-checkconf / named-checkzone 로 구문 검증'
  ]},
]

export default blocks as any
