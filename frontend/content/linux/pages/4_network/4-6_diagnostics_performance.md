---
title: 진단/성능 분석
slug: 4-6_diagnostics_performance
section: 4. 네트워크
duration: 70m
prereqs: [4-5_ha_topologies]
---

## 학습 목표
- `iperf3`/`mtr`/`ping`으로 네트워크 성능을 측정한다.
- `tcpdump`/Wireshark로 패킷을 캡처/분석한다.
- `ss`/`curl`/`nmap`으로 서비스 레벨을 점검한다.
- 병목 분류 절차(링크/전송/네트워크/애플리케이션)를 적용한다.

## 핵심 개념
- 지연/손실/지터, 버퍼블로트, 큐 관리
- pcap 필터, TLS 핸드셰이크 관찰 포인트
- 종단 상태/포트/방화벽 상호작용

## 핵심 명령/도구
- `iperf3`, `mtr`, `ping`, `tcpdump`, `wireshark`, `ss`, `curl`, `nmap`

## 외부 참고 요약

--sctp use SCTP rather than TCP (Linux, FreeBSD and Solaris).

--sctp use SCTP rather than TCP (Linux, FreeBSD and Solaris).

Usually a UDP datagram becomes several IP packets.

Unlike normal TCP and UDP tests, multicast servers may be started after the client.

Compiling Once you have the distribution, on UNIX, unpack it using gzip and tar.

tcpdump 'tcp[tcpflags] & (tcp-syn|tcp-fin) != 0 and not src and dst net localnet ' To print the TCP packets with flags RST and ACK both set.

The three types are ip , utcp , and ctcp .

For example, tcp[13] may be replaced with tcp[tcpflags] .

UDP Packets UDP format is illustrated by this rwho packet: actinide.who > broadcast.who: udp 84 Some UDP services are recognized (from the source or destination port number) and the higher level protocol information printed.

TCP or UDP Name Server Requests (N.B.:The following description assumes familiarity with the Domain Service protocol described in RFC 1035.

SMB/CIFS Decoding tcpdump now includes fairly extensive SMB/CIFS/NBT decoding for data on UDP/137, UDP/138 and TCP/139.

It is currently maintained by The Tcpdump Group.

### 출처
- https://iperf.fr/iperf-doc.php
- https://www.bitwizard.nl/mtr/
- https://www.tcpdump.org/manpages/tcpdump.1.html
