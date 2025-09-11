"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Code, Terminal, FileText, Settings, Server, Mail, Network } from "lucide-react";

const versionTableData = {
  headers: ["서버", "도메인", "호스트네임", "IP", "역할"],
  rows: [
    ["test1", "test1.com", "mail.test1.com", "192.168.0.61", "수신+발신 (sendmail+dovecot)"],
    ["test2", "test2.com", "mail.test2.com", "192.168.0.62", "수신+발신 (sendmail+dovecot)"],
  ],
};

const descriptionTableData = {
    headers: ["설정 항목", "설명"],
    rows: [
        ["`local-host-names`", "수신할 도메인/호스트를 정의, 없으면 외부에서 메일 못 받음"],
        ["`access`", "IP, 도메인별 relay 권한 설정 (RELAY/REJECT/DISCARD/OK)"],
        ["`sendmail.mc → sendmail.cf`", "mc에서 설정 후 m4로 cf 생성. cf 직접 수정하지 않음"],
        ["`DAEMON_OPTIONS`", "SMTP 수신 포트/주소 설정. 127.0.0.1만 되면 외부 접속 불가, Addr 생략 시 전체 허용"],
        ["`MAILER(smtp)`", "SMTP를 통한 메일 발신/수신 활성화"],
        ["`MAILER(procmail)`", "로컬 배달 활성화 (메일박스에 저장)"],
        ["`dovecot mail_location`", "수신 메일이 저장되는 위치 지정"],
        ["`disable_plaintext_auth`", "평문 인증 허용 여부 (실습용 yes/no)"],
    ]
}

const NotionBlock = ({ block, blocks }) => {
  if (!block) {
    return null;
  }

  const getChildren = (blockId) => {
    return blocks.filter(b => b.parent.type === 'block_id' && b.parent.block_id === blockId);
  };

  switch (block.type) {
    case 'heading_1':
      return <h1 className="text-2xl font-semibold mb-4 flex items-center gap-2"><Mail className="h-6 w-6 text-primary" />{block.text}</h1>;
    case 'heading_2': {
      const iconMap = {
        "DNS": <Network className="h-6 w-6 text-accent" />,
        "서버": <Server className="h-6 w-6 text-accent" />,
        "Sendmail": <Mail className="h-6 w-6 text-accent" />,
        "Dovecot": <Mail className="h-6 w-6 text-accent" />,
        "설명": <FileText className="h-6 w-6 text-accent" />,
        "구조": <Settings className="h-6 w-6 text-accent" />,
      };
      const headingIcon = Object.keys(iconMap).find((key) => block.text.includes(key));
      return (
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          {headingIcon ? iconMap[headingIcon] : <Terminal className="h-6 w-6 text-accent" />}
          {block.text}
        </h2>
      );
    }
    case 'heading_3':
        return <h3 className="text-xl font-semibold mt-6 mb-3">{block.text}</h3>
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
    case 'quote':
        return (
            <blockquote className="mt-6 border-l-2 pl-6 italic text-muted-foreground">
                {block.text}
            </blockquote>
        )
    case 'paragraph':
        if(!block.text) return null;
      return <p className="text-muted-foreground leading-relaxed mb-4">{block.text}</p>;
    default:
      return null;
  }
};

export default function MailServerPage() {
  const notionData = notionContent; 

  const topLevelBlocks = notionData.blocks.filter(b => b.parent.type === 'page_id');

  const sections = [];
  let currentSection = null;

  topLevelBlocks.forEach(block => {
    if (block.type === 'heading_1' || block.type === 'heading_2') {
        if (currentSection) sections.push(currentSection);
        currentSection = { title: block.text, blocks: [block] };
    } else {
      if (!currentSection) {
        currentSection = { title: "메일 서버 설정", blocks: [] };
      }
      currentSection.blocks.push(block);
    }
  });
  if (currentSection) sections.push(currentSection);


  return (
    <main className="container mx-auto px-4 py-8 space-y-12">
        <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-primary">Mail 서버 구축 실습</h1>
            <p className="text-lg text-muted-foreground">Notion의 실습 가이드를 기반으로 생성된 페이지입니다.</p>
        </div>

      

        {sections.map((section, index) => {
            const isVersionTable = section.title === "📘 2개의 메일 서버 (수발신 모두 가능)";
            const isDescriptionTable = section.title === "5️⃣ 설명 (교육용)";

            const CardContentComponent = isVersionTable ? (
                <Table>
                    <TableHeader>
                        <TableRow>{versionTableData.headers.map(h => <TableHead key={h}>{h}</TableHead>)}</TableRow>
                    </TableHeader>
                    <TableBody>
                        {versionTableData.rows.map((r, i) => <TableRow key={i}>{r.map((c, j) => <TableCell key={j}>{c}</TableCell>)}</TableRow>)}
                    </TableBody>
                </Table>
            ) : isDescriptionTable ? (
                <Table>
                    <TableHeader>
                        <TableRow>{descriptionTableData.headers.map(h => <TableHead key={h}>{h}</TableHead>)}</TableRow>
                    </TableHeader>
                    <TableBody>
                        {descriptionTableData.rows.map((r, i) => <TableRow key={i}>{r.map((c, j) => <TableCell key={j}>{c}</TableCell>)}</TableRow>)}
                    </TableBody>
                </Table>
            ) : (
                section.blocks
                    .filter(block => block.type !== 'heading_1' && block.type !== 'heading_2')
                    .map(block => <NotionBlock key={block.id} block={block} blocks={notionData.blocks} />)
            );

            return (
                <Card key={index} className="hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold flex items-center gap-3">
                            <NotionBlock block={{type: isVersionTable ? 'heading_1' : 'heading_2', text: section.title}} blocks={[]} />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {CardContentComponent}
                    </CardContent>
                </Card>
            );
        })}
    </main>
  );
}

const notionContent = {
    "blocks": [
    {
      "id": "26a24e56-f2bd-801a-a213-e2d8b423859a",
      "object": "block",
      "type": "heading_1",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "📘 2개의 메일 서버 (수발신 모두 가능)"
    },
    {
      "id": "26a24e56-f2bd-8090-9208-c3648b0bca9c",
      "object": "block",
      "type": "heading_2",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "1️⃣ DNS 서버 설정"
    },
    {
      "id": "26a24e56-f2bd-8063-825f-ce64e6ea3976",
      "object": "block",
      "type": "heading_3",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "/var/named/test1.com.zone"
    },
    {
      "id": "26a24e56-f2bd-800c-937f-ee14c586bdde",
      "object": "block",
      "type": "code",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "$TTL 1D\n@       IN      SOA     ns.test1.com. root.test1.com. (\n                                                       2025091001 ; serial\n                                                       1H ; refresh\n                                                       10M ; retry\n                                                       1D ; expire\n                                                       3H ) ; minimum\n \n        IN      NS      ns.test1.com.\n        IN      MX 10   mail.test1.com.   ; 메일 서버 우선순위 (숫자가 낮을수록 우선)\n\nns      IN      A       192.168.0.40   ; DNS 서버 IP\nmail    IN      A       192.168.0.61   ; test1 메일 서버 IP\n",
      "language": "plain text"
    },
    {
      "id": "26a24e56-f2bd-80d3-a567-eafeddf3ffdb",
      "object": "block",
      "type": "heading_3",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "/var/named/test2.com.zone"
    },
    {
      "id": "26a24e56-f2bd-802f-ac76-c3de4c5a4e21",
      "object": "block",
      "type": "code",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "$TTL 1D\n@       IN      SOA     ns.test2.com. root.test2.com. (\n                                                       2025091001 ; serial\n                                                       1H ; refresh\n                                                       10M ; retry\n                                                       1D ; expire\n                                                       3H ) ; minimum\n \n        IN      NS      ns.test2.com.\n        IN      MX 10   mail.test2.com.   ; 메일 서버 우선순위\n\nns      IN      A       192.168.0.40   ; DNS 서버 IP\nmail    IN      A       192.168.0.62   ; test2 메일 서버 IP\n",
      "language": "plain text"
    },
    {
      "id": "26a24e56-f2bd-80c2-bc48-e05e34c0d15f",
      "object": "block",
      "type": "heading_2",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "2️⃣ 서버 기본 설정"
    },
    {
      "id": "26a24e56-f2bd-80ca-9481-ce7e7399a1f1",
      "object": "block",
      "type": "heading_3",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "/etc/hostname"
    },
    {
      "id": "26a24e56-f2bd-80d3-9224-ec750b27ae00",
      "object": "block",
      "type": "code",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "mail.test1.com   # test1 서버\nmail.test2.com   # test2 서버",
      "language": "bash"
    },
    {
      "id": "26a24e56-f2bd-800b-a592-ffe90ab7e52e",
      "object": "block",
      "type": "heading_3",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "/etc/hosts"
    },
    {
      "id": "26a24e56-f2bd-8016-baf2-f08f6fc32c18",
      "object": "block",
      "type": "code",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "127.0.0.1   localhost localhost.localdomain\n192.168.0.61 mail.test1.com   # test1 서버 IP\n192.168.0.62 mail.test2.com   # test2 서버 IP",
      "language": "bash"
    },
    {
      "id": "26a24e56-f2bd-8017-825f-e1165aacdb69",
      "object": "block",
      "type": "heading_3",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "/etc/resolv.conf"
    },
    {
      "id": "26a24e56-f2bd-8020-b493-d4faf8ad0495",
      "object": "block",
      "type": "code",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "search test1.com             # 기본 도메인\nnameserver 192.168.0.40      # 내부 DNS 서버",
      "language": "bash"
    },
    {
      "id": "26a24e56-f2bd-8022-8e62-d8a36e35c604",
      "object": "block",
      "type": "quote",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "⚠️ 참고: 재부팅 시 resolv.conf 초기화 방지를 위해 NetworkManager 설정 필요"
    },
    {
      "id": "26a24e56-f2bd-80c4-9dc5-f6f10d7dff87",
      "object": "block",
      "type": "heading_2",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "3️⃣ Sendmail 설정"
    },
    {
      "id": "26a24e56-f2bd-8080-a3c0-c2fbf4605c83",
      "object": "block",
      "type": "heading_3",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "/etc/mail/access"
    },
    {
      "id": "26a24e56-f2bd-80b2-a9f8-f6993cf53328",
      "object": "block",
      "type": "code",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "Connect:localhost.localdomain   RELAY    # 로컬 접속 허용\nConnect:localhost               RELAY\nConnect:127.0.0.1               RELAY\nConnect:192.168.0               RELAY    # 내부 네트워크 허용\nConnect:test1.com               RELAY    # 도메인 허용\nConnect:test2.com               RELAY",
      "language": "bash"
    },
    {
      "id": "26a24e56-f2bd-8077-8fca-ec92d199fee4",
      "object": "block",
      "type": "code",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "makemap hash /etc/mail/access < /etc/mail/access   # access.db 생성",
      "language": "bash"
    },
    {
      "id": "26a24e56-f2bd-80c7-b640-ef63a984c9cc",
      "object": "block",
      "type": "heading_3",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "/etc/mail/local-host-names"
    },
    {
      "id": "26a24e56-f2bd-80c2-89b9-fa0e0808b35c",
      "object": "block",
      "type": "code",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "mail.test1.com   # 수신 도메인 매칭 (test1 서버)\n\nmail.test2.com   # 수신 도메인 매칭 (test2 서버)",
      "language": "bash"
    },
    {
      "id": "26a24e56-f2bd-806b-b6c0-d0cdb0280c67",
      "object": "block",
      "type": "heading_3",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "/etc/mail/sendmail.mc"
    },
    {
      "id": "26a24e56-f2bd-801e-94bc-da5dc61f266e",
      "object": "block",
      "type": "code",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "dnl DAEMON_OPTIONS('Port=smtp, Addr=127.0.0.1, Name=MTA')dnl\nDAEMON_OPTIONS('Port=smtp, Name=MTA')dnl    # 모든 IP에서 SMTP 수신 허용",
      "language": "plain text"
    },
    {
      "id": "26a24e56-f2bd-807c-b856-e7c55f21b0b2",
      "object": "block",
      "type": "code",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "m4 /etc/mail/sendmail.mc > /etc/mail/sendmail.cf  # cf 파일 생성\nsystemctl restart sendmail                         # Sendmail 적용",
      "language": "bash"
    },
    {
      "id": "26a24e56-f2bd-80fc-9457-c980364ed4ec",
      "object": "block",
      "type": "heading_2",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "4️⃣ Dovecot 설정 (메일 수신/읽기)"
    },
    {
      "id": "26a24e56-f2bd-80a7-8018-e411ab07ac91",
      "object": "block",
      "type": "heading_3",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "/etc/dovecot/dovecot.conf"
    },
    {
      "id": "26a24e56-f2bd-80ce-a0b3-e4e4d4f73e81",
      "object": "block",
      "type": "code",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "protocols = imap pop3 lmtp submission       # 메일 수신 프로토콜\nlisten = *, ::                              # 모든 인터페이스 수신",
      "language": "plain text"
    },
    {
      "id": "26a24e56-f2bd-80b6-8131-fadabddb1d55",
      "object": "block",
      "type": "heading_3",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "/etc/dovecot/conf.d/10-ssl.conf"
    },
    {
      "id": "26a24e56-f2bd-80c8-9c67-da6c01c80655",
      "object": "block",
      "type": "code",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "ssl = no   # 실습용 SSL 미사용",
      "language": "plain text"
    },
    {
      "id": "26a24e56-f2bd-8000-a258-ea152800ffc8",
      "object": "block",
      "type": "heading_3",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "/etc/dovecot/conf.d/10-mail.conf"
    },
    {
      "id": "26a24e56-f2bd-80d6-9f4d-e9a773d3734d",
      "object": "block",
      "type": "code",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "mail_location = mbox:~/mail:INBOX=/var/mail/%u   # 메일 저장 위치 (메일박스)\nmail_access_groups = mail                        # mail 그룹 사용자 접근 허용",
      "language": "plain text"
    },
    {
      "id": "26a24e56-f2bd-8089-a281-f8b45eb0b75b",
      "object": "block",
      "type": "heading_3",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "/etc/dovecot/conf.d/10-auth.conf"
    },
    {
      "id": "26a24e56-f2bd-8082-a792-c38aededdf00",
      "object": "block",
      "type": "code",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "disable_plaintext_auth = no   # 평문 인증 허용\nauth_mechanisms = plain login # 인증 방식",
      "language": "plain text"
    },
    {
      "id": "26a24e56-f2bd-8025-9323-f0f44dfb22ef",
      "object": "block",
      "type": "code",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "systemctl restart dovecot   # Dovecot 적용",
      "language": "bash"
    },
    {
      "id": "26a24e56-f2bd-8077-96f5-e09eb5151d5d",
      "object": "block",
      "type": "heading_2",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "5️⃣ 설명 (교육용)"
    },
    {
      "id": "26a24e56-f2bd-805e-a2f9-dba05f9ab9cf",
      "object": "block",
      "type": "heading_2",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "6️⃣ 최종 구조"
    },
    {
      "id": "26a24e56-f2bd-80f5-a70a-c6b92609fa50",
      "object": "block",
      "type": "bulleted_list_item",
      "has_children": true,
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "test1.com (mail.test1.com, 192.168.0.61)"
    },
    {
      "id": "26a24e56-f2bd-80e5-81d5-ef78d85c6e9d",
      "object": "block",
      "type": "bulleted_list_item",
      "has_children": true,
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "test2.com (mail.test2.com, 192.168.0.62)"
    },
    {
      "id": "26a24e56-f2bd-8019-8b46-c76c35f260bd",
      "object": "block",
      "type": "paragraph",
      "parent": { "type": "page_id", "page_id": "26a24e56-f2bd-80fb-98b2-f7c7fedbc278" },
      "text": "📩 이제 test1 사용자 ↔ test2 사용자 간 메일 송수신 가능"
    }
  ]
};
