---
title: 인터페이스/라우팅 기초
slug: 4-1_interfaces_routing
section: 4. 네트워크
duration: 70m
prereqs: [2-4_advanced_admin]
---

## 학습 목표
- OSI/TCP‑IP, MTU/MSS/PMTUD 개념을 설명한다.
- `ip`/`nmcli`로 주소/링크/라우트 구성을 수행한다.
- 라우팅 테이블/메트릭/기본 게이트웨이를 관리한다.
- IPv4/IPv6 CIDR을 계산하고 적용한다.

## 핵심 개념
- 인터페이스 상태/주소/route 오브젝트, metric 우선순위
- PMTUD와 ICMP, MSS clamp 필요성
- IPv6 프리픽스/라우팅 차이, ND

## 핵심 명령/도구
- `ip addr|link|route`, `nmcli`, `ss`

## 외부 참고 요약

-force Don't terminate ip on errors in batch mode.

-n , -netns <NETNS> switches ip to the specified network namespace NETNS .

This option is currently only supported by ip addr show , ip link show & ip neigh show commands.

-echo Request the kernel to send the applied configuration back.

IP - COMMAND SYNTAX top OBJECT address - protocol (IP or IPv6) address on a device.

EXAMPLES top ip addr Shows addresses assigned to all network interfaces.

ip neigh Shows the current neighbour table in kernel.

ip link set x up Bring up interface x.

ip link set x down Bring down interface x.

HISTORY top ip was written by Alexey N.

skip to content Wiki User Tools Log In Site Tools Recent Changes Media Manager Sitemap Table of Contents Introduction Download Documentation Introduction Iproute2 is a collection of utilities for controlling TCP / IP networking and traffic control in Linux.

The original author, Alexey Kuznetsov, is well known for the QoS implementation in the Linux kernel.

### 출처
- https://man7.org/linux/man-pages/man8/ip.8.html
- https://wiki.linuxfoundation.org/networking/iproute2
- https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/
