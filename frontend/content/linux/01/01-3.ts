const blocks = [
  { type: 'heading', text: '학습 목표' },
  { type: 'list', items: [
    'Unix의 역사와 철학을 요약한다',
    'GNU 프로젝트와 Linux 커널의 결합을 설명한다',
    'Unix vs Linux의 차이와 공통점을 말한다',
  ]},
  { type: 'aside', text: 'Linux는 Unix 철학을 계승한 오픈소스(Unix-like). GPL로 자유롭게 사용·수정·배포 가능.' },
  { type: 'paragraph', text: '리눅스는 유닉스(Unix)라는 운영체제에서 뿌리를 두고 있습니다. 둘의 관계를 이해하는 것은 리눅스의 철학을 이해하는 데 도움이 됩니다.' },
  { type: 'heading', text: 'Unix — 모든 것의 시작' },
  { type: 'list', items: [
    '1969년 AT&T 벨 연구소에서 시작, C 언어와 함께 확산',
    '특징: 다중 사용자/멀티태스킹, 프로세스/파일/파이프, “모든 것은 파일” 철학',
    '분기: BSD 계열과 System V 계열, 이후 상업화와 라이선스 이슈',
    '표준화: POSIX가 공통 API 규격을 제시',
  ]},
  { type: 'heading', text: 'Linux — 자유의 계승' },
  { type: 'list', items: [
    '1991 리누스 토르발스가 커널 개발 시작(386 아키텍처)',
    'GNU 프로젝트 사용자 공간 도구들과 결합해 완성도 상승',
    'GPL 라이선스 기반 협업: 누구나 소스 확인/수정/배포 가능',
    '광범위 사용처: 서버·클라우드·모바일·임베디드',
  ]},
  { type: 'heading', text: 'Unix vs Linux — 실용 관점' },
  { type: 'list', items: [
    '유닉스: 기업 소유 상용 OS(예: AIX, HP-UX). 하드웨어와 밀접',
    '리눅스: 전 세계 커뮤니티가 만드는 오픈소스 커널과 배포판',
    '공통점: POSIX 기반 명령/개념 유사, 셸/파일/프로세스 모델 공유',
    '차이점: 라이선스/배포/지원 방식, 생태계 구성',
  ]},
  { type: 'divider' },
  { type: 'heading', text: 'Hands-on: 내 시스템 정체 확인' },
  { type: 'list', items: [
    '커널/아키: uname -srm',
    '배포판: cat /etc/os-release | sed -n "1,6p"',
    '라이선스 확인은 개념적으로(GPL), 실제 시스템에는 라이선스 파일들이 패키지에 포함',
  ]},
  { type: 'heading', text: '체크리스트·퀴즈' },
  { type: 'list', items: [
    'Unix의 핵심 철학을 2가지 말하라(작은 도구/텍스트 기반 등)',
    'Linux가 Unix와 다른 점을 2가지 말하라(라이선스/배포 생태 등)',
    'POSIX의 역할은 무엇인가',
  ]},
  { type: 'heading', text: '요약' },
  { type: 'paragraph', text: 'Unix는 현대 OS의 개념을 정립한 원류이고, Linux는 그 철학을 계승한 오픈소스 커널이다. 사용자 공간 도구(GNU)와 결합한 배포판 형태로 널리 쓰이며, POSIX를 공통 분모로 명령/개념 호환성을 유지한다.' },
]

export default blocks as any

