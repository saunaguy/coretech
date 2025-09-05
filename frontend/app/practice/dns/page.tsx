'use client';

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
    case 'heading_2':
        const iconMap = {
            "DNS": <Terminal className="h-6 w-6 text-accent" />,
            "실습": <Server className="h-6 w-6 text-accent" />,
            "Bind": <Database className="h-6 w-6 text-accent" />,
            "설정": <Settings className="h-6 w-6 text-accent" />,
            "연동": <HardDrive className="h-6 w-6 text-accent" />,
        };
        const headingIcon = Object.keys(iconMap).find(key => block.text.includes(key));
      return <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">{headingIcon ? iconMap[headingIcon] : <FileText className="h-6 w-6 text-accent" />}{block.text}</h2>;
    case 'divider':
      return <hr className="my-6 border-dashed" />;
    case 'bulleted_list_item':
      const bulletChildren = getChildren(block.id);
      return (
        <li className="mb-2 ml-4 list-disc">
          <span dangerouslySetInnerHTML={{ __html: block.text }}></span>
          {bulletChildren.length > 0 && (
            <ul className="pl-5 mt-2">
              {bulletChildren.map(child => <NotionBlock key={child.id} block={child} blocks={blocks} />)}
            </ul>
          )}
        </li>
      );
    case 'numbered_list_item':
      const numberedChildren = getChildren(block.id);
      return (
        <li className="mb-2 ml-4 list-decimal">
          {block.text}
          {numberedChildren.length > 0 && (
            <div className="pl-5 mt-2">
              {numberedChildren.map(child => <NotionBlock key={child.id} block={child} blocks={blocks} />)}
            </div>
          )}
        </li>
      );
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
      return <p className="text-muted-foreground leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: block.text }}></p>;
    default:
      return null;
  }
};

export default function DnsPage() {
  const notionData = notionContent; 

  const topLevelBlocks = notionData.blocks.filter(b => b.parent.type === 'page_id');

  const sections = [];
  let currentSection = null;

  topLevelBlocks.forEach(block => {
    if (block.type === 'heading_1') {
        if (currentSection) sections.push(currentSection);
        currentSection = { title: block.text, icon: <BookOpen className="h-8 w-8 text-primary" />, blocks: [block] };
        return;
    }
    if (block.type === 'heading_2') {
      if (currentSection) sections.push(currentSection);
      currentSection = { title: block.text, blocks: [block] };
    } else {
      if (!currentSection) {
        currentSection = { title: "시작하기", blocks: [] };
      }
      currentSection.blocks.push(block);
    }
  });
  if (currentSection) sections.push(currentSection);


  return (
    <main className="container mx-auto px-4 py-8 space-y-12">
        <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-primary">DNS 서버 구축 실습</h1>
            <p className="text-lg text-muted-foreground">Notion의 실습 가이드를 기반으로 생성된 페이지입니다.</p>
        </div>

      {sections.map((section, index) => (
        <Card key={index} className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <NotionBlock block={{type: 'heading_2', text: section.title}} blocks={[]} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {section.blocks
              .filter(block => block.type !== 'heading_1' && block.type !== 'heading_2')
              .map(block => {
                if (block.type === 'bulleted_list_item') {
                    return <ul className="space-y-2"><NotionBlock key={block.id} block={block} blocks={notionData.blocks} /></ul>
                }
                if (block.type === 'numbered_list_item') {
                    return <ol className="space-y-2"><NotionBlock key={block.id} block={block} blocks={notionData.blocks} /> </ol>
                }
                return <NotionBlock key={block.id} block={block} blocks={notionData.blocks} />
              })}
          </CardContent>
        </Card>
      ))}
    </main>
  );
}

const notionContent = {
    "blocks": [
        {
            "id": "1",
            "object": "block",
            "type": "heading_1",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "📘 DNS 서버 구축 실습 정리"
        },
        {
            "id": "2",
            "object": "block",
            "type": "heading_2",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "1. 도메인과 DNS 개념"
        },
        {
            "id": "3",
            "object": "block",
            "type": "paragraph",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "우리가 평상시에 웹페이지에 접속할 때 사용하는 <strong>google.com</strong>, <strong>naver.com</strong> 같은 주소를 <strong>도메인 이름</strong>이라고 한다."
        },
        {
            "id": "4",
            "object": "block",
            "type": "paragraph",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "실제로 서버는 <strong>IP 주소</strong>로 통신하지만, 사람이 일일이 IP를 외우기 어렵기 때문에 <strong>DNS(Domain Name System)</strong> 가 도메인 이름을 IP 주소로 변환해준다."
        },
        {
            "id": "5",
            "object": "block",
            "type": "paragraph",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "예를 들어, 구글의 실제 IP 주소 중 하나는 <code>172.217.161.206</code> 이지만, 사용자는 보통 <code>google.com</code> 으로 접속한다."
        },
        {
            "id": "6",
            "object": "block",
            "type": "paragraph",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "이처럼 <strong>IP 대신 사람이 기억하기 쉬운 도메인 이름을 사용할 수 있게 해주는 시스템이 바로 DNS</strong>이다."
        },
        {
            "id": "7",
            "object": "block",
            "type": "heading_2",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "2. 실습 환경"
        },
        {
            "id": "8",
            "object": "block",
            "type": "bulleted_list_item",
            "has_children": true,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "DNS 서버 IP : <code>192.168.0.69</code>"
        },
        {
            "id": "9",
            "object": "block",
            "type": "bulleted_list_item",
            "has_children": false,
            "parent": { "type": "block_id", "block_id": "8" },
            "text": "방화벽, SELinux : <strong>비활성화</strong>"
        },
        {
            "id": "10",
            "object": "block",
            "type": "bulleted_list_item",
            "has_children": true,
            "parent": { "type": "block_id", "block_id": "8" },
            "text": "사용 프로그램"
        },
        {
            "id": "11",
            "object": "block",
            "type": "bulleted_list_item",
            "has_children": false,
            "parent": { "type": "block_id", "block_id": "10" },
            "text": "<strong>Bind</strong> : 대표적인 DNS 서버 프로그램"
        },
        {
            "id": "12",
            "object": "block",
            "type": "bulleted_list_item",
            "has_children": false,
            "parent": { "type": "block_id", "block_id": "10" },
            "text": "<strong>Bind-chroot(named-chroot)</strong> : 보안 강화를 위한 chroot 실행 방식"
        },
        {
            "id": "13",
            "object": "block",
            "type": "bulleted_list_item",
            "has_children": false,
            "parent": { "type": "block_id", "block_id": "8" },
            "text": "버전 : 9.11.36"
        },
        {
            "id": "14",
            "object": "block",
            "type": "heading_2",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "3. Bind 설치"
        },
        {
            "id": "15",
            "object": "block",
            "type": "code",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "dnf install bind bind-chroot bind-utils -y\nsystemctl start named-chroot\nsystemctl enable named-chroot",
            "language": "bash"
        },
        {
            "id": "16",
            "object": "block",
            "type": "paragraph",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "<code>bind-utils</code> : <code>dig</code>, <code>nslookup</code> 같은 진단 유틸리티 제공"
        },
        {
            "id": "17",
            "object": "block",
            "type": "heading_2",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "4. 기본 설정"
        },
        {
            "id": "18",
            "object": "block",
            "type": "paragraph",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "/etc/named.conf"
        },
        {
            "id": "19",
            "object": "block",
            "type": "code",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "options {\n    version \"Unknown\";               # 버전 감춤 (보안 목적)\n    listen-on port 53 { any; };      # 모든 IP에서 53번 포트 허용\n    listen-on-v6 port 53 { ::1; };   # IPv6 로컬허용\n    directory       \"/var/named\";    # 존 파일 저장 위치\n    dump-file       \"/var/named/data/cache_dump.db\";\n    statistics-file \"/var/named/data/named_stats.txt\";\n    memstatistics-file \"/var/named/data/named_mem_stats.txt\";\n    secroots-file   \"/var/named/data/named.secroots\";\n    recursing-file  \"/var/named/data/named.recursing\";\n    allow-query     { any; };        # 모든 클라이언트 쿼리 허용\n};",
            "language": "bash"
        },
        {
            "id": "20",
            "object": "block",
            "type": "heading_2",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "5. 존 파일 등록"
        },
        {
            "id": "21",
            "object": "block",
            "type": "paragraph",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "/etc/named.rfc1912.zones"
        },
        {
            "id": "22",
            "object": "block",
            "type": "code",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "zone \"example1.com\" IN {\n    type master;\n    file \"example1.com.zone\";\n    allow-update { none; };\n};\n\n# 역방향 (선택 사항)\nzone \"0.168.192.in-addr.arpa\" IN {\n    type master;\n    file \"example1.com.re\";\n    allow-update { none; };\n};",
            "language": "bash"
        },
        {
            "id": "23",
            "object": "block",
            "type": "heading_2",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "6. 정방향 존 파일 예시"
        },
        {
            "id": "24",
            "object": "block",
            "type": "paragraph",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "/var/named/example1.com.zone"
        },
        {
            "id": "25",
            "object": "block",
            "type": "code",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "$TTL 1D\n@   IN SOA example1.com. root.example1.com. (\n        2025090501 ; serial       # 존 파일 버전, 변경 시 증가\n        1D         ; refresh      # 슬레이브 서버가 갱신하는 주기\n        1H         ; retry        # 갱신 실패 시 재시도 주기\n        1W         ; expire       # 슬레이브 서버가 존 정보를 사용할 수 있는 기간\n        3H )       ; minimum      # 존재하지 않는 레코드 캐시 기간\n\n    IN NS   example1.com.       # 네임서버 지정\n\n@   IN A    192.168.0.69      # example1.com 도메인 → IP\nns  IN A    192.168.0.69      # ns.example1.com → IP\nwww IN A    192.168.0.69      # www.example1.com → IP",
            "language": "bash"
        },
        {
            "id": "26",
            "object": "block",
            "type": "bulleted_list_item",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "<code>@</code> : 현재 존의 루트 도메인 (<code>example1.com</code>)"
        },
        {
            "id": "27",
            "object": "block",
            "type": "bulleted_list_item",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "<code>NS</code> : 도메인을 관리하는 네임서버 지정"
        },
        {
            "id": "28",
            "object": "block",
            "type": "bulleted_list_item",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "<code>A</code> : 도메인 이름을 IP 주소와 매핑 (예: <code>www</code>)"
        },
        {
            "id": "29",
            "object": "block",
            "type": "heading_2",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "7. 역방향 존 파일 예시 (선택 사항)"
        },
        {
            "id": "30",
            "object": "block",
            "type": "paragraph",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "/var/named/example1.com.re"
        },
        {
            "id": "31",
            "object": "block",
            "type": "code",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "$TTL 1D\n@   IN SOA example1.com. root.example1.com. (\n        2025090501 ; serial\n        1D\n        1H\n        1W\n        3H )\n\n    IN NS example1.com.   # 역방향 조회용 네임서버\n\n69 IN PTR example1.com.     # IP 192.168.0.69 → 도메인 이름으로 변환",
            "language": "bash"
        },
        {
            "id": "32",
            "object": "block",
            "type": "bulleted_list_item",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "<code>PTR</code> : IP → 도메인 이름 변환 (선택)"
        },
        {
            "id": "33",
            "object": "block",
            "type": "bulleted_list_item",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "메일 서버/보안 로그 등 일부 서비스에서 권장"
        },
        {
            "id": "34",
            "object": "block",
            "type": "bulleted_list_item",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "하나의 IP에 여러 PTR 레코드보다는 1:1 매핑 권장"
        },
        {
            "id": "35",
            "object": "block",
            "type": "heading_2",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "8. DNS 서버 등록"
        },
        {
            "id": "36",
            "object": "block",
            "type": "paragraph",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "클라이언트에서 DNS 서버의 IP를 기본 DNS로 설정 (예: <code>/etc/resolv.conf</code>)"
        },
        {
            "id": "37",
            "object": "block",
            "type": "code",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "nameserver 192.168.0.69",
            "language": "bash"
        },
        {
            "id": "38",
            "object": "block",
            "type": "heading_2",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "9. 호스트 이름 설정"
        },
        {
            "id": "39",
            "object": "block",
            "type": "code",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "hostnamectl set-hostname example1.com",
            "language": "bash"
        },
        {
            "id": "40",
            "object": "block",
            "type": "heading_2",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "10. 테스트"
        },
        {
            "id": "41",
            "object": "block",
            "type": "bulleted_list_item",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "<code>test.com</code>, <code>dnstest.com</code> 존 파일 생성 후 <code>dig</code>, <code>nslookup</code>으로 확인"
        },
        {
            "id": "42",
            "object": "block",
            "type": "bulleted_list_item",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "다른 호스트에서 도메인 요청 시 해당 IP로 변환되는지 확인"
        },
        {
            "id": "43",
            "object": "block",
            "type": "heading_2",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "11. 동작 과정 이해"
        },
        {
            "id": "44",
            "object": "block",
            "type": "paragraph",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "예: <code>curl naver.com</code> 실행 시"
        },
        {
            "id": "45",
            "object": "block",
            "type": "numbered_list_item",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "클라이언트 → DNS 서버에 <code>naver.com</code> IP 요청 (포트 53/UDP)"
        },
        {
            "id": "46",
            "object": "block",
            "type": "numbered_list_item",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "DNS 서버 → IP 주소 응답"
        },
        {
            "id": "47",
            "object": "block",
            "type": "numbered_list_item",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "클라이언트 → 응답받은 IP로 접속 (HTTP/80, HTTPS/443)"
        },
        {
            "id": "48",
            "object": "block",
            "type": "numbered_list_item",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "서버 응답 데이터 수신 후 출력"
        },
        {
            "id": "49",
            "object": "block",
            "type": "heading_2",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "DNS ↔ 3-Tier 연동"
        },
        {
            "id": "50",
            "object": "block",
            "type": "heading_2",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "1) 기존 도메인에 서비스 추가 (예: ns.example1.com)"
        },
        {
            "id": "51",
            "object": "block",
            "type": "paragraph",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "<code>example1.com</code> 존 파일에 3Tier 서버(<code>192.168.0.84</code>)를 서브도메인으로 추가"
        },
        {
            "id": "52",
            "object": "block",
            "type": "paragraph",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "/var/named/example1.com.zone"
        },
        {
            "id": "53",
            "object": "block",
            "type": "code",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "$TTL 1D\n@   IN SOA example1.com. root.example1.com. (\n        2025090501 ; serial\n        1D\n        1H\n        1W\n        3H )\n\n    IN NS   example1.com.\n\n@   IN A    192.168.0.69\nns  IN A    192.168.0.84",
            "language": "bash"
        },
        {
            "id": "54",
            "object": "block",
            "type": "paragraph",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "/var/named/example1.com.re (선택)"
        },
        {
            "id": "55",
            "object": "block",
            "type": "code",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "$TTL 1D\n@   IN SOA example1.com. root.example1.com. (\n        2025090501 ; serial\n        1D\n        1H\n        1W\n        3H )\n\n    IN NS example1.com.\n\n69 IN PTR example1.com.\n84 IN PTR ns.example1.com.",
            "language": "bash"
        },
        {
            "id": "56",
            "object": "block",
            "type": "bulleted_list_item",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "기존 도메인을 유지하면서 서브도메인으로 서비스 확장"
        },
        {
            "id": "57",
            "object": "block",
            "type": "heading_2",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "2) 새로운 도메인 추가 (예: test.com)"
        },
        {
            "id": "58",
            "object": "block",
            "type": "paragraph",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "/etc/named.rfc1912.zones"
        },
        {
            "id": "59",
            "object": "block",
            "type": "code",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "zone \"test.com\" IN {\n    type master;\n    file \"test.com.zone\";\n    allow-update { none; };\n};",
            "language": "bash"
        },
        {
            "id": "60",
            "object": "block",
            "type": "paragraph",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "/var/named/test.com.zone"
        },
        {
            "id": "61",
            "object": "block",
            "type": "code",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "$TTL 1D\n@   IN SOA test.com. root.example1.com. (\n        2025090501 ; serial\n        1D         ; refresh\n        1H         ; retry\n        1W         ; expire\n        3H )       ; minimum\n    IN NS   test.com.\n@   IN A    192.168.0.84",
            "language": "bash"
        },
        {
            "id": "62",
            "object": "block",
            "type": "bulleted_list_item",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "기존 도메인과 독립적으로 새 도메인 서비스 구성"
        },
        {
            "id": "63",
            "object": "block",
            "type": "heading_2",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "3) 3Tier 서버에서 DNS 사용 설정"
        },
        {
            "id": "64",
            "object": "block",
            "type": "paragraph",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "도메인 검색 도메인과 DNS 서버를 지정 (<code>/etc/resolv.conf</code>)"
        },
        {
            "id": "65",
            "object": "block",
            "type": "code",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "search ns.example1.com 또는 test.com\nnameserver 192.168.0.84",
            "language": "bash"
        },
        {
            "id": "66",
            "object": "block",
            "type": "paragraph",
            "has_children": false,
            "parent": { "type": "page_id", "page_id": "dns-page" },
            "text": "이제 <code>curl</code>이나 <code>nslookup</code>으로 연결 확인"
        }
    ]
};
