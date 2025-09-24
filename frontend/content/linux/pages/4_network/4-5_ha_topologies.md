---
title: 고가용성/고급 토폴로지
slug: 4-5_ha_topologies
section: 4. 네트워크
duration: 80m
prereqs: [4-4_lb_proxy]
---

## 학습 목표
- VLAN/trunk/bonding 설계를 설명한다.
- VRRP/GLBP/HSRP 및 keepalived로 게이트웨이 이중화를 구성한다.
- 정책 기반 라우팅(PBR)과 다중 회선을 설계한다.
- VPN(OpenVPN/IPSec)의 터널/라우팅 상호작용을 이해한다.
- 컨테이너 네트워킹/네임스페이스를 소개한다.

## 핵심 개념
- L2 세그먼트화, 802.1Q, LACP
- VRRP 가상 IP, 트래킹, 플로팅 IP
- `ip rule`/fwmark, 라우팅 테이블 분리
- VPN 토폴로지(site‑to‑site/roadwarrior), 라우팅 우선순위
- netns, veth, 브리지, CNI 개요

## 핵심 명령/도구
- `nmcli` VLAN/bond, `keepalived`, `ip rule`, `ip route` tables
- `openvpn`, `strongswan`/`ipsec`, `wg` (옵션)

## 외부 참고 요약

By default the scripts will be executed by user keepalived_script if that user exists, or if not by root, but for each script the user/group under which it is to be executed can be specified.

# IP address or domain name with optional port number.

# NOTE: maxlen, port, ttl and group are only available on Linux 4.3 or later.

lvs_sync_daemon <INTERFACE> [[inst] <VRRP_INSTANCE>] [id <SYNC_ID>] \ [maxlen <LEN>] [port <PORT>] [ttl <TTL>] [group <IP ADDR>] # lvs_timeouts specifies the tcp, tcp_fin and udp connection tracking timeouts # in seconds.

# If both vrrp_iptables and vrrp_nftables are specified, keepalived will use # nftables and not iptables.

Similarly, if the iptables command is generating # nftables configuration, or there is no iptables command installed, # keepalived will use nftables rather than iptables.

nftables [TABLENAME] nftables_priority PRIORITY nftables_counters nftables_ifindex # Similarly for IPVS iptables - used for setting fwmarks for virtual # server groups.

nftables_ipvs [TABLENAME] nftables_ipvs_priority PRIORITY nftables_ipvs_start_fwmark NUMBER # Use iptables as the firewall.

# This is available from Linux 4.3 onwards.

In that last case Linux kernel will be restricted to that cpu # set during scheduling.

# If groupname is not specified, it defaults to the user's group.

However, historically, the term "IP" usually refers to IPv4.

### 출처
- https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/9/html/configuring_and_managing_networking
- https://www.keepalived.org/manpage.html
- https://www.rfc-editor.org/rfc/rfc5798
