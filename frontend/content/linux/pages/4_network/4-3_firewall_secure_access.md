---
title: 방화벽/보안 접속
slug: 4-3_firewall_secure_access
section: 4. 네트워크
duration: 70m
prereqs: [4-2_dns_dhcp]
---

## 학습 목표
- iptables/nftables 구조를 설명하고 기본 정책을 구성한다.
- firewalld 존/서비스/리치 규칙을 운용한다.
- SSH 하드닝과 포트포워딩/프록시점프를 적용한다.
- TLS/인증서 검증과 배포 원칙을 이해한다.

## 핵심 개념
- chain/table, conntrack state, set/map
- 존 기반 정책, 서비스 단위 허용, 리치 규칙
- 인증/키관리, fail2ban, 포트포워딩
- TLS: OCSP, ALPN, HSTS, Cipher 선택

## 핵심 명령/도구
- `nft`, `iptables`, `firewall-cmd`, `ssh`, `sshd_config`, `openssl`

## 외부 참고 요약

It also supports an interface for services or applications to add firewall rules directly." firewalld firewalld is actually a front end to the netfilter and nftables Kernel sub-systems in Rocky Linux.

firewalld This guide focuses on applying rules from an iptables firewall to a firewalld firewall.

Take this iptables rule section as an example: iptables iptables -A INPUT -p tcp -m tcp -s 192.168.1.122 --dport 22 -j ACCEPT iptables -A INPUT -p tcp -m tcp -s 192.168.1.122 --dport 22 -j ACCEPT Here you are allowing a single IP address for SSH (port 22) into the server.

ssh Suppose you lock yourself out of ssh access via the firewall.

Warning By default the "public" zone has the ssh service enabled; this can be a security liability.

ssh ssh If you have more than one administrative IP that you need to add (quite likely), just add it to the sources for the zone.

You have the following rules dealing with FTP: iptables iptables -A INPUT -p tcp -m tcp --dport 20 -21 -j ACCEPT iptables -A INPUT -p tcp -m tcp --dport 7000 -7500 -j ACCEPT iptables -A INPUT -p tcp -m tcp --dport 20 -21 -j ACCEPT iptables -A INPUT -p tcp -m tcp --dport 7000 -7500 -j ACCEPT This portion of the script deals with the standard FTP ports (20 and 21) and some additional passive ports.

No ftp-data service (port 20) exists in firewalld .

iptables firewalld First, add the ftp service to the zone that is also hosting the web services.

The assumption is that you have a good password policy for your database access and the iptables line in your firewall dealing with the database looks like this: iptables iptables -A INPUT -p tcp -m tcp --dport=3600 -j ACCEPT iptables -A INPUT -p tcp -m tcp --dport=3600 -j ACCEPT In this case, add the service to the "public" zone for a firewalld conversion: firewalld firewall-cmd --zone=public --add-service=mysql --permanent firewall-cmd --zone=public --add-service=mysql --permanent Postgresql considerations ¶ Postgresql uses its service port.

Here is an IP tables rule example: iptables -A INPUT -p tcp -m tcp --dport 5432 -s 192.168.1.0/24 -j ACCEPT iptables -A INPUT -p tcp -m tcp --dport 5432 -s 192.168.1.0/24 -j ACCEPT While it is less common on publicly facing web servers, it might be more common as an internal resource.

If you have a private DNS server, with iptables rules that looked like this (note that most DNS services are UDP, rather than TCP, but not always): iptables -A INPUT -p udp -m udp -s 192.168.1.0/24 --dport 53 -j ACCEPT iptables -A INPUT -p udp -m udp -s 192.168.1.0/24 --dport 53 -j ACCEPT then allowing only your "trusted" zone will be correct.

### 출처
- https://wiki.nftables.org/
- https://docs.rockylinux.org/guides/security/firewalld/
- https://www.openssh.com/manual.html
