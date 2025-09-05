1. 기본 지식

apache는 정적파일 (html) , 정적인 자원(HTML, CSS, JavaScript, 이미지)을 그대로 전달하는 웹 서버
빠르고 가볍지만 동적 처리 능력은 없다.

tomcat은 동적파일 (jsp), Java 기반의 애플리케이션 서버(WAS, Web Application Server)
JSP, Servlet을 실행할 수 있다. 정적 파일도 처리 가능하지만 주로 동적 로직 전담
mysql은 SQL 언어로 된 쿼리문 요청을 보고 저장된 정보와 대조 후 응답한다

mod_jk (Apache ↔ Tomcat)
Apache에 설치하는 모듈(module)이며 Apache에서 받은 요청 중 **동적 처리(jsp/servlet)**가 필요한 건 Tomcat으로 넘겨준다

Apache는 8009 포트에서 mod_jk를 통해 Tomcat과 통신
Tomcat은 AJP(8080) 프로토콜을 통해 응답
이를 통해 둘의 연결성을 확립한다


JDBC (Java Database Connector, Tomcat ↔ MySQL)
Java 라이브러리(드라이버)이다
Tomcat 같은 자바 애플리케이션이 MySQL 같은 DB에 접근할 수 있도록 도와준다

JDK (Java Development Kit)
Java 개발에 필요한 도구 모음(컴파일러, 라이브러리, JVM 포함) jsp같은 코드를 실행하려면 필요하다.
JDBC도 JDK위에서만 작동 가능하다.



위의 내용을

{
      "id": "26424e56-f2bd-80f0-aa13-e8d66c4f5217",
      "object": "block",
      "type": "heading_2",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "1. 리눅스 기초 명령어"
    },
    {
      "id": "26424e56-f2bd-809c-af44-c02bd0b304a1",
      "object": "block",
      "type": "bulleted_list_item",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "파일 탐색: ls, pwd, cd"
    },
    {
      "id": "26424e56-f2bd-8022-ad00-cdf6e687dbad",
      "object": "block",
      "type": "bulleted_list_item",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "파일/폴더 관리: touch, mkdir, rm, cp, mv"
    },
    {
      "id": "26424e56-f2bd-8072-ae6b-d8f3778a1e5e",
      "object": "block",
      "type": "bulleted_list_item",
      "has_children": true,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "편집기 사용: vim"
    },
    {
      "id": "26424e56-f2bd-8030-ba28-e63c5e2e3eea",
      "object": "block",
      "type": "bulleted_list_item",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "26424e56-f2bd-8072-ae6b-d8f3778a1e5e" },
      "text": "열기: vim filename"
    },
    {
      "id": "26424e56-f2bd-800a-af02-ff7b32281a78",
      "object": "block",
      "type": "bulleted_list_item",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "26424e56-f2bd-8072-ae6b-d8f3778a1e5e" },
      "text": "입력: i (insert 모드)"
    },
    {
      "id": "26424e56-f2bd-805c-ba42-d3157755345f",
      "object": "block",
      "type": "bulleted_list_item",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "26424e56-f2bd-8072-ae6b-d8f3778a1e5e" },
      "text": "저장: :w, 저장 후 종료: :wq, 강제 종료: :q!"
    },
    { "id": "26424e56-f2bd-80b5-854a-f7bfb8208ef4", "object": "block", "type": "divider", "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" }},

    이거대신 넣어줘.
