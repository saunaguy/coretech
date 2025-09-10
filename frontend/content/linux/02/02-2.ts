export default [
  { type: 'heading', text: '2-2 사용자/권한 관련' },
  { type: 'paragraph', text: '사용자/그룹, 파일 권한과 특수 권한, sudo/visudo, 파일 속성/ACL, 로그인 셸과 환경 변수까지 권한 체계를 정리합니다.' },
  { type: 'list', items: [
    '사용자/그룹: useradd/groupadd/passwd',
    '파일 권한: chmod, chown, umask',
    'sudo/visudo: 최소 권한 원칙',
    '특수 권한: SUID/SGID/Sticky',
    '파일 속성: chattr/lsattr',
    'ACL: getfacl/setfacl',
    '로그인 셸/환경 변수: profile, bashrc, secure_path',
  ]},
  { type: 'aside', text: '🔐 운영 표준: 사람 계정/서비스 계정 분리, sudoers를 파일 단위(/etc/sudoers.d)로 관리.' },
]

