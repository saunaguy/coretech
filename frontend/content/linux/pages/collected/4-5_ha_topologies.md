---
title: 자동 요약 초안 - 4-5_ha_topologies
topic: 4-5_ha_topologies
lang: ko
---

## 요약 초안 (자동)

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

## 출처
- https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/9/html/configuring_and_managing_networking
- https://www.keepalived.org/manpage.html
- https://www.rfc-editor.org/rfc/rfc5798

> 주의: 자동 요약 초안입니다. 정확성 검토와 편집이 필요합니다.
