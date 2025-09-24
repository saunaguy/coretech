---
title: 로드밸런서/프록시
slug: 4-4_lb_proxy
section: 4. 네트워크
duration: 75m
prereqs: [4-3_firewall_secure_access]
---

## 학습 목표
- L4/L7 로드밸런싱 개념과 헬스체크/세션유지를 설명한다.
- HAProxy/Nginx로 역방향 프록시를 구성한다.
- 캐싱/압축/WAF 배치 패턴을 이해한다.

## 핵심 개념
- TCP/HTTP 모드, sticky session, health probe 설계
- upstream/백엔드, keepalive, timeouts, retries
- 캐시 정책, WAF 위치, TLS 오프로드

## 핵심 명령/도구
- `haproxy`, `nginx`, `ab`/`wrk`, `curl -v`

## 외부 참고 요약

HTTP/3 is implemented over QUIC, itself implemented over UDP.

QUIC also provides connection migration support but currently haproxy does not support it.

All those various combinations make it desirable that HAProxy performs the splitting itself rather than leaving it to the user to write a complex or inaccurate regular expression.

HAProxy handles these messages and is able to correctly forward and skip them, and only process the next non-100 response.

Environment variables -------------------------- HAProxy's configuration supports environment variables.

Programs): * HAPROXY_LOCALPEER: defined at the startup of the process which contains the name of the local peer.

* HAPROXY_TCP_LOG_FMT: similar to HAPROXY_HTTP_LOG_FMT but for TCP log format as defined in section 8.2.2 "TCP log format".

* HAPROXY_BRANCH: contains the HAProxy branch version (such as "2.8").

- version_before( ) : returns true if the current haproxy version is strictly older than otherwise false.

nginx documentation Installing nginx Building nginx from Sources Beginner’s Guide Admin’s Guide Controlling nginx Connection processing methods Setting up hashes A debugging log Logging to syslog Configuration file measurement units Command-line parameters nginx for Windows Support for QUIC and HTTP/3 How nginx processes a request Server names Using nginx as HTTP load balancer Configuring HTTPS servers How nginx processes a TCP/UDP session Scripting with njs Chapter “nginx” in “The Architecture of Open Source Applications” Building nginx on the Win32 platform with Visual C Installing NGINX Plus AMIs on Amazon EC2 Debugging nginx with DTrace pid provider Converting rewrite rules WebSocket proxying Contributing Changes Development guide Alphabetical index of directives Alphabetical index of variables Core functionality ngx_http_core_module ngx_http_access_module ngx_http_addition_module ngx_http_api_module ngx_http_auth_basic_module ngx_http_auth_jwt_module ngx_http_auth_request_module ngx_http_auth_require_module ngx_http_autoindex_module ngx_http_browser_module ngx_http_charset_module ngx_http_dav_module ngx_http_empty_gif_module ngx_http_f4f_module ngx_http_fastcgi_module ngx_http_flv_module ngx_http_geo_module ngx_http_geoip_module ngx_http_grpc_module ngx_http_gunzip_module ngx_http_gzip_module ngx_http_gzip_static_module ngx_http_headers_module ngx_http_hls_module ngx_http_image_filter_module ngx_http_index_module ngx_http_internal_redirect_module ngx_http_js_module ngx_http_keyval_module ngx_http_limit_conn_module ngx_http_limit_req_module ngx_http_log_module ngx_http_map_module ngx_http_memcached_module ngx_http_mirror_module ngx_http_mp4_module ngx_http_oidc_module ngx_http_perl_module ngx_http_proxy_module ngx_http_proxy_protocol_vendor_module ngx_http_random_index_module ngx_http_realip_module ngx_http_referer_module ngx_http_rewrite_module ngx_http_scgi_module ngx_http_secure_link_module ngx_http_session_log_module ngx_http_slice_module ngx_http_split_clients_module ngx_http_ssi_module ngx_http_ssl_module ngx_http_status_module ngx_http_stub_status_module ngx_http_sub_module ngx_http_upstream_module ngx_http_upstream_conf_module ngx_http_upstream_hc_module ngx_http_userid_module ngx_http_uwsgi_module ngx_http_v2_module ngx_http_v3_module ngx_http_xslt_module ngx_mail_core_module ngx_mail_auth_http_module ngx_mail_proxy_module ngx_mail_realip_module ngx_mail_ssl_module ngx_mail_imap_module ngx_mail_pop3_module ngx_mail_smtp_module ngx_stream_core_module ngx_stream_access_module ngx_stream_geo_module ngx_stream_geoip_module ngx_stream_js_module ngx_stream_keyval_module ngx_stream_limit_conn_module ngx_stream_log_module ngx_stream_map_module ngx_stream_mqtt_preread_module ngx_stream_mqtt_filter_module ngx_stream_pass_module ngx_stream_proxy_module ngx_stream_proxy_protocol_vendor_module ngx_stream_realip_module ngx_stream_return_module ngx_stream_set_module ngx_stream_split_clients_module ngx_stream_ssl_module ngx_stream_ssl_preread_module ngx_stream_upstream_module ngx_stream_upstream_hc_module ngx_stream_zone_sync_module ngx_google_perftools_module ngx_mgmt_module ngx_http_acme_module ngx_otel_module

F5 NGINX Product Documentation Learn how to deliver, manage, and protect your applications using F5 NGINX products.

F5 NGINX One Console F5 NGINX Plus F5 NGINX Instance Manager F5 NGINX Ingress Controller F5 NGINX Gateway Fabric NGINX Open Source NGINX Agent Subscription licensing & solutions F5 NGINX App Protect WAF F5 NGINX App Protect DoS F5 NGINX as a Service for Azure

### 출처
- https://www.haproxy.org/download/2.8/doc/configuration.txt
- https://nginx.org/en/docs/
- https://www.nginx.com/resources/wiki/
