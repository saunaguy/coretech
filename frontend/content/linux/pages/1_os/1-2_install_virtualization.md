---
title: 설치 및 가상화
slug: 1-2_install_virtualization
section: 1. OS 운영체제
duration: 50m
prereqs: [1-1_basics]
---

## 학습 목표
- 배포판/설치 매체/네트워크 설치 방식을 비교한다.
- 파티셔닝/파일시스템/스왑 설계 원칙을 제시한다.
- NAT/Bridged/Host-only 네트워크 모드를 적용한다.
- 스냅샷/템플릿 이미지를 활용한 실습 환경을 만든다.

![Network Modes](../../assets/network_modes.svg)

## 핵심 개념
- 설치 자동화: Kickstart/Preseed, cloud-init
- 이미지 형식: qcow2, vmdk, `qemu-img` 변환
- 듀얼부트 vs VM vs 컨테이너의 트레이드오프

## 전문가 포인트
- 파티셔닝: EFI(ESP) 분리, `/boot` vs LVM 내부, RAID1/10 설계 트레이드오프
- 파일시스템: XFS(메타데이터 무결성, 대용량)에 강점, ext4(호환성) 장점
- cloud-init 모듈 순서(`init`, `config`, `final`)와 userdata/metadata 소스
- NAT vs Bridged: 브로드캐스트/멀티캐스트 처우, 포트포워딩 필요성
- 스냅샷: crash‑consistent vs app‑consistent, `qemu-guest-agent` 역할

## 핵심 명령/도구
- `virt-install`, `virt-manager`, VirtualBox GUI
- `nmcli` 네트워크 모드 확인

## 실무 팁
- `qemu-img convert -O qcow2 input.vmdk out.qcow2` 변환 시 sparse 보존 확인
- cloud-init 로그 위치: `/var/log/cloud-init.log`, 1회성 실행 방지 `cloud-init clean`

## 체크리스트/퀴즈
- NAT와 Bridged의 차이를 실제 통신 경로로 설명하라.

## 시각 자료 제안
- 하이퍼바이저 구조도, 네트워크 모드별 토폴로지

## 외부 참고(가이드)
- Rocky/Ubuntu/Fedora 공식 문서, VirtualBox 메뉴얼

## 연계 실습
- 템플릿 VM 생성→스냅샷→수업 전 배포 자동화
