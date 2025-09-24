---
title: 이름 해석/주소할당 (DNS/DHCP)
slug: 4-2_dns_dhcp
section: 4. 네트워크
duration: 65m
prereqs: [4-1_interfaces_routing]
---

## 학습 목표
- DNS 재귀/권한/캐시 동작을 설명한다.
- `dig`/`nslookup`으로 레코드를 조회/디버깅한다.
- DHCP DORA 시퀀스와 예약/옵션/PXE 개념을 이해한다.

## 핵심 개념
- 레코드: A/AAAA/CNAME/TXT/SRV, TTL
- DNSSEC, split‑horizon, 캐시 설계
- DHCP 옵션(라우터, DNS, PXE), 임대/예약

## 핵심 명령/도구
- `dig`, `nslookup`, `drill`, `journalctl -u systemd-resolved`

## 외부 참고 요약

NS RDATA format 18 3.3.12.

Transforming a user request into a query 43 7.2.

To the user, the domain tree is a single information space; the resolver is responsible for hiding the distribution of data among name servers from the user.

The simplest, and perhaps most typical, configuration is shown below: Local Host | Foreign | +---------+ +----------+ | +--------+ | | user queries | |queries | | | | User |-------------->| |---------|->|Foreign | | Program | | Resolver | | | Name | | |<--------------| |<--------|--| Server | | | user responses| |responses| | | +---------+ +----------+ | +--------+ | A | cache additions | | references | V | | +----------+ | | cache | | +----------+ | User programs interact with the domain name space through resolvers; the format of user queries and user responses is specific to the host and its operating system.

The DNS requires that all zones be redundantly supported by more than one name server.

Size limits Various objects and parameters in the DNS have size limits.

UDP messages 512 octets or less 3 .

NULLs are used as placeholders in some experimental extensions of the DNS.

For example, if PROTOCOL=TCP (6), the 26th bit corresponds to TCP port 25 (SMTP).

If this bit is set, a SMTP server should be listening on TCP port 25; if zero, SMTP service is not supported on the specified address.

The purpose of WKS RRs is to provide availability information for servers for TCP and UDP.

If a server supports both TCP and UDP, or has multiple Internet addresses, then multiple WKS RRs are used.

### 출처
- https://www.isc.org/bind/
- https://www.isc.org/dhcp/
- https://www.rfc-editor.org/rfc/rfc1035
