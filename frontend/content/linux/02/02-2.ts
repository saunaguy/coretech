export default [
  { type: 'heading', text: '2-2 설치 방법 (ISO, USB, 네트워크 설치)' },
  { type: 'paragraph', text: '리눅스 설치는 ISO 이미지를 내려받아 부팅 가능한 USB를 만들고, BIOS/UEFI에서 USB로 부팅하여 진행합니다. 기본 흐름과 디스크 파티셔닝/LVM 개념을 함께 정리합니다.' },
  { type: 'heading', text: '설치 방식 비교(무엇을 쓸까?)' },
  { type: 'list', items: [
    '가상머신(VM): 가장 안전, 스냅샷/롤백 가능 → 학습 기본값',
    '실컴(Bare-metal): 성능 최상, 듀얼부트/단독 설치 시 백업 필수',
    'WSL(Windows): 개발/터미널 위주, 커널/네트워킹 제약 고려',
    '클라우드(EC2 등): 원격 서버 학습에 유용, 과금/보안 주의',
  ]},

  { type: 'heading', text: 'ISO 이미지란?' },
  { type: 'list', items: [
    '광학 디스크(설치 미디어)의 전체 내용을 단일 파일로 묶은 형식.',
    '배포판 공식 사이트에서 아키텍처(x86_64/ARM)와 에디션(Server/Desktop)을 선택해 다운로드.',
    '무결성 검증: 제공되는 SHA256 해시로 다운로드 파일을 검증 권장.',
  ]},

  { type: 'heading', text: '부팅 가능한 USB 만들기(Windows: Rufus)' },
  { type: 'list', items: [
    'Rufus 실행 → 디바이스(USB) 선택 → 부트 선택에서 ISO 파일 지정.',
    '파티션 방식/대상 시스템: UEFI 시스템은 GPT, 레거시 BIOS는 MBR 권장.',
    '파일 시스템: FAT32(호환성 높음) 또는 NTFS(대용량 ISO 시).',
    '시작(START) 클릭 → 완료 후 USB로 부팅.',
  ]},
  { type: 'heading', text: '대안: balenaEtcher(Win/macOS/Linux)' },
  { type: 'list', items: [
    'Etcher 실행 → Flash from file(ISO) → Target(USB) → Flash',
    '간단한 UI로 실수 방지, 멀티 플랫폼 지원',
  ]},

  { type: 'heading', text: 'BIOS/UEFI 설정 팁' },
  { type: 'list', items: [
    '부팅 순서에서 USB를 1순위로 설정.',
    'Secure Boot가 설치를 방해하면 임시 비활성화.',
    'Fast Boot 해제 시 부팅 디바이스 인식 문제를 줄일 수 있음.',
  ]},

  { type: 'heading', text: '설치 마법사 공통 흐름' },
  { type: 'list', items: [
    '언어/키보드/시간대 설정 → 네트워크 설정(필요 시).',
    '디스크 파티셔닝: 자동 또는 수동(커스텀) 선택.',
    '사용자 생성/비밀번호/호스트명 설정.',
    '패키지/업데이트 선택 → 설치 진행 → 재부팅.',
  ]},

  { type: 'heading', text: '디스크 파티셔닝 기초' },
  { type: 'list', items: [
    '파티션 종류: 기본(Primary), 확장(Extended), 논리(Logical).',
    '마운트 포인트: `/`(루트), `/home`(사용자 데이터), `swap`(스왑).',
    '파일시스템: EXT4(범용), XFS(RHEL 계열 기본), Btrfs(스냅샷 등 고급 기능).',
    '권장 예시(데스크톱): `/` 30G+, `/home` 여유분, `swap` 2~4G(또는 RAM에 비례).',
  ]},

  { type: 'heading', text: 'LVM(Logical Volume Manager) 개요' },
  { type: 'list', items: [
    'PV(물리 볼륨) → VG(볼륨 그룹) → LV(논리 볼륨) 구조.',
    '장점: 온라인 크기 조정, 여러 디스크를 하나로 묶어 유연한 공간 관리.',
    '일반 흐름: `pvcreate` → `vgcreate` → `lvcreate` → 파일시스템 생성/마운트.',
  ]},

  { type: 'aside', text: '실무/학습 모두 LVM을 권장합니다. 공간이 부족할 때 LV 확장으로 대응이 쉬워집니다. 다만 파티션/볼륨 변경 전에는 항상 백업을 고려하세요.' },

  { type: 'heading', text: '네트워크 설치(선택)' },
  { type: 'list', items: [
    'Netinstall/Minimal ISO로 네트워크를 통해 필요한 패키지 만 다운로드하여 설치.',
    '장점: 최신 패키지 기반 설치, 용량 절약. 단점: 설치 중 네트워크 품질에 영향.',
  ]},

  { type: 'aside', text: '가상 머신에 설치한다면 스냅샷을 적절히 활용하세요. 설치 직후 스냅샷을 생성해두면 되돌리기가 쉬워집니다.' },
  { type: 'heading', text: '첫 부팅 체크리스트(요약)' },
  { type: 'list', items: [
    '사용자/비밀번호/호스트명 확인',
    '네트워크 연결 확인: ip addr, ping',
    '업데이트: apt update && apt upgrade / dnf update',
    'SSH 서버 설치/활성화: openssh-server, 방화벽 규칙 확인',
  ]},
]
