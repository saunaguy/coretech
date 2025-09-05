# 📘 DNS 서버 구축 실습 정리

## 1. 도메인과 DNS 개념

우리가 평상시에 웹페이지에 접속할 때 사용하는 **google.com**, **naver.com** 같은 주소를 **도메인 이름**이라고 한다.

실제로 서버는 **IP 주소**로 통신하지만, 사람이 일일이 IP를 외우기 어렵기 때문에 **DNS(Domain Name System)** 가 도메인 이름을 IP 주소로 변환해준다.

예를 들어, 구글의 실제 IP 주소 중 하나는 `172.217.161.206` 이지만, 사용자는 보통 `google.com` 으로 접속한다.

이처럼 **IP 대신 사람이 기억하기 쉬운 도메인 이름을 사용할 수 있게 해주는 시스템이 바로 DNS**이다.

---

## 2. 실습 환경

- DNS 서버 IP : `192.168.0.69`
- 방화벽, SELinux : **비활성화**
- 사용 프로그램
    - **Bind** : 대표적인 DNS 서버 프로그램
    - **Bind-chroot(named-chroot)** : 보안 강화를 위한 chroot 실행 방식
- 버전 : 9.11.36

---

## 3. Bind 설치

```bash
dnf install bind bind-chroot bind-utils -y
systemctl start named-chroot
systemctl enable named-chroot
```

- `bind-utils` : `dig`, `nslookup` 같은 진단 유틸리티 제공

---

## 4. 기본 설정

### `/etc/named.conf`

```
options {
    version "Unknown";               # 버전 감춤 (보안 목적)
    listen-on port 53 { any; };      # 모든 IP에서 53번 포트 허용
    listen-on-v6 port 53 { ::1; };   # IPv6 로컬허용
    directory       "/var/named";    # 존 파일 저장 위치
    dump-file       "/var/named/data/cache_dump.db";
    statistics-file "/var/named/data/named_stats.txt";
    memstatistics-file "/var/named/data/named_mem_stats.txt";
    secroots-file   "/var/named/data/named.secroots";
    recursing-file  "/var/named/data/named.recursing";
    allow-query     { any; };        # 모든 클라이언트 쿼리 허용
};
```

---

## 5. 존 파일 등록

### `/etc/named.rfc1912.zones`

```
zone "example1.com" IN {
    type master;
    file "example1.com.zone";
    allow-update { none; };
};

# 역방향 (선택 사항)
zone "0.168.192.in-addr.arpa" IN {
    type master;
    file "example1.com.re";
    allow-update { none; };
};
```

---

## 6. 정방향 존 파일 예시

### `/var/named/example1.com.zone`

```
$TTL 1D
@   IN SOA example1.com. root.example1.com. (
        2025090501 ; serial       # 존 파일 버전, 변경 시 증가
        1D         ; refresh      # 슬레이브 서버가 갱신하는 주기
        1H         ; retry        # 갱신 실패 시 재시도 주기
        1W         ; expire       # 슬레이브 서버가 존 정보를 사용할 수 있는 기간
        3H )       ; minimum      # 존재하지 않는 레코드 캐시 기간

    IN NS   example1.com.       # 네임서버 지정

@   IN A    192.168.0.69      # example1.com 도메인 → IP
ns  IN A    192.168.0.69      # ns.example1.com → IP
www IN A    192.168.0.69      # www.example1.com → IP

```

**설명:**

- `@` : 현재 존의 루트 도메인 (`example1.com`)
- `NS` : 도메인을 관리하는 네임서버 지정
- `A` : 도메인 이름을 IP 주소와 매핑
- `ns`, `www` : 각각 서브도메인 이름을 IP와 연결
- 실제 접속에는 `@` 하나만 있어도 가능하지만, **관리 편의성**과 **서비스 구분, 추가를** 위해 별도로 `ns`, `www`를 정의

---

## 7. 역방향 존 파일 예시 (선택 사항)

### `/var/named/example1.com.re`

```
$TTL 1D
@   IN SOA example1.com. root.example1.com. (
        2025090501 ; serial
        1D
        1H
        1W
        3H )

    IN NS example1.com.   # 역방향 조회용 네임서버

69 IN PTR example1.com.     # IP 192.168.0.69 → 도메인 이름으로 변환

```

**설명:**

- `PTR` : IP → 도메인 이름 변환
- **역방향 조회는 선택 사항**
    - 없어도 도메인 접속에는 지장 없음
    - 메일 서버, 보안 로그 등 일부 서비스에서는 필요하거나 권장
- 하나의 IP에 여러 PTR 레코드를 두는 것은 권장되지 않음 → **1:1 매핑 권장**

💡 요약:

| 항목 | 필요 여부 | 설명 |
| --- | --- | --- |
| 정방향(A 레코드) | 필수 | 도메인 → IP 매핑, 기본 기능 |
| 역방향(PTR 레코드) | 선택 | IP → 도메인 매핑, 메일 서버/보안 용도 권장 |

---

## 8. DNS 서버 등록

클라이언트에서 DNS 서버의 IP를 기본 DNS로 설정한다.

예: `/etc/resolv.conf`

```
nameserver 192.168.0.69
```

---

## 9. 호스트 이름 설정

```bash
hostnamectl set-hostname example1.com
```

---

## 10. 테스트

- `test.com`, `dnstest.com` 존 파일 생성 후 `dig`, `nslookup` 등으로 확인
- 다른 호스트에서 도메인 요청 시 해당 IP로 변환되는 것을 확인

---

## 11. 동작 과정 이해

예: `curl naver.com` 실행 시

1. 클라이언트 → DNS 서버에 `naver.com` IP 요청 (포트 53/UDP)
2. DNS 서버 → IP 주소 응답
3. 클라이언트 → 응답받은 IP로 접속 (HTTP/80, HTTPS/443)
4. 해당 서버에서 받은 데이터를 클라이언트에 출력

# 📘 DNS ↔ 3-Tier 연동

# 1. DNS에서 3Tier에 등록 할 네임 서비스 추가

크게 2가지 방법

## 1) 기존 도메인에 서비스 추가

dns서버(192.168.0.69)에 3tier(192.168.0.84) 추가

도메인 이름은 ns.test.com

---

### 1-1) 정방향 존 파일 예시

### `/var/named/example1.com.zone`

```
$TTL 1D
@   IN SOA example1.com. root.example1.com. (
															               2025090501 ; serial
															               1D         ; refresh     
															               1H         ; retry 
															               1W         ; expire
															               3H )       ; minimum

    IN NS   example1.com.       # 네임서버 지정

@   IN A    192.168.0.69      # example1.com 도메인 → IP
ns  IN A    192.168.0.84      # ns.example1.com → IP
```

---

### 1-2) 역방향 존 파일 예시 (선택 사항)

### `/var/named/example1.com.re`

```
$TTL 1D
@   IN SOA example1.com. root.example1.com. (
 				  														        2025090501 ; serial
          														        1D
          														        1H
          														        1W
         	  													        3H )

    IN NS example1.com.   # 역방향 조회용 네임서버

69 IN PTR example1.com.     # IP 192.168.0.69 → 도메인 이름으로 변환
84 IN PTR ns.example1.com.
```

**설명:**

- 기존 도메인(`example1.com`)을 유지하면서 **서브도메인**을 만들어 연결
- 이미 만들어진 존 파일에 A 레코드 추가

✅ 특징

- 기존 도메인을 그대로 유지하면서 서비스 확장 가능
- 서버 추가, Web/App/Tomcat 등 여러 서비스 연결 시 활용
- PTR 레코드나 호스트네임 관리는 기존 도메인과 연계

---

## 2) 새로운 도메인으로 만드는 법(예: test.com)

### 2-1) 존 파일에 등록

`/etc/named.rfc1912.zones`

```bash
zone "example1.com" IN {
    type master;
    file "example1.com.zone";
    allow-update { none; };
};

zone "0.168.192.in-addr.arpa" IN {
    type master;
    file "example1.com.re";
    allow-update { none; };
};

## 추가한 도메인 ##
zone "test.com" IN {
    type master;
    file "test.com.zone";
    allow-update { none; };
};
```

### 2-2) 존 파일 생성

`/var/named/test.com.zone`

```bash
$TTL 1D
@   IN SOA test.com. root.example1.com. (
															               2025090501 ; serial
															               1D         ; refresh     
															               1H         ; retry 
															               1W         ; expire
															               3H )       ; minimum
    IN NS   test.com.       # 네임서버 지정
@   IN A    192.168.0.84     # test.com 도메인 → IP

```

**설명:**

- 기존 도메인과 상관없이 **완전히 새로 독립된 도메인**을 만든 경우
- DNS 서버에서 **새 존 파일(zone file)** 생성

✅ 특징

- 기존 example1.com과 독립
- 네임서버, IP, 서비스 모두 새로 정의

---

# 2. 3Tier 서버 설정

3Tier에서 도메인 서버를 검색할 수 있게 변경

`/etc/resolv.conf`

```bash
search ns.example1.com 또는 test.com
nameserver 192.168.0.84
```

---

## 이제 curl이나 nslookup을 통해 잘 연결되었는지 확인