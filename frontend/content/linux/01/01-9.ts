export default [
  { type: 'heading', text: '1-9 VM 네트워크 모드' },
  { type: 'list', items: [
    'NAT: 기본/안전, 포트포워딩으로 외부 진입',
    'Bridged: 동일 네트워크에서 직접 접근',
    'Host-only: 호스트↔게스트 전용 내부망',
  ]},
  { type: 'aside', text: '🔀 흔한 조합: NAT + Host-only' },
]

