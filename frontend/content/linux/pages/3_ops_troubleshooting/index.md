---
title: 서버 운영 & 트러블슈팅
slug: 3_ops_troubleshooting
section: 3. 리눅스 서버 운영 & 트러블슈팅
duration: 80m
prereqs: [2-4_advanced_admin]
---

## 학습 목표
- 부팅/서비스/네트워크/디스크 이슈를 체계적으로 진단한다.
- SELinux/PAM 인증 문제를 로그로 추적하고 예외를 처리한다.
- 백업/복구와 감사(audit) 기초 정책을 수립한다.

![Boot→Units](../../assets/systemd_flow.svg)

## 핵심 개념
- 부팅 실패 대응: GRUB 복구, initramfs 확인
- 포트 충돌/바인딩, 열림 파일(lsof/fuser)
- 성능 병목: vmstat/iostat/sar
- SELinux AVC 로그, `semanage`/`chcon`
- 백업 주기/보관/복구, `rsync`/스냅샷
- auditd로 감사 이벤트 수집

## 전문가 포인트
- GRUB 복구: `set root=`, `linux /vmlinuz`, `initrd`, `boot` 수동 부팅, chroot 재설치
- initramfs: 드라이버 포함 여부 검사, `lsinitrd`/`unmkinitramfs`
- 파일 핸들 누수: `lsof +L1`로 삭제된 파일 핸들 검출, 로그 로테이션 이슈
- iostat: await/svctm 차이, 큐 깊이와 스토리지 병목 상관
- SELinux: `semanage fcontext -a -t httpd_sys_content_t`와 `restorecon -Rv`
- audit: `auditctl -w /etc/shadow -p wa -k auth-files` 정책 예시

## 핵심 명령/도구
- `journalctl`, `systemctl`, `lsof`, `fuser`, `vmstat`, `iostat`, `sar`
- `semanage`, `chcon`, `restorecon`
- `rsync`, `tar`, `auditctl`, `ausearch`

## 실무 팁
- 장애 보고서 템플릿: 현상→원인→조치→재발방지, MTTA/MTTR 기록
- Pre‑mortem: 변경 전 위험도 평가와 롤백 플랜 문서화

## 체크리스트/퀴즈
- 서비스 기동 실패 시 3단계 점검 순서 작성

## 외부 참고(가이드)
- Red Hat/SUSE KB, Arch Wiki: journalctl, SELinux docs

## 연계 실습
- 장애 시나리오 주입→원인 분석→조치→사후 리포트
