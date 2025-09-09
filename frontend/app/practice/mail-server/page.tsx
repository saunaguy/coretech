"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Mail, Server, Code, Terminal, FileText, Settings, HardDrive, GitBranch, Lock } from "lucide-react";

const NotionBlock = ({ block, blocks }) => {
  if (!block) {
    return null;
  }

  const getChildren = (blockId) => {
    return blocks.filter(b => b.parent.type === 'block_id' && b.parent.block_id === blockId);
  };

  switch (block.type) {
    case 'heading_1':
      return <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 flex items-center gap-3"><Mail className="h-8 w-8 text-primary" />{block.text}</h1>;
    case 'heading_2': {
      const iconMap = {
        "Postfix": <Server className="h-6 w-6 text-accent" />,
        "Dovecot": <Server className="h-6 w-6 text-accent" />,
        "DNS": <Settings className="h-6 w-6 text-accent" />,
        "테스트": <Terminal className="h-6 w-6 text-accent" />,
        "SSL/TLS": <Lock className="h-6 w-6 text-accent" />,
        "사용자": <FileText className="h-6 w-6 text-accent" />,
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

export default function MailServerPage() {
  const notionData = notionContent; 

  const topLevelBlocks = notionData.blocks.filter(b => b.parent.type === 'page_id');

  const sections = [];
  let currentSection = null;

  topLevelBlocks.forEach(block => {
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
            <h1 className="text-4xl font-bold text-primary">메일 서버 구축 실습</h1>
            <p className="text-lg text-muted-foreground">Postfix와 Dovecot을 이용한 메일 서버 구축 가이드입니다.</p>
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
      "id": "mail-intro-heading",
      "object": "block",
      "type": "heading_1",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "mail-server-page" },
      "text": "📧 메일 서버 구축 개요"
    },
    {
      "id": "mail-intro-para1",
      "object": "block",
      "type": "paragraph",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "mail-server-page" },
      "text": "메일 서버는 이메일을 주고받는 데 필요한 핵심 인프라입니다. 이 실습에서는 Postfix와 Dovecot을 사용하여 기본적인 메일 서버를 구축하는 방법을 학습합니다."
    },
    {
      "id": "mail-intro-para2",
      "object": "block",
      "type": "paragraph",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "mail-server-page" },
      "text": "주요 구성 요소:"
    },
    {
      "id": "mail-intro-bullet1",
      "object": "block",
      "type": "bulleted_list_item",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "mail-server-page" },
      "text": "**MTA (Mail Transfer Agent)**: 메일을 보내고 받는 역할 (예: Postfix)"
    },
    {
      "id": "mail-intro-bullet2",
      "object": "block",
      "type": "bulleted_list_item",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "mail-server-page" },
      "text": "**MDA (Mail Delivery Agent)**: 수신된 메일을 사용자 사서함에 저장 (예: Dovecot)"
    },
    {
      "id": "mail-intro-bullet3",
      "object": "block",
      "type": "bulleted_list_item",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "mail-server-page" },
      "text": "**MUA (Mail User Agent)**: 사용자가 메일을 읽고 쓰는 클라이언트 (예: Thunderbird, Outlook)"
    },
    {
      "id": "mail-divider-1",
      "object": "block",
      "type": "divider",
      "parent": { "type": "page_id", "page_id": "mail-server-page" }
    },
    {
      "id": "postfix-heading",
      "object": "block",
      "type": "heading_2",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "mail-server-page" },
      "text": "1. Postfix 설치 및 설정"
    },
    {
      "id": "postfix-step1",
      "object": "block",
      "type": "numbered_list_item",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "mail-server-page" },
      "text": "Postfix 설치 (Ubuntu/Debian 기준)"
    },
    {
      "id": "postfix-code1",
      "object": "block",
      "type": "code",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "postfix-step1" },
      "text": "sudo apt update\nsudo apt install postfix",
      "language": "bash"
    },
    {
      "id": "postfix-step2",
      "object": "block",
      "type": "numbered_list_item",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "mail-server-page" },
      "text": "Postfix 기본 설정 (인터넷 사이트, 시스템 메일 이름 등)"
    },
    {
      "id": "postfix-code2",
      "object": "block",
      "type": "code",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "postfix-step2" },
      "text": "sudo dpkg-reconfigure postfix",
      "language": "bash"
    },
    {
      "id": "postfix-step3",
      "object": "block",
      "type": "numbered_list_item",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "mail-server-page" },
      "text": "`main.cf` 설정 수정 (예: `myhostname`, `mydomain`, `mynetworks`)"
    },
    {
      "id": "postfix-code3",
      "object": "block",
      "type": "code",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "postfix-step3" },
      "text": "sudo nano /etc/postfix/main.cf",
      "language": "bash"
    },
    {
      "id": "postfix-step4",
      "object": "block",
      "type": "numbered_list_item",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "mail-server-page" },
      "text": "Postfix 재시작"
    },
    {
      "id": "postfix-code4",
      "object": "block",
      "type": "code",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "postfix-step4" },
      "text": "sudo systemctl restart postfix",
      "language": "bash"
    },
    {
      "id": "mail-divider-2",
      "object": "block",
      "type": "divider",
      "parent": { "type": "page_id", "page_id": "mail-server-page" }
    },
    {
      "id": "dovecot-heading",
      "object": "block",
      "type": "heading_2",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "mail-server-page" },
      "text": "2. Dovecot 설치 및 설정"
    },
    {
      "id": "dovecot-step1",
      "object": "block",
      "type": "numbered_list_item",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "mail-server-page" },
      "text": "Dovecot 설치"
    },
    {
      "id": "dovecot-code1",
      "object": "block",
      "type": "code",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "dovecot-step1" },
      "text": "sudo apt install dovecot-imapd dovecot-pop3d",
      "language": "bash"
    },
    {
      "id": "dovecot-step2",
      "object": "block",
      "type": "numbered_list_item",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "mail-server-page" },
      "text": "`10-mail.conf` 설정 수정 (메일 저장 방식 등)"
    },
    {
      "id": "dovecot-code2",
      "object": "block",
      "type": "code",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "dovecot-step2" },
      "text": "sudo nano /etc/dovecot/conf.d/10-mail.conf",
      "language": "bash"
    },
    {
      "id": "dovecot-step3",
      "object": "block",
      "type": "numbered_list_item",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "mail-server-page" },
      "text": "`10-auth.conf` 설정 수정 (인증 방식 등)"
    },
    {
      "id": "dovecot-code3",
      "object": "block",
      "type": "code",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "dovecot-step3" },
      "text": "sudo nano /etc/dovecot/conf.d/10-auth.conf",
      "language": "bash"
    },
    {
      "id": "dovecot-step4",
      "object": "block",
      "type": "numbered_list_item",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "mail-server-page" },
      "text": "Dovecot 재시작"
    },
    {
      "id": "dovecot-code4",
      "object": "block",
      "type": "code",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "dovecot-step4" },
      "text": "sudo systemctl restart dovecot",
      "language": "bash"
    },
    {
      "id": "mail-divider-3",
      "object": "block",
      "type": "divider",
      "parent": { "type": "page_id", "page_id": "mail-server-page" }
    },
    {
      "id": "user-heading",
      "object": "block",
      "type": "heading_2",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "mail-server-page" },
      "text": "3. 메일 사용자 생성 및 테스트"
    },
    {
      "id": "user-step1",
      "object": "block",
      "type": "numbered_list_item",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "mail-server-page" },
      "text": "메일 사용자 계정 생성"
    },
    {
      "id": "user-code1",
      "object": "block",
      "type": "code",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "user-step1" },
      "text": "sudo adduser mailuser",
      "language": "bash"
    },
    {
      "id": "user-step2",
      "object": "block",
      "type": "numbered_list_item",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "mail-server-page" },
      "text": "메일 송신 테스트 (telnet 이용)"
    },
    {
      "id": "user-code2",
      "object": "block",
      "type": "code",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "user-step2" },
      "text": "telnet localhost 25\nHELO yourdomain.com\nMAIL FROM: <mailuser@yourdomain.com>\nRCPT TO: <mailuser@yourdomain.com>\nDATA\nSubject: Test Mail\n\nThis is a test mail.\n.\nQUIT",
      "language": "bash"
    },
    {
      "id": "user-step3",
      "object": "block",
      "type": "numbered_list_item",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "mail-server-page" },
      "text": "메일 수신 테스트 (telnet 이용)"
    },
    {
      "id": "user-code3",
      "object": "block",
      "type": "code",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "user-step3" },
      "text": "telnet localhost 110\nUSER mailuser\nPASS mailuser_password\nLIST\nRETR 1\nQUIT",
      "language": "bash"
    },
    {
      "id": "mail-divider-4",
      "object": "block",
      "type": "divider",
      "parent": { "type": "page_id", "page_id": "mail-server-page" }
    },
    {
      "id": "dns-heading",
      "object": "block",
      "type": "heading_2",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "mail-server-page" },
      "text": "4. DNS 설정 (MX 레코드)"
    },
    {
      "id": "dns-step1",
      "object": "block",
      "type": "numbered_list_item",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "mail-server-page" },
      "text": "도메인에 대한 MX 레코드 추가"
    },
    {
      "id": "dns-code1",
      "object": "block",
      "type": "code",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "dns-step1" },
      "text": "yourdomain.com. IN MX 10 mail.yourdomain.com.\nmail.yourdomain.com. IN A <Your_Server_IP>",
      "language": "dns"
    },
    {
      "id": "dns-step2",
      "object": "block",
      "type": "numbered_list_item",
      "has_children": false,
      "parent": { "type": "page_id", "page_id": "mail-server-page" },
      "text": "SPF 레코드 추가 (선택 사항이지만 권장)"
    },
    {
      "id": "dns-code2",
      "object": "block",
      "type": "code",
      "has_children": false,
      "parent": { "type": "block_id", "block_id": "dns-step2" },
      "text": "yourdomain.com. IN TXT \"v=spf1 mx -all\"",
      "language": "dns"
    }
  ]
};