# 197 서버 게시판 500 오류 분석 노트

## 현상
- 게시글 작성 시 500 Internal Server Error 발생.
- 프론트 로그: `API call failed with non-JSON response` (백엔드에서 500으로 HTML 에러 텍스트를 반환했기 때문).
- 백엔드 로그 요약:
  - `sqlalchemy.exc.IntegrityError: null value in column "author_id" of relation "posts" violates not-null constraint`
  - INSERT 구문은 `posts (user_id, title, body, ...)`로 실행됨 → DB는 `author_id NOT NULL` 컬럼을 요구.

## 원인 추정 (핵심)
- 코드 모델은 `Post.user_id`를 사용(SQLAlchemy 모델 참조). 관계도 `Post.user_id -> User.id`.
- 197 서버의 실제 DB 스키마는 과거 버전(legacy)로 보이며, `posts.author_id` 컬럼이 `NOT NULL` 제약으로 남아 있음.
- 결과적으로, 애플리케이션은 `user_id`만 INSERT하고 `author_id`는 NULL → DB 제약 위반으로 실패.
- 192.168.0.12 환경에서는 SQLite 또는 최신 스키마로 동작(여기엔 `author_id`가 없거나 nullable)해서 문제가 없었던 것으로 추정.

## 왜 이런 스키마 불일치가 생겼나
- `backend/backend_src/db.py:init_db()`는 PostgreSQL 경로에서 `posts` 테이블에 여러 컬럼을 "없으면 추가"(ADD COLUMN IF NOT EXISTS)만 수행.
- 하지만 `author_id → user_id`로의 컬럼 이름 변경(또는 데이터 마이그레이션)은 수행하지 않음.
- 따라서, 기존 DB에 `author_id NOT NULL`가 남아 있는 경우, 신규 코드가 넣는 `user_id`와 공존하면서 제약 위반이 발생.

## 해결 전략 옵션
1) 권장: DB 스키마 표준화(마이그레이션)
   - 표준 키 컬럼을 `user_id`로 통일.
   - 상황별 안전한 SQL 절차:
     - 케이스 A: `author_id`만 있고 `user_id`가 없을 때
       ```sql
       ALTER TABLE posts RENAME COLUMN author_id TO user_id;
       -- 필요 시 FK 추가
       ALTER TABLE posts
         ADD CONSTRAINT posts_user_id_fkey
         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
       ```
     - 케이스 B: `author_id`와 `user_id`가 모두 있을 때
       ```sql
       -- 우선 user_id가 비어있는 행에 author_id 값을 복사
       UPDATE posts SET user_id = author_id
       WHERE user_id IS NULL AND author_id IS NOT NULL;

       -- 더 이상 사용하지 않을 author_id 제약을 완화(또는 컬럼 제거)
       ALTER TABLE posts ALTER COLUMN author_id DROP NOT NULL;
       -- 안정화 후 완전히 정리하려면 컬럼 제거(운영 절차에 맞춰 실행)
       -- ALTER TABLE posts DROP COLUMN author_id;

       -- 필요 시 FK 보완
       DO $$ BEGIN
         IF NOT EXISTS (
           SELECT 1 FROM information_schema.table_constraints
           WHERE table_name = 'posts' AND constraint_name = 'posts_user_id_fkey'
         ) THEN
           ALTER TABLE posts
             ADD CONSTRAINT posts_user_id_fkey
             FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
         END IF;
       END $$;
       ```
   - 위 작업 후 애플리케이션 코드는 변경 없이 정상 동작해야 함.

2) 임시 우회(권장하지 않음, 급한 불끄기)
   - 애플리케이션 레이어에서 `create_post` 시 `author_id`도 같이 채워 넣기(원시 SQL 또는 조건부 업데이트).
   - 또는 DB에서 `author_id`를 `NULLABLE`로 바꾸기만 하고 그대로 두기.
   - 장기적으로 스키마 통일이 필요하므로, 임시 우회는 지양.

3) 코드 측 대응(마이그레이션이 어려운 환경)
   - ORM 모델에 `author_id`를 추가하여 양쪽 컬럼을 동시 유지/세팅.
   - 이벤트 훅으로 `user_id` 세팅 시 `author_id`도 자동 세팅.
   - 다만 스키마 복잡도 증가 및 기술 부채가 커져서 권장하지 않음.

## 확인 및 적용 절차 제안
1) 현재 197 서버 DB 스키마 확인
   - `SELECT column_name, is_nullable FROM information_schema.columns WHERE table_name='posts';`
   - `\d posts` (psql)로 인덱스/제약도 확인.
2) 위 케이스 A/B에 맞춰 마이그레이션 SQL 적용(트랜잭션 권장).
3) API 재시도
   - 게시글 작성(POST /api/v1/board/posts) → 201 반환 확인.
   - 게시글 목록(GET /api/v1/board/posts) → 정상 JSON 확인.
4) 프론트 에러 해소 확인
   - 더 이상 `non-JSON response` 에러가 뜨지 않아야 함.

## 관련 파일 메모
- `backend/backend_src/routers/board.py`: INSERT 시 `Post(user_id=...)`로 동작 확인.
- `backend/backend_src/db.py`: `Post` 모델 정의는 `user_id` 기준. `init_db()` 내 Postgres 경로에 `author_id` 이관 로직은 없음.

## 결론
- 문제의 본질은 코드-DB 스키마 불일치(legacy `author_id NOT NULL` 잔존)이며, 운영 DB 마이그레이션으로 표준 컬럼(`user_id`)로 통일하는 것이 가장 깔끔하고 재발 방지에 유리함.
