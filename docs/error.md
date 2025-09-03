INFO:     172.22.0.1:58230 - "OPTIONS /api/v1/board/posts HTTP/1.1" 400 Bad Request

INFO:     172.22.0.1:58230 - "OPTIONS /api/v1/board/posts HTTP/1.1" 400 Bad Request

INFO:     172.22.0.1:58230 - "OPTIONS /api/v1/board/posts HTTP/1.1" 400 Bad Request

INFO:     172.22.0.1:58230 - "OPTIONS /api/v1/board/posts HTTP/1.1" 400 Bad Request

INFO:     172.22.0.1:58230 - "OPTIONS /api/v1/board/posts HTTP/1.1" 400 Bad Request

INFO:     172.22.0.4:60250 - "GET /api/v1/qna/questions HTTP/1.1" 200 OK

INFO:     172.22.0.1:41796 - "OPTIONS /api/v1/qna/questions HTTP/1.1" 400 Bad Request

INFO:     172.22.0.1:41796 - "OPTIONS /api/v1/qna/questions HTTP/1.1" 400 Bad Request

INFO:     172.22.0.1:41796 - "OPTIONS /api/v1/qna/questions HTTP/1.1" 400 Bad Request

INFO:     172.22.0.4:55942 - "GET /api/v1/qna/questions HTTP/1.1" 200 OK




/usr/local/bin/docker-entrypoint.sh: ignoring /docker-entrypoint-initdb.d/*


waiting for server to shut down....2025-09-03 02:00:38.775 UTC [41] LOG:  received fast shutdown request

2025-09-03 02:00:38.789 UTC [41] LOG:  aborting any active transactions

2025-09-03 02:00:38.791 UTC [41] LOG:  background worker "logical replication launcher" (PID 47) exited with exit code 1

2025-09-03 02:00:38.792 UTC [42] LOG:  shutting down

2025-09-03 02:00:38.803 UTC [42] LOG:  checkpoint starting: shutdown immediate

2025-09-03 02:00:38.989 UTC [42] LOG:  checkpoint complete: wrote 926 buffers (5.7%); 0 WAL file(s) added, 0 removed, 0 recycled; write=0.049 s, sync=0.085 s, total=0.198 s; sync files=301, longest=0.025 s, average=0.001 s; distance=4272 kB, estimate=4272 kB; lsn=0/191E928, redo lsn=0/191E928

2025-09-03 02:00:38.998 UTC [41] LOG:  database system is shut down

 done

server stopped


PostgreSQL init process complete; ready for start up.


2025-09-03 02:00:39.122 UTC [1] LOG:  starting PostgreSQL 16.10 on x86_64-pc-linux-musl, compiled by gcc (Alpine 14.2.0) 14.2.0, 64-bit

2025-09-03 02:00:39.122 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432

2025-09-03 02:00:39.122 UTC [1] LOG:  listening on IPv6 address "::", port 5432

2025-09-03 02:00:39.152 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"

2025-09-03 02:00:39.182 UTC [57] LOG:  database system was shut down at 2025-09-03 02:00:38 UTC

2025-09-03 02:00:39.198 UTC [1] LOG:  database system is ready to accept connections

2025-09-03 02:03:17.818 UTC [175] LOG:  invalid length of startup packet

2025-09-03 02:03:18.874 UTC [176] LOG:  invalid length of startup packet

2025-09-03 02:03:18.877 UTC [184] LOG:  invalid length of startup packet

2025-09-03 02:03:18.883 UTC [185] LOG:  invalid length of startup packet

2025-09-03 02:03:23.923 UTC [187] LOG:  invalid length of startup packet

2025-09-03 02:03:23.929 UTC [186] LOG:  invalid length of startup packet

2025-09-03 02:03:23.935 UTC [188] LOG:  invalid length of startup packet

2025-09-03 02:03:53.968 UTC [212] LOG:  invalid length of startup packet

2025-09-03 02:03:53.972 UTC [213] LOG:  invalid length of startup packet

2025-09-03 02:03:53.982 UTC [214] LOG:  invalid length of startup packet

2025-09-03 02:04:18.192 UTC [1] LOG:  received fast shutdown request

2025-09-03 02:04:18.208 UTC [1] LOG:  aborting any active transactions

2025-09-03 02:04:18.211 UTC [1] LOG:  background worker "logical replication launcher" (PID 60) exited with exit code 1

2025-09-03 02:04:18.211 UTC [55] LOG:  shutting down

2025-09-03 02:04:18.228 UTC [55] LOG:  checkpoint starting: shutdown immediate

2025-09-03 02:04:18.371 UTC [55] LOG:  checkpoint complete: wrote 123 buffers (0.8%); 0 WAL file(s) added, 0 removed, 0 recycled; write=0.031 s, sync=0.056 s, total=0.160 s; sync files=83, longest=0.014 s, average=0.001 s; distance=579 kB, estimate=579 kB; lsn=0/19AF548, redo lsn=0/19AF548

2025-09-03 02:04:18.386 UTC [1] LOG:  database system is shut down


PostgreSQL Database directory appears to contain a database; Skipping initialization


2025-09-03 02:04:19.391 UTC [1] LOG:  starting PostgreSQL 16.10 on x86_64-pc-linux-musl, compiled by gcc (Alpine 14.2.0) 14.2.0, 64-bit