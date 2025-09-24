---
title: 자동 요약 초안 - 1-1_basics
topic: 1-1_basics
lang: ko
---

## 요약 초안 (자동)

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

## 출처
- https://www.kernel.org/doc/html/latest/
- https://man7.org/linux/man-pages/
- https://wiki.archlinux.org/title/General_recommendations

> 주의: 자동 요약 초안입니다. 정확성 검토와 편집이 필요합니다.
