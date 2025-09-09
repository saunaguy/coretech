const blocks = [
  { type: 'paragraph', text: '운영체제(Operating System, OS)는 사용자가 컴퓨터 하드웨어를 쉽고 효율적으로 사용할 수 있도록 돕는 시스템 소프트웨어입니다. 컴퓨터를 켜면 가장 먼저 우리를 맞이하며, 모든 프로그램은 이 운영체제 위에서 실행됩니다.' },
  { type: 'heading', text: '주요 운영체제의 종류' },
  { type: 'list', items: [
    'Windows: Microsoft사가 개발한 운영체제. PC 시장에서 높은 점유율과 편리한 GUI.',
    'macOS: Apple의 운영체제. 미려한 디자인과 안정성, Unix 기반으로 리눅스와 유사한 부분이 많음.',
    'Linux: 서버, 임베디드, 모바일 등 광범위 분야에서 쓰이는 오픈소스. 안정성과 유연성, 무료가 강점.',
    'Unix: 현대 운영체제 개념의 뿌리. 1960년대 개발, 파일 시스템/프로세스 등 핵심 개념 정립.',
  ]},
  { type: 'divider' },
  { type: 'heading', text: '운영체제의 주요 역할과 기능' },
  { type: 'list', items: [
    '자원 관리 (Resource Management): CPU, 메모리, 저장공간 등 자원을 여러 프로그램이 원활하게 쓰도록 할당/관리.',
    '프로세스 관리: 실행 중인 프로그램을 생성/제거하고, 스케줄링으로 동시 실행처럼 보이게 함.',
    '메모리 관리: 각 프로세스에 필요한 메모리를 할당/회수하고, 영역 보호를 수행.',
    '파일 시스템 관리: 파일/디렉토리 생성, 삭제, 접근을 관리해 데이터 접근을 용이하게 함.',
    '사용자 인터페이스 제공: GUI 또는 CLI로 사용자가 시스템과 상호작용.',
  ]},
  { type: 'heading', text: '운영체제의 핵심 구성요소' },
  { type: 'list', items: [
    '커널 (Kernel): 하드웨어 제어와 자원/프로세스 관리 등 핵심 기능을 담당하는 운영체제의 심장.',
    '인터페이스 (Interface): 사용자의 명령을 커널로 전달하고 결과를 보여줌. 셸(Shell)이 대표적.',
  ]},
  { type: 'heading', text: '운영체제의 종류' },
  { type: 'list', items: [
    '데스크톱 OS: Microsoft Windows, macOS, Linux',
    '모바일 OS: Android, iOS',
    '서버 OS: Linux, UNIX, Windows Server',
  ]},
  { type: 'divider' },
  { type: 'heading', text: '심화 학습: 운영체제 핵심 원리' },
  { type: 'heading', text: '커널(Kernel)의 상세 기능' },
  { type: 'list', items: [
    '프로세스 관리: CPU 시간 배분과 스케줄링으로 동시성 제공',
    '메모리 관리: 메모리 할당/회수, 가상 메모리, 보호',
    '파일 시스템 관리: 파일의 생성/삭제/읽기/쓰기 제공',
    '장치 관리: 키보드, 마우스, 모니터 등 입출력 장치 제어',
  ]},
  { type: 'heading', text: '사용자 모드와 커널 모드, 그리고 시스템 콜' },
  { type: 'paragraph', text: "운영체제는 시스템 보호를 위해 사용자 모드와 커널 모드로 나뉩니다. 파일 읽기, 화면 출력 등 특권 작업이 필요할 때 사용자 프로그램은 '시스템 콜(System Call)'로 커널에 요청하고, 커널 모드에서 안전하게 처리한 뒤 다시 사용자 모드로 복귀합니다." },
  { type: 'heading', text: '시스템 콜의 상세 작동 과정' },
  { type: 'list', items: [
    '1) 사용자 프로그램이 시스템 콜을 호출',
    '2) 트랩(Trap) 발생 → 사용자 모드에서 커널 모드로 전환',
    '3) 커널이 요청된 작업 수행',
    '4) 사용자 모드로 복귀하여 프로그램 실행 계속',
  ]},
]

export default blocks as any

