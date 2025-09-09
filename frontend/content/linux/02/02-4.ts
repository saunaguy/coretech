export default [
  { type: 'heading', text: '2-4 VirtualBox/VMware 설치 및 기본 설정' },
  { type: 'paragraph', text: '개발/학습 환경에서는 Type-2 하이퍼바이저(호스트 OS 위에서 동작)인 VirtualBox/VMware Workstation(Player)을 주로 사용합니다.' },

  { type: 'heading', text: '사전 확인' },
  { type: 'list', items: [
    'BIOS/UEFI에서 가상화(VT-x/AMD-V) 활성화.',
    'Windows의 경우 Hyper-V가 활성화되어 있으면 다른 하이퍼바이저와 충돌할 수 있음.',
  ]},

  { type: 'heading', text: 'VirtualBox 기본 절차' },
  { type: 'list', items: [
    '새로 만들기 → 이름/종류/버전 설정(Ubuntu/64-bit 등).',
    '메모리 크기: 2~4GB 이상 권장(호스트 여유 고려).',
    '프로세서: 2 vCPU 이상(호스트 코어 대비 과도 할당 주의).',
    '가상 하드디스크: VDI, 동적 할당, 30GB+ 권장.',
    '저장소: 컨트롤러에 ISO 마운트(설치 미디어).',
    '시스템: EFI 사용 여부, 부트 순서(Optical → HDD) 확인.',
    '디스플레이: 비디오 메모리 32MB+, 3D 가속(필요 시).',
    '네트워크: 어댑터 1 = NAT(기본). 필요시 어댑터 2 = Host-only 추가.',
    '공유 클립보드/드래그앤드롭: 편의 기능 활성화(게스트 확장 설치 후).',
  ]},

  { type: 'heading', text: 'VMware Workstation/Player 기본 절차' },
  { type: 'list', items: [
    'Create a New Virtual Machine → ISO 선택(또는 나중에 설치).',
    '게스트 OS 유형/버전 선택 → 이름/저장 경로 지정.',
    '디스크: NVMe/SCSI, 30GB+ (단일 파일 또는 분할).',
    '메모리/CPU: 워크로드에 맞게 조정(2 vCPU / 4GB+ 권장).',
    '펌웨어: UEFI(필요 시 Secure Boot 비활성화).',
    '설치 후 VMware Tools 설치(디스플레이/마우스/네트워크 개선).',
  ]},

  { type: 'heading', text: '권장 리소스 가이드(개발/학습)' },
  { type: 'list', items: [
    'vCPU: 2~4, RAM: 4~8GB, 디스크: 30~60GB.',
    '네트워크: 기본 NAT, 필요 시 Bridged/Host-only 병행.',
  ]},

  { type: 'aside', text: '스냅샷을 전략적으로 활용하세요. 설치 직후/핵심 설정 후 스냅샷을 남겨두면 실습 실패 시 빠른 복구가 가능합니다.' },
]
