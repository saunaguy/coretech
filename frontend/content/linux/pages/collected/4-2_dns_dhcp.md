---
title: 자동 요약 초안 - 4-2_dns_dhcp
topic: 4-2_dns_dhcp
lang: ko
---

## 요약 초안 (자동)

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

## 출처
- https://www.isc.org/bind/
- https://www.isc.org/dhcp/
- https://www.rfc-editor.org/rfc/rfc1035

> 주의: 자동 요약 초안입니다. 정확성 검토와 편집이 필요합니다.
