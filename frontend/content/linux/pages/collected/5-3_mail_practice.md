---
title: 자동 요약 초안 - 5-3_mail_practice
topic: 5-3_mail_practice
lang: ko
---

## 요약 초안 (자동)

Information about how to configure Postfix for specific applications such as mailhub, firewall or dial-up client can be found in the STANDARD_CONFIGURATION_README file.

Giving someone else write permission to main.cf or master.cf (or to their parent directories) means giving root privileges to that person.

Examples (specify only one of the following): /etc/postfix/ main.cf : myorigin = $ myhostname (default: send mail as "user@$ myhostname ") myorigin = $ mydomain (probably desirable: "user@$ mydomain ") What domains to receive mail for The mydestination parameter specifies what domains this machine will deliver locally, instead of forwarding to another machine.

/etc/postfix/ main.cf : mydestination = $ myhostname localhost.$ mydomain localhost $ mydomain Example 3: host with multiple DNS A records.

Prior to Postfix 3.0, the default was to authorize all clients in the IP subnetworks that the local machine is attached to.

On Linux, this works correctly only with interfaces specified with the "ifconfig" or "ip" command.

On Linux, this works correctly only with interfaces specified with the "ifconfig" or "ip" command.

The syslogd process sorts events by class and severity, and appends them to logfiles.

IMPORTANT: on Linux you need to put a "-" character before the pathname, e.g., -/var/log/maillog, otherwise the syslogd process will use more system resources than Postfix.

The first line (postfix check) causes Postfix to report file permission/ownership discrepancies.

You can override the inet_interfaces setting in the Postfix master.cf file by prepending an IP address to a server name.

Dovecot Community Edition (CE) â Dovecot is an open source email server for Linux/UNIX-like systems, written with security primarily in mind.

## 출처
- https://www.postfix.org/BASIC_CONFIGURATION_README.html
- https://doc.dovecot.org/
- https://bind9.readthedocs.io/en/v9.18/

> 주의: 자동 요약 초안입니다. 정확성 검토와 편집이 필요합니다.
