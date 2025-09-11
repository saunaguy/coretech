const blocks = [
  { type: 'heading', text: '1-6 설치 방법 (ISO/USB/네트워크)' },
  { type: 'list', items: [
    'ISO 무결성 확인: SHA256 해시 검증',
    '부팅 USB 만들기: Rufus/balenaEtcher',
    'BIOS/UEFI 설정: 부트 순서, Secure Boot',
    '설치 마법사 흐름: 언어→디스크→사용자→설치',
  ]},
  { type: 'aside', text: '💡 LVM으로 설치하면 추후 확장이 수월합니다.' },
]

export default blocks as any
