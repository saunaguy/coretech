---
title: 네트워크
slug: 4_network
section: 4. 네트워크
duration: 90m
prereqs: [2-4_advanced_admin]
---

## 학습 목표
- OSI/TCP-IP 계층과 MTU/MSS 개념을 운영 관점에서 설명한다.
- IP 주소/서브넷/CIDR, IPv6 기본과 라우팅 테이블을 관리한다.
- DHCP/DNS/방화벽/프록시/TLS 구성의 원리를 이해한다.
- 네트워크 성능 측정과 병목 진단 절차를 익힌다.

![TCP/IP Layers](../../assets/tcpip_layers.svg)

## 핵심 개념
- 인터페이스 관리: `ip`, `nmcli`; 라우팅: `ip route`
- ARP/ICMP/ND, DHCP/DNS 기초와 도구(`dig`/`nslookup`)
- 정책 기반 라우팅(PBR), 다중 게이트웨이 개요
- 방화벽: iptables/nftables 설계, 상태 추적
- 프록시: 정/역방향, 캐싱, WAF 개요
- TLS/인증서: 키/CSR/CA, certbot/letsencrypt
- 성능 측정: `iperf3`, `mtr`
- 네임스페이스/컨테이너 네트워킹 기초 소개

## 전문가 포인트
- MTU/MSS: Path MTU Discovery, icmp‑frag‑needed 필터링 시 이슈, MSS clamp
- 라우팅 우선순위: `metric`, 정책 라우팅과 fwmark, `ip rule`/`ip route` 테이블 분리
- DNS: `dnssec`, split‑horizon, `resolv.conf` 관리와 systemd‑resolved
- TLS: OCSP stapling, HSTS, ALPN/HTTP2, ECDSA vs RSA cert 선택
- nftables: conntrack 상태 기반 정책, set/map를 이용한 대량 차단/허용
- 네임스페이스: `ip netns`로 격리 실험, veth‑pair 브리징

## 체크리스트/퀴즈
- 동일 호스트 내 네임스페이스 간 통신 구성 절차는?

## 외부 참고(가이드)
- RFC, iproute2 docs, Nginx/HAProxy docs, curl docs

## 연계 실습
- iperf3로 대역폭 측정→경로/MTU 이슈 진단

## 실무 팁
- `mtr -rwzc 200`으로 손실률/지연 가시화, 스팁 변화는 버퍼블로트 의심
- `openssl s_client -connect host:443 -alpn h2 -servername host`로 핸드셰이크 검사
