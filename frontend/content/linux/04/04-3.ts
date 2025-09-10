export default [
  { type: 'heading', text: '4-3 방화벽/보안 접속' },
  { type: 'paragraph', text: 'iptables/nftables의 테이블/체인 모델과 firewalld를 이해하고, SSH 하드닝과 TLS 기본을 정리합니다.' },
  { type: 'list', items: [
    'iptables/nftables: 테이블/체인 구조, 정책/규칙',
    'firewalld: 존/서비스, 리치 규칙',
    'SSH 하드닝: 키 인증/포트포워딩/프록시점프, fail2ban',
    'TLS/인증서: 키/CSR/CA, OCSP/ALPN/HSTS',
  ]},
]

