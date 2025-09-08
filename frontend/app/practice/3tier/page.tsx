"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Server, Database, Code, Terminal, FileText, Settings, HardDrive, GitBranch } from "lucide-react";

const NotionBlock = ({ block, blocks }) => {
  if (!block) {
    return null;
  }

  const getChildren = (blockId) => {
    return blocks.filter(b => b.parent.type === 'block_id' && b.parent.block_id === blockId);
  };

  switch (block.type) {
    case 'heading_1':
      return <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 flex items-center gap-3"><GitBranch className="h-8 w-8 text-primary" />{block.text}</h1>;
    case 'heading_2': {
      const iconMap = {
        "리눅스": <Terminal className="h-6 w-6 text-accent" />,
        "Apache": <Server className="h-6 w-6 text-accent" />,
        "Tomcat": <Server className="h-6 w-6 text-accent" />,
        "MySQL": <Database className="h-6 w-6 text-accent" />,
        "연동": <Settings className="h-6 w-6 text-accent" />,
        "심화": <HardDrive className="h-6 w-6 text-accent" />,
      };
      const headingIcon = Object.keys(iconMap).find((key) => block.text.includes(key));
      return (
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          {headingIcon ? iconMap[headingIcon] : <FileText className="h-6 w-6 text-accent" />}
          {block.text}
        </h2>
      );
    }
    case 'divider':
      return <hr className="my-6 border-dashed" />;
    case 'bulleted_list_item': {
      const bulletChildren = getChildren(block.id);
      return (
        <li className="mb-2 ml-4 list-disc">
          {block.text}
          {bulletChildren.length > 0 && (
            <ul className="pl-5 mt-2">
              {bulletChildren.map((child) => (
                <NotionBlock key={child.id} block={child} blocks={blocks} />
              ))}
            </ul>
          )}
        </li>
      );
    }
    case 'numbered_list_item': {
      const numberedChildren = getChildren(block.id);
      return (
        <li className="mb-2 ml-4 list-decimal">
          {block.text}
          {numberedChildren.length > 0 && (
            <div className="pl-5 mt-2">
              {numberedChildren.map((child) => (
                <NotionBlock key={child.id} block={child} blocks={blocks} />
              ))}
            </div>
          )}
        </li>
      );
    }
    case 'code':
      return (
        <div className="bg-gray-900 rounded-md p-4 my-4 text-white font-mono text-sm overflow-x-auto">
            <div className="flex items-center gap-2 mb-2">
                <Code className="h-4 w-4 text-yellow-400"/>
                <span className="text-gray-400">{block.language}</span>
            </div>
            <pre><code>{block.text}</code></pre>
        </div>
      );
    case 'paragraph':
        if(!block.text) return null;
      return <p className="text-muted-foreground leading-relaxed mb-4">{block.text}</p>;
    default:
      return null;
  }
};

export default function ThreeTierTestPage() {
  const notionData = notionContent; 

  const topLevelBlocks = notionData.blocks.filter(b => b.parent.type === 'page_id');

  const sections = [];
  let currentSection = null;

  topLevelBlocks.forEach(block => {
    // Skip empty top-level paragraphs to avoid default "시작하기" section
    if (block.type === 'paragraph' && !block.text) return;

    if (block.type === 'heading_1') {
        if (currentSection) sections.push(currentSection);
        currentSection = { title: block.text, icon: <BookOpen className="h-8 w-8 text-primary" />, blocks: [] };
        return;
    }
    if (block.type === 'heading_2') {
      if (currentSection) sections.push(currentSection);
      currentSection = { title: block.text, blocks: [] };
    } else {
      if (currentSection) {
        currentSection.blocks.push(block);
      }
    }
  });
  if (currentSection) sections.push(currentSection);


  return (
    <main className="container mx-auto px-4 py-8 space-y-12">
        <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-primary">3-Tier 아키텍처 실습</h1>
            <p className="text-lg text-muted-foreground">Notion의 실습 가이드를 기반으로 생성된 페이지입니다.</p>
        </div>

      {sections.map((section, index) => (
        <Card key={`${index}-${section.title}`} className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <NotionBlock block={{type: 'heading_2', text: section.title}} blocks={[]} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const content = [];
              let i = 0;
              while (i < section.blocks.length) {
                const block = section.blocks[i];
                
                if (block.type === 'bulleted_list_item') {
                  const listItems = [];
                  let j = i;
                  while (j < section.blocks.length && section.blocks[j].type === 'bulleted_list_item') {
                    listItems.push(<NotionBlock key={section.blocks[j].id} block={section.blocks[j]} blocks={notionData.blocks} />);
                    j++;
                  }
                  content.push(<ul key={`ul-${i}`} className="space-y-2 list-disc list-inside pl-4">{listItems}</ul>);
                  i = j;
                } else if (block.type === 'numbered_list_item') {
                  const listItems = [];
                  let j = i;
                  while (j < section.blocks.length && section.blocks[j].type === 'numbered_list_item') {
                    listItems.push(<NotionBlock key={section.blocks[j].id} block={section.blocks[j]} blocks={notionData.blocks} />);
                    j++;
                  }
                  content.push(<ol key={`ol-${i}`} className="space-y-2 list-decimal list-inside pl-4">{listItems}</ol>);
                  i = j;
                } else {
                  content.push(<NotionBlock key={block.id} block={block} blocks={notionData.blocks} />);
                  i++;
                }
              }
              return content;
            })()}
          </CardContent>
        </Card>
      ))}
    </main>
  );
}

const notionContent = {
    "blocks": [
    {
      "id": "26424e56-f2bd-804f-b519-fc2de6eb7f17",
      "object": "block",
      "type": "paragraph",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": ""
    },
    {
      "id": "26424e56-f2bd-8034-8aee-e9e786c98812",
      "object": "block",
      "type": "heading_1",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "📘 교육용 실습 커리큘럼 (최종 목표: Apache + Tomcat + MySQL)"
    },
    {
      "id": "error-md-insert-1",
      "object": "block",
      "type": "code",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": `
📘 교육용 실습 커리큘럼 (최종 목표: Apache + Tomcat + MySQL)

### 빌드 환경

커널 버젼    4.18.0-553.69.1.el8_10.x86_64
OS 정보     Rocky Linux release 8.10 (Green Obsidian)
아파치 버젼  Apache/2.4.37 (Rocky Linux)
톰캣 버젼    tomcat-8.5.99
DB 버젼     mysql  Ver 8.0.41 for Linux on x86_64
`,
      "language": "plain text"
    },
    { "id": "26424e56-f2bd-8025-b501-de23f8e21f88", "object": "block", "type": "divider", "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" }},
    {
      "id": "26424e56-f2bd-80f0-aa13-e8d66c4f5217",
      "object": "block",
      "type": "heading_2",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "1. 기본 지식"
    },
    {
      "id": "26424e56-f2bd-809c-af44-c02bd0b304a1",
      "object": "block",
      "type": "bulleted_list_item",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "Apache: 정적 파일(HTML, CSS, JavaScript, 이미지) 전달하는 웹 서버. 빠르고 가볍지만 동적 처리 없음"
    },
    {
      "id": "26424e56-f2bd-8022-ad00-cdf6e687dbad",
      "object": "block",
      "type": "bulleted_list_item",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "Tomcat: 동적 파일(JSP/Servlet) 처리하는 WAS. 정적도 가능하지만 주로 동적 로직 전담"
    },
    {
      "id": "error-md-insert-mysql",
      "object": "block",
      "type": "bulleted_list_item",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "MySQL: SQL 쿼리를 처리하고 저장된 데이터로 응답하는 데이터베이스 서버"
    },
    {
      "id": "26424e56-f2bd-8072-ae6b-d8f3778a1e5e",
      "object": "block",
      "type": "bulleted_list_item",
      "has_children": true,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "mod_jk (Apache ↔ Tomcat)"
    },
    {
      "id": "26424e56-f2bd-8030-ba28-e63c5e2e3eea",
      "object": "block",
      "type": "bulleted_list_item",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "26424e56-f2bd-8072-ae6b-d8f3778a1e5e" },
      "text": "Apache는 8009 포트에서 mod_jk를 통해 Tomcat과 통신"
    },
    {
      "id": "26424e56-f2bd-800a-af02-ff7b32281a78",
      "object": "block",
      "type": "bulleted_list_item",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "26424e56-f2bd-8072-ae6b-d8f3778a1e5e" },
      "text": "Tomcat은 AJP 프로토콜로 응답하여 요청을 처리"
    },
    {
      "id": "26424e56-f2bd-805c-ba42-d3157755345f",
      "object": "block",
      "type": "bulleted_list_item",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "26424e56-f2bd-8072-ae6b-d8f3778a1e5e" },
      "text": "동적 처리(jsp/servlet) 요청을 Tomcat으로 넘겨 둘의 연결성 확립"
    },
    {
      "id": "error-md-insert-jdbc",
      "object": "block",
      "type": "bulleted_list_item",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "JDBC (Java Database Connector): 자바 애플리케이션이 MySQL 같은 DB에 접근하도록 돕는 드라이버"
    },
    {
      "id": "error-md-insert-jdk",
      "object": "block",
      "type": "bulleted_list_item",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "JDK (Java Development Kit): 컴파일러, 라이브러리, JVM 포함. JSP 실행과 JDBC 사용에 필수"
    },
    { "id": "26424e56-f2bd-80b5-854a-f7bfb8208ef4", "object": "block", "type": "divider", "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" }},
    {
      "id": "26424e56-f2bd-8023-9c46-dc116fdbd034",
      "object": "block",
      "type": "heading_2",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "2. Apache 웹 서버 설치 & 테스트"
    },
    {
      "id": "26424e56-f2bd-80e7-90c2-ee2bf37d76e1",
      "object": "block",
      "type": "numbered_list_item",
      "has_children": true,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "설치 (RHEL/CentOS 계열 예시)"
    },
    {
      "id": "26424e56-f2bd-80b5-a5fb-d6d71cc97929",
      "object": "block",
      "type": "code",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "26424e56-f2bd-80e7-90c2-ee2bf37d76e1" },
      "text": "yum install -y httpd   # 또는 dnf install -y httpd\nsystemctl enable --now httpd",
      "language": "bash"
    },
    {
      "id": "26424e56-f2bd-80ba-ad06-cef8e4643cd7",
      "object": "block",
      "type": "numbered_list_item",
      "has_children": true,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "서비스 확인"
    },
    {
      "id": "26424e56-f2bd-808e-b916-dea8644f4c9f",
      "object": "block",
      "type": "code",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "26424e56-f2bd-80ba-ad06-cef8e4643cd7" },
      "text": "systemctl status httpd",
      "language": "bash"
    },
    {
      "id": "26424e56-f2bd-8063-bcdc-fd1d3e79fcf8",
      "object": "block",
      "type": "numbered_list_item",
      "has_children": true,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "테스트 페이지 수정"
    },
    {
      "id": "26424e56-f2bd-8040-9282-efa91267ef38",
      "object": "block",
      "type": "code",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "26424e56-f2bd-8063-bcdc-fd1d3e79fcf8" },
      "text": "echo '<h1>Hello Apache!</h1>' > /var/www/html/index.html",
      "language": "bash"
    },
    {
      "id": "26424e56-f2bd-803f-8670-f76c7439cc68",
      "object": "block",
      "type": "numbered_list_item",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "브라우저에서 확인 → http://localhost:80"
    },
    { "id": "26424e56-f2bd-80c4-8219-de3f20c825e4", "object": "block", "type": "divider", "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" }},
    {
      "id": "26424e56-f2bd-80dd-a099-ca8746fdfcd7",
      "object": "block",
      "type": "heading_2",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "3. Tomcat 설치"
    },
    {
      "id": "26424e56-f2bd-8050-b5fe-dd9bb916023c",
      "object": "block",
      "type": "numbered_list_item",
      "has_children": true,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "JDK 설치 & 의존성 설치"
    },
    {
      "id": "26424e56-f2bd-80d7-9917-c8015a5156c6",
      "object": "block",
      "type": "code",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "26424e56-f2bd-8050-b5fe-dd9bb916023c" },
      "text": "yum install -y java-<버전>-openjdk\nyum install -y httpd-devel gcc-c++ make libtool redhat-rpm-config",
      "language": "bash"
    },
    {
      "id": "26424e56-f2bd-8013-8765-c8098bff03c8",
      "object": "block",
      "type": "paragraph",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "26424e56-f2bd-8050-b5fe-dd9bb916023c" },
      "text": "(톰캣 버전에 맞는 JDK 버전 설치)"
    },
    {
      "id": "26424e56-f2bd-8020-bb63-fe8efac1e055",
      "object": "block",
      "type": "numbered_list_item",
      "has_children": true,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "다운로드 & 압축 해제"
    },
    {
      "id": "26424e56-f2bd-80b1-b346-cdbec3bf4c2c",
      "object": "block",
      "type": "code",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "26424e56-f2bd-8020-bb63-fe8efac1e055" },
      "text": "wget https://archive.apache.org/dist/tomcat/tomcat-8/v8.5.99/bin/apache-tomcat-8.5.99.tar.gz\ntar -xvzf apache-tomcat-8.5.99.tar.gz -C /usr/local\n\nln -s /usr/local/apache-tomcat-8.5.99 /usr/local/tomcat\n또는\nmv /usr/local/apache-tomcat-8.5.99 /usr/local/tomcat",
      "language": "bash"
    },
    {
      "id": "26424e56-f2bd-801c-b362-eaf6a95313d5",
      "object": "block",
      "type": "numbered_list_item",
      "has_children": true,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "실행"
    },
    {
      "id": "26424e56-f2bd-80f4-98da-fa533c711fd0",
      "object": "block",
      "type": "code",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "26424e56-f2bd-801c-b362-eaf6a95313d5" },
      "text": "/usr/local/tomcat/bin/startup.sh",
      "language": "bash"
    },
    {
      "id": "26424e56-f2bd-802c-a15e-c2dd9519cb65",
      "object": "block",
      "type": "numbered_list_item",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "확인 → http://localhost:8080"
    },
    { "id": "26424e56-f2bd-80ae-9914-caa02e1f0610", "object": "block", "type": "divider", "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" }},
    {
      "id": "26424e56-f2bd-806f-b149-f6218c2685c7",
      "object": "block",
      "type": "heading_2",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "4. Apache ↔ Tomcat 연동 (mod_jk 사용)"
    },
    {
      "id": "26424e56-f2bd-8008-8773-cba542c269f2",
      "object": "block",
      "type": "numbered_list_item",
      "has_children": true,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "mod_jk 빌드 및 설치"
    },
    {
      "id": "26424e56-f2bd-8026-a7ad-e121cf2130a9",
      "object": "block",
      "type": "code",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "26424e56-f2bd-8008-8773-cba542c269f2" },
      "text": "yum install -y httpd-devel gcc make libtool redhat-rpm-config   # ┌ Apache 모듈을 빌드하기 위한 패키지 설치\n                                                                # │ httpd-devel → apxs 제공 (Apache 모듈 빌드용)\n                                                                # │ gcc/make/libtool → 소스 컴파일 필수 도구\n                                                                # └ redhat-rpm-config → 빌드 환경 기본 설정\n\nwget https://archive.apache.org/dist/tomcat/tomcat-connectors/jk/tomcat-connectors-1.2.50-src.tar.gz   # Tomcat Connector(mod_jk) 소스 다운로드\n\ntar -xvzf tomcat-connectors-1.2.50-src.tar.gz                   # 압축 해제\ncd tomcat-connectors-1.2.50-src/native                          # native 디렉토리로 이동 (빌드 대상)\n\n./configure --with-apxs=/usr/bin/apxs    # Apache의 apxs 경로를 지정하여 모듈 빌드 준비\nmake && make install                     # 소스 컴파일 후 Apache 모듈 디렉토리에 mod_jk.so 설치",
      "language": "bash"
    },
    {
      "id": "26424e56-f2bd-80a3-8df3-ca8234d12d5f",
      "object": "block",
      "type": "paragraph",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "26424e56-f2bd-8008-8773-cba542c269f2" },
      "text": "👉 /usr/lib64/httpd/modules/mod_jk.so 생성 확인"
    },
    {
      "id": "26424e56-f2bd-80e2-a5b0-d95df28137b4",
      "object": "block",
      "type": "numbered_list_item",
      "has_children": true,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "Apache 설정 (/etc/httpd/conf.modules.d/10-mod_jk.conf)"
    },
    {
      "id": "26424e56-f2bd-80be-9c92-ef94e4f0ba73",
      "object": "block",
      "type": "code",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "26424e56-f2bd-80e2-a5b0-d95df28137b4" },
      "text": "LoadModule jk_module modules/mod_jk.so   # ┌ mod_jk.so 모듈을 Apache에 로드하여 Tomcat 연동 기능 활성화\n                                         # └ (Apache ↔ Tomcat 연결 다리 역할)\n\n<IfModule jk_module>\n    JkWorkersFile    conf/workers.properties   # ┌ Tomcat과 연동할 worker 정의 파일 (어떤 Tomcat, 포트 등)\n                                               # └ worker1, worker2 같은 개별 Tomcat 인스턴스 설정\n\n    JkLogFile        logs/mod_jk.log           # mod_jk 동작 로그 저장 경로\n    JkLogLevel       info                      # 로그 레벨 (debug/info/error 등)\n\n    JkMountFile      conf/uri.properties       # ┌ URL 패턴과 worker 매핑 파일\n                                               # └ 예: \"/app/*\" → worker1\n\n    JkMount          /* worker1                # 모든 요청(/*)을 worker1(Tomcat)으로 전달\n</IfModule>",
      "language": "apache"
    },
    {
      "id": "26424e56-f2bd-8047-9a65-eecea5057330",
      "object": "block",
      "type": "numbered_list_item",
      "has_children": true,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "workers.properties (/etc/httpd/conf/workers.properties)"
    },
    {
      "id": "26424e56-f2bd-8081-b7ba-d2fd0a3b67f1",
      "object": "block",
      "type": "code",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "26424e56-f2bd-8047-9a65-eecea5057330" },
      "text": "worker.list=worker1                 # ┌ 사용 가능한 worker 목록을 정의 (여기서는 worker1만 지정)\nworker.worker1.port=8009            # │ worker1이 사용할 포트 (Tomcat AJP 기본 포트)\nworker.worker1.host=localhost       # │ worker1이 동작하는 호스트 (여기선 로컬서버)\nworker.worker1.type=ajp13           # └ 연결 방식: AJP 1.3 프로토콜 사용 (Apache ↔ Tomcat 전용)",
      "language": "apache"
    },
    {
      "id": "26424e56-f2bd-80ec-b0f0-ffe3acaea432",
      "object": "block",
      "type": "numbered_list_item",
      "has_children": true,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "uri.properties (/etc/httpd/conf/uri.properties)"
    },
    {
      "id": "26424e56-f2bd-8095-b0af-f9d1bf6ab630",
      "object": "block",
      "type": "code",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "26424e56-f2bd-80ec-b0f0-ffe3acaea432" },
      "text": "/*.jsp=worker1   # ┌ 모든 .jsp 요청을 worker1(Tomcat)으로 전달\n/*.do=worker1    # └ 모든 .do 요청을 worker1(Tomcat)으로 전달",
      "language": "apache"
    },
    {
      "id": "26424e56-f2bd-802f-8036-e024e8cb39a8",
      "object": "block",
      "type": "numbered_list_item",
      "has_children": true,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "Tomcat AJP 설정 (tomcat/conf/server.xml)"
    },
    {
      "id": "26424e56-f2bd-80c8-8439-c384b4b8b230",
      "object": "block",
      "type": "code",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "26424e56-f2bd-802f-8036-e024e8cb39a8" },
      "text": "<Connector protocol=\"AJP/1.3\"            # ┌ Apache ↔ Tomcat 연결에 사용하는 AJP 프로토콜\n          address=\"0.0.0.0\"              # │ 모든 IP에서 접속 허용 (Apache 서버 포함)\n           port=\"8009\"                    # │ AJP 기본 포트 (workers.properties와 일치해야 함)\n           redirectPort=\"8443\"            # │ HTTPS(SSL)로 리다이렉트할 포트 지정\n           secretRequired=\"false\" />      # └ Tomcat 9 이후 기본값은 true → 여기선 보안을 끄고 연동 허용",
      "language": "xml"
    },
    { "id": "26424e56-f2bd-8062-a2c5-de6c31a3543e", "object": "block", "type": "divider", "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" }},
    {
      "id": "26424e56-f2bd-80d2-968f-d643c86f5a03",
      "object": "block",
      "type": "heading_2",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "5. Tomcat index 페이지 변경"
    },
    {
      "id": "26424e56-f2bd-80fb-9977-e64166bc9928",
      "object": "block",
      "type": "numbered_list_item",
      "has_children": true,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "/usr/local/tomcat/webapps/ROOT/index.jsp 수정"
    },
    {
      "id": "26424e56-f2bd-806f-a23c-c5bf39622466",
      "object": "block",
      "type": "code",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "26424e56-f2bd-80fb-9977-e64166bc9928" },
      "text": "<html><body><h1>Hello Tomcat!</h1></body></html>",
      "language": "plain text"
    },
    {
      "id": "26424e56-f2bd-8075-95cd-cb89f7b7835e",
      "object": "block",
      "type": "numbered_list_item",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "브라우저에서 확인 → http://localhost/"
    },
    { "id": "26424e56-f2bd-803e-a77f-ede425266ae8", "object": "block", "type": "divider", "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" }},
    {
      "id": "26424e56-f2bd-8013-85c5-d2f9016e0be2",
      "object": "block",
      "type": "heading_2",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "6. MySQL 설치"
    },
    {
      "id": "26424e56-f2bd-80e7-8788-f32fdf746948",
      "object": "block",
      "type": "numbered_list_item",
      "has_children": true,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "설치"
    },
    {
      "id": "26424e56-f2bd-8038-9cc7-d8d6fb1b3ad5",
      "object": "block",
      "type": "code",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "26424e56-f2bd-80e7-8788-f32fdf746948" },
      "text": "yum install -y @mysql\nsystemctl enable --now mysqld",
      "language": "bash"
    },
    {
      "id": "26424e56-f2bd-8035-accf-fc8f53b1d751",
      "object": "block",
      "type": "numbered_list_item",
      "has_children": true,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "root 비밀번호 설정"
    },
    {
      "id": "26424e56-f2bd-80db-ab95-d519301a4785",
      "object": "block",
      "type": "code",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "26424e56-f2bd-8035-accf-fc8f53b1d751" },
      "text": "mysql_secure_installation\n\n최신버전에서는 정책이 변경되어 \n8글자, 대문자, 특수문자를 포함해야한다 \n예시: Core1212!",
      "language": "bash"
    },
    {
      "id": "26424e56-f2bd-8086-b40d-f3630abeaff8",
      "object": "block",
      "type": "numbered_list_item",
      "has_children": true,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "DB 및 사용자 생성"
    },
    {
      "id": "26424e56-f2bd-80bc-a02e-ec1dd83665b7",
      "object": "block",
      "type": "code",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "26424e56-f2bd-8086-b40d-f3630abeaff8" },
      "text": "CREATE DATABASE testdb;\nCREATE USER 'tomcat'@'%' IDENTIFIED BY '1234';\nGRANT ALL PRIVILEGES ON testdb.* TO 'tomcat'@'%';\nFLUSH PRIVILEGES;",
      "language": "sql"
    },
    { "id": "26424e56-f2bd-80a5-ab57-e1ac614b2c56", "object": "block", "type": "divider", "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" }},
    {
      "id": "26424e56-f2bd-80aa-90c2-fd3e44e5cd7f",
      "object": "block",
      "type": "heading_2",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "7. Tomcat ↔ MySQL 연동 (JDBC)"
    },
    {
      "id": "26424e56-f2bd-803b-9502-d7b9078f2000",
      "object": "block",
      "type": "numbered_list_item",
      "has_children": true,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "JDBC 드라이버 다운로드 (mysql-connector-j.jar)"
    },
    {
      "id": "26424e56-f2bd-80fe-88c6-f7b84e586e8e",
      "object": "block",
      "type": "bulleted_list_item",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "26424e56-f2bd-803b-9502-d7b9078f2000" },
      "text": "/usr/local/tomcat/lib/ 에 복사"
    },
    {
      "id": "26424e56-f2bd-807f-920b-f0f74fcacc1c",
      "object": "block",
      "type": "numbered_list_item",
      "has_children": true,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "Tomcat context.xml 또는 server.xml에 DataSource 등록(등록한 DataSource를 통해 DB와 연동된다.)"
    },
    {
      "id": "26424e56-f2bd-8091-ad95-fe150478926a",
      "object": "block",
      "type": "code",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "26424e56-f2bd-807f-920b-f0f74fcacc1c" },
      "text": "<Resource name=\"jdbc/MyDB\"\n          auth=\"Container\"\n          type=\"javax.sql.DataSource\"\n          username=\"tomcat\"\n          password=\"1234\"\n          driverClassName=\"com.mysql.cj.jdbc.Driver\"\n          url=\"jdbc:mysql://<mysql IP>:3306/testdb\"\n          maxTotal=\"20\"\n          maxIdle=\"10\"\n          maxWaitMillis=\"-1\"/>",
      "language": "xml"
    },
    {
      "id": "26424e56-f2bd-80dc-ac16-f821699e89c4",
      "object": "block",
      "type": "numbered_list_item",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "JSP에서 DB 연결 테스트 코드 작성"
    },
    {
      "id": "26424e56-f2bd-803e-a580-d202f03b842a",
      "object": "block",
      "type": "numbered_list_item",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "브라우저에서 확인 → http://localhost/"
    },
    { "id": "26424e56-f2bd-803e-a77f-ede425266ae8", "object": "block", "type": "divider", "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" }},
    {
      "id": "26424e56-f2bd-80c4-a0a1-d6445c29cdfa",
      "object": "block",
      "type": "heading_1",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "🔔심화 문제"
    },
    {
      "id": "26424e56-f2bd-8008-9102-f28f8de04a4e",
      "object": "block",
      "type": "bulleted_list_item",
      "has_children": true,
      "parent": { "type": "page_id", "page_id": "26424e56-f2bd-80a2-9f07-e8d25129be67" },
      "text": "구성"
    },
    {
      "id": "26424e56-f2bd-80ef-9734-f1232440c102",
      "object": "block",
      "type": "bulleted_list_item",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "26424e56-f2bd-8008-9102-f28f8de04a4e" },
      "text": "Web (Apache) 1대 → 클라이언트 요청 처리, 로드밸런싱"
    },
    {
      "id": "26424e56-f2bd-805d-b84f-f32c494183a1",
      "object": "block",
      "type": "bulleted_list_item",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "26424e56-f2bd-8008-9102-f28f8de04a4e" },
      "text": "WAS (Tomcat) 2대 → JSP/서블릿 실행"
    },
    {
      "id": "26424e56-f2bd-8074-986f-f5bfa7b3d296",
      "object": "block",
      "type": "bulleted_list_item",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "26424e56-f2bd-8008-9102-f28f8de04a4e" },
      "text": "DB (MySQL) 1대 → 데이터 저장소"
    }
  ]
};
