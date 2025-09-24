---
title: 자동 요약 초안 - 3-1_ops
topic: 3-1_ops
lang: ko
---

## 요약 초안 (자동)

See the respective man pages for more information: systemd.service (5) , systemd.socket (5) , systemd.device (5) , systemd.mount (5) , systemd.automount (5) , systemd.swap (5) , systemd.target (5) , systemd.path (5) , systemd.timer (5) , systemd.slice (5) , systemd.scope (5) .

--user $XDG_CONFIG_HOME/systemd/user.control ~/.config/systemd/user.control $XDG_CONFIG_HOME ~/.config $XDG_RUNTIME_DIR/systemd/user.control $XDG_RUNTIME_DIR/systemd/transient $XDG_RUNTIME_DIR/systemd/generator.early early-dir $XDG_CONFIG_HOME/systemd/user $HOME/.config/systemd/user $XDG_CONFIG_HOME ~/.config $XDG_CONFIG_DIRS/systemd/user /etc/xdg/systemd/user $XDG_CONFIG_DIRS /etc/xdg /etc/systemd/user $XDG_RUNTIME_DIR/systemd/user /run/systemd/user $XDG_RUNTIME_DIR/systemd/generator normal-dir $XDG_DATA_HOME/systemd/user $HOME/.local/share/systemd/user $XDG_DATA_HOME ~/.local/share $XDG_DATA_DIRS/systemd/user /usr/local/share/systemd/user /usr/share/systemd/user $XDG_DATA_DIRS /usr/local/share /usr/share $dir/systemd/user $dir $XDG_DATA_DIRS $XDG_DATA_DIRS /usr/local/lib/systemd/user /usr/lib/systemd/user $XDG_RUNTIME_DIR/systemd/generator.late late-dir The set of load paths for the user manager instance may be augmented or changed using various environment variables.

For example, symlinks /etc/systemd/system/alias1.service â service1.service , /etc/systemd/system/alias2.service â /usr/lib/systemd/service1.service , /etc/systemd/system/alias3.service â /etc/systemd/system/service1.service are all valid aliases and service1.service will have four names, even if the unit file is located at /run/systemd/system/service1.service .

/etc/systemd/system/alias1.service service1.service /etc/systemd/system/alias2.service /usr/lib/systemd/service1.service /etc/systemd/system/alias3.service /etc/systemd/system/service1.service service1.service /run/systemd/system/service1.service /etc/systemd/system/link1.service ../link1_service_file link1.service /etc/systemd/link1_service_file Unit Garbage Collection Â¶ The system and service manager loads a unit's configuration automatically when a unit is referenced for the first time.

Requisite=b.service a.service RequisiteOf=a.service b.service RequisiteOf= Added in version 201.

BindsTo=b.service a.service BoundBy=a.service b.service BoundBy= Added in version 201.

PartOf=b.service a.service ConsistsOf=a.service b.service ConsistsOf= Added in version 201.

Upholds=b.service a.service UpheldBy=a.service b.service Added in version 249.

Name systemd.service â Service unit configuration Synopsis service .service service .service service Description Â¶ A unit configuration file whose name ends in " .service " encodes information about a process controlled and supervised by systemd.

.service .scope Service Templates Â¶ It is possible for systemd services to take a single argument via the " service @ argument .service " syntax.

Service unit files must include a [Service] section, which carries information about the service and the process it supervises.

_SYSTEMD_CGROUP= _SYSTEMD_SLICE= _SYSTEMD_UNIT= _SYSTEMD_USER_UNIT= _SYSTEMD_USER_SLICE= _SYSTEMD_SESSION= _SYSTEMD_OWNER_UID= The control group path in the systemd hierarchy, the systemd slice unit name, the systemd unit name, the unit name in the systemd user manager (if any), the systemd session ID (if any), and the owner UID of the systemd user unit or systemd session (if any) of the process the journal entry originates from.

## 출처
- https://www.freedesktop.org/software/systemd/man/systemd.unit.html
- https://www.freedesktop.org/software/systemd/man/systemd.service.html
- https://www.freedesktop.org/software/systemd/man/systemd.journal-fields.html

> 주의: 자동 요약 초안입니다. 정확성 검토와 편집이 필요합니다.
