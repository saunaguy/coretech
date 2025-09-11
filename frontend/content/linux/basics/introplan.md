# 📌 커리큘럼 보완 제안(Introduction Planning)

본 문서는 `basics/intro.md`의 개정 구조(운영체제·하드웨어 / 설치·가상화·유틸리티 두 묶음)를 바탕으로, 학습 효과를 높이기 위한 보완 토픽과 실습 아이디어를 제안합니다.

## 묶음 A · 운영체제·하드웨어(보완)
- 커널 관찰 도구: `strace`, `ltrace`, `perf`, `bcc/bpftrace`로 시스템 호출/성능 관찰
- 메모리 심화: `vm.swappiness`, THP(Transparent Huge Pages), OOM 점검 실습
- 스토리지 심화: LUKS 암호화, `nvme-cli`/SMART 건강도, I/O 스케줄러 비교
- 파일시스템 기능: XFS vs EXT4 상세, Btrfs 스냅샷/서브볼륨 체험
- 부팅/복구: GRUB 복구, chroot 복원, initramfs 재생성 흐름

## 묶음 B · 설치·가상화·유틸리티(보완)
- 설치 자동화 심화: Kickstart/Preseed, cloud-init 사용자 데이터 설계 패턴
- VM 네트워크: NAT/브리지/Host-only 트레이드오프 실습 체크리스트
- 베이스 이미지 관리: Packer로 이미지 빌드, Vagrant/Libvirt 워크플로우
- CLI/셸 생산성: `fzf`, `ripgrep`, `bat`, `fd`, `exa`, `zoxide`, `tldr` 소개 및 dotfiles
- 터미널 멀티플렉서: `tmux` 기본/세션복구/팀 협업 워크플로우

## 리눅스 명령어 · 운영 · 트러블슈팅(교차 보완)
- 로그 운용 표준: journald 보존/로테이션, logrotate 정책, 구조화 로그(JSON)
- systemd 심화: Unit 템플릿/오버라이드(drop-in), sandbox 옵션(`ProtectSystem=` 등)
- 보안 기본: SELinux/AppArmor 비교, SSH 키·에이전트, fail2ban, sudo 정책 분리
- 네트워크 진단 루틴: 계층별 절차서(링크 → L3 → L4/7), 캡처 필터 실전 예제
- 성능 프로파일링: vmstat/iostat/sar → perf/eBPF로 파고드는 단계형 접근

## 실습(랩) 강화 아이디어
- 체크리스트 기반 랩: 명확한 Pass/Fail 기준과 제출 산출물(명령 캡처, 설정파일)
- 재현 가능한 환경: 컨테이너/VM 스냅샷, seed 스크립트 제공
- 트러블 삽입형 과제: 의도된 오작동(잘못된 fstab, 방화벽 규칙 등) 탐지/복구
- 운영 시나리오: 배포 → 장애 → 롤백/복구 → 사후 분석(Postmortem) 작성

## 자료 구성/운영 제안
- 용어 사전(Glossary): 초급~중급 핵심 개념 용어집 별도 페이지
- 명령어 치트시트: 카테고리별 최소 예제와 위험 플래그 주석
- 베스트 프랙티스: 운영 실수 사례와 예방 규칙(백업·접근제어·로그 보존)
- 참고 링크: 매 섹션 말미에 공식 문서/핵심 글 링크 묶음

## 파일/로더 규칙 합의(요약)
- 상위 섹션: `./NN/NN-M.ts` (예: `02/02-1.ts`)
- 중첩 스텝: 명시 매핑 사용(예: `01-1-1` → `./01/1-1/1.ts`)
- 새 섹션 추가 시: 위 규칙에 맞게 파일만 추가하면 사이드바/로더가 인식

