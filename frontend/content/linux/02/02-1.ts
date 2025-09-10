export default [
  { type: 'heading', text: '2-1 기본 명령어' },
  { type: 'paragraph', text: '파일/디렉토리, 탐색, 텍스트 확인, 도움말, 에디터, 경로/글로빙, 리다이렉션/파이프 등 셸의 기초를 한 데 묶어 정리합니다.' },
  { type: 'list', items: [
    '파일/디렉토리: ls, cp, mv, rm, mkdir, touch, rmdir',
    '탐색: pwd, cd, find, locate',
    '텍스트 확인: cat, less, more, head, tail',
    '도움말: man, --help',
    '에디터: vim, nano 기본 단축키',
    '경로/글로빙/히스토리/alias',
    '리다이렉션/파이프/명령 치환/서브쉘',
  ]},
  { type: 'aside', text: '🧪 실습: grep/awk/sed 이전에 파이프/리다이렉션 감각부터 익히세요.' },
]

