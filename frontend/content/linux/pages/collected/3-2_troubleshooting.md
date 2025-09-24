---
title: 자동 요약 초안 - 3-2_troubleshooting
topic: 3-2_troubleshooting
lang: ko
---

## 요약 초안 (자동)

timers.target basic.target User manager startup Â¶ The system manager starts the user@ uid .service unit for each user, which launches a separate unprivileged instance of systemd for each user â the user manager.

/run/initramfs/shutdown /run/initramfs/ /shutdown /run/ See Also Â¶ systemd (1) , boot (7) , systemd.special (7) , systemd.target (5) , systemd-halt.service (8) , systemd-soft-reboot.service (8)

Core OS Command Line Arguments Â¶ systemd.unit= rd.systemd.unit= systemd.dump_core systemd.crash_chvt systemd.crash_shell systemd.crash_action= systemd.confirm_spawn systemd.service_watchdogs systemd.show_status systemd.status_unit_format= systemd.log_target= systemd.log_level= systemd.log_location= systemd.log_color systemd.log_ratelimit_kmsg systemd.default_standard_output= systemd.default_standard_error= systemd.setenv= systemd.machine_id= systemd.set_credential= systemd.set_credential_binary= systemd.import_credentials= systemd.reload_limit_interval_sec= systemd.reload_limit_burst= Parameters understood by the system and service manager to control system behavior.

For details, see systemd-backlight@.service (8) and systemd-rfkill.service (8) .

systemd.journald.forward_to_syslog= systemd.journald.forward_to_kmsg= systemd.journald.forward_to_console= systemd.journald.forward_to_wall= Parameters understood by the journal service.

veritytab= rd.veritytab= roothash= systemd.verity= rd.systemd.verity= systemd.verity_root_data= systemd.verity_root_hash= systemd.verity_root_options= usrhash= systemd.verity_usr_data= systemd.verity_usr_hash= systemd.verity_usr_options= Configures the integrity protection root hash for the root and /usr file systems, and other related parameters.

systemd.getty_auto= Configures whether the serial-getty@.service will run.

systemd.condition_first_boot= ConditionFirstBoot= systemd-firstboot.service Added in version 233.

ConditionFirstBoot= systemd.firstboot= systemd-firstboot.service Added in version 246.

History Â¶ Kernel command-line arguments systemd.unified_cgroup_hierarchy and systemd.legacy_systemd_cgroup_controller were deprecated.

systemd.unified_cgroup_hierarchy systemd.legacy_systemd_cgroup_controller Added in version 252.

See Also Â¶ systemd (1) , systemd-system.conf (5) , bootparam (7) , systemd.system-credentials (7) , smbios-type-11 (7) , systemd-debug-generator (8) , systemd-fsck@.service (8) , systemd-quotacheck.service (8) , systemd-journald.service (8) , systemd-vconsole-setup.service (8) , systemd-udevd.service (8) , plymouth (8) , systemd-cryptsetup-generator (8) , systemd-veritysetup-generator (8) , systemd-fstab-generator (8) , systemd-getty-generator (8) , systemd-gpt-auto-generator (8) , systemd-volatile-root.service (8) , systemd-modules-load.service (8) , systemd-backlight@.service (8) , systemd-rfkill.service (8) , systemd-hibernate-resume-generator (8) , systemd-firstboot.service (8) , bootctl (1)

## 출처
- https://www.freedesktop.org/software/systemd/man/latest/bootup.html
- https://www.freedesktop.org/software/systemd/man/latest/kernel-command-line.html
- https://access.redhat.com/solutions/

> 주의: 자동 요약 초안입니다. 정확성 검토와 편집이 필요합니다.
