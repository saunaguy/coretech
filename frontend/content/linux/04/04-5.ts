export default [
  { type: 'heading', text: '4-5 고가용성/고급 토폴로지' },
  { type: 'paragraph', text: 'VLAN/trunk/bonding, 게이트웨이 이중화, PBR/다중 회선, VPN, 컨테이너 네트워킹 등 고급 토폴로지를 정리합니다.' },
  { type: 'list', items: [
    'VLAN/trunk, bonding(team) 설계',
    '게이트웨이 이중화: VRRP/GLBP/HSRP, keepalived',
    '정책 기반 라우팅(PBR), 다중 회선/게이트웨이',
    'VPN: OpenVPN/IPSec, 터널/라우팅 상호작용',
    '컨테이너 네트워킹/네임스페이스, veth/브리지',
  ]},
]

