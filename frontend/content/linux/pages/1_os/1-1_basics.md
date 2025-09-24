---
title: 운영체제 기초
slug: 1-1_basics
section: 1. OS 운영체제
duration: 45m
prereqs: []
---

## 학습 목표
- 커널·쉘·시스템콜의 역할을 설명한다.
- 프로세스와 스레드의 차이를 사례로 구분한다.
- 메모리 관리(페이징/스와핑/가상메모리)의 흐름을 요약한다.
- 파일시스템(inode/저널링)의 핵심 개념을 파악한다.
- 부팅 시퀀스와 커널 모듈 로딩 개념을 이해한다.

![OS Architecture](../../assets/os_architecture.svg)

## 핵심 개념
- 커널/유저 공간, 시스템 콜 인터페이스
- 스케줄러(CFS), 우선순위, nice/renice
- 가상 메모리, 페이지 폴트, 스왑 영역
- 파일시스템: inode, 저널링, ext4/xfs/btrfs 개요
- 부팅: BIOS/UEFI → 부트로더 → initramfs → systemd
- 커널 모듈: lsmod, modprobe, modinfo

## 전문가 포인트
- CFS: vruntime 기반 공정성, `sched_latency_ns`, `sched_min_granularity_ns` 조정 포인트
- 메모리: THP(Transparent Huge Pages), OOM killer 시그널링, `vm.swappiness`/overcommit 정책
- NUMA: `numactl`/`hwloc`로 배치 최적화, 메모리 지역성 이슈
- VFS: dentry/inode 캐시, page cache와 I/O barrier, `fsync` 비용
- btrfs/zfs 개요: copy‑on‑write, 스냅샷, 체크섬 및 스크럽

## 핵심 명령/도구
- `uname`, `lsmod`, `modprobe`, `dmesg`
- `nice`, `renice`, `/proc`, `/sys`

## 실무 팁
- `dmesg -w`로 실시간 커널 이벤트 관찰, PCI/NIC/디스크 오류 조기 감지
- `/proc/meminfo`와 `/proc/zoneinfo`로 메모리 압력 징후 확인
- `sysctl -a | rg sched|vm\.`로 주요 커널 파라미터 파악

## 체크리스트/퀴즈
- 커널과 쉘의 경계를 한 문장으로 정의해보자.
- inode가 없으면 어떤 메타데이터가 사라지는가?

## 시각 자료 제안
- 사용자→쉘→시스템콜→커널 흐름도
- 파일시스템 계층 다이어그램(inode/데이터 블록)

![Filesystem Layers](../../assets/filesystem_layers.svg)

## 외부 참고(가이드)
- kernel.org docs, man7.org, TLDP

## 연계 실습
- `/proc`/`/sys` 탐색, `dmesg`에서 하드웨어 이벤트 찾기

## 외부 참고 요약

Unsorted documentation Translations ¶ Translations 中文翻译 繁體中文翻譯 La documentazione del kernel Linux 한국어 번역 日本語訳 Traducción al español Disclaimer 中文翻译 繁體中文翻譯 La documentazione del kernel Linux 한국어 번역 日本語訳 Traducción al español Disclaimer Indices and tables ¶ Index Index

See Users and groups#User management for details.

Service management Arch Linux uses systemd as the init process, which is a system and service manager for Linux.

Interaction with systemd is done through the systemctl command.

See systemd#Basic systemctl usage for more information.

An overview of the Arch boot process can be found at Arch boot process .

See Category:Graphical user interfaces for additional resources.

User directories Well-known user directories like Downloads or Music are created by the xdg-user-dirs-update.service user service, that is provided by xdg-user-dirs and enabled by default upon install.

DNS security For better security while browsing the web, paying online, connecting to SSH services and similar tasks consider using DNSSEC -enabled DNS resolver that can validate signed DNS records, and an encrypted protocol such as DNS over TLS , DNS over HTTPS or DNSCrypt .

Setting up a firewall A firewall can provide an extra layer of protection on top of the Linux networking stack.

While the stock Arch kernel is capable of using Netfilter 's iptables and nftables , neither are enabled by default.

Arch Linux provides several alternatives, see locate for details.

### 출처
- https://www.kernel.org/doc/html/latest/
- https://man7.org/linux/man-pages/
- https://wiki.archlinux.org/title/General_recommendations
