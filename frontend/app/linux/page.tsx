'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import LinuxSidebar from "@/components/linux/LinuxSidebar"
import { linuxTopics } from "@/lib/linux-data"
import { loadLinuxContent } from "@/content/linux/loader"

const CommandDetailView = ({ command }) => {
  if (!command) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>왼쪽 메뉴에서 학습할 명령어를 선택하세요.</p>
      </div>
    )
  }

  const slugify = (s: string) =>
    (s || '')
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text || '');
    } catch (_) {}
  };

  const renderBlock = (block, index) => {
    switch (block.type) {
      case 'heading':
        return (
          <h3
            key={index}
            id={slugify(block.text)}
            className="scroll-mt-24 text-[1.25rem] font-semibold mt-6 mb-2 tracking-tight"
          >
            {block.text}
          </h3>
        )
      case 'paragraph':
        return (
          <p key={index} className="text-muted-foreground leading-7 whitespace-pre-wrap">
            {block.text}
          </p>
        )
      case 'image':
        return (
          <figure key={index} className="my-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={block.src} alt={block.alt || ''} className="rounded-md border" />
            {block.caption && (
              <figcaption className="mt-2 text-sm text-muted-foreground">{block.caption}</figcaption>
            )}
          </figure>
        )
      case 'list':
        return (
          <ul key={index} className="list-disc pl-6 space-y-1 text-muted-foreground leading-7">
            {block.items?.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ul>
        )
      case 'quote':
        return (
          <blockquote key={index} className="border-l-4 pl-4 italic text-muted-foreground">
            {block.text}
          </blockquote>
        )
      case 'aside':
        return (
          <div key={index} className="border rounded-lg bg-muted/60 p-4 text-muted-foreground leading-7">
            {block.text}
          </div>
        )
      case 'callout': {
        const icon = block.icon || '💡'
        return (
          <div key={index} className="flex items-start gap-3 border rounded-lg bg-muted/60 p-4">
            <div className="text-xl leading-none select-none">{icon}</div>
            <div className="text-muted-foreground leading-7">{block.text}</div>
          </div>
        )
      }
      case 'code':
        return (
          <div key={index} className="my-4 relative">
            <button
              onClick={() => copyToClipboard(block.text)}
              className="absolute right-2 top-2 z-10 rounded-md border bg-background/70 px-2 py-1 text-xs text-muted-foreground hover:bg-accent"
            >
              Copy
            </button>
            <pre className="p-4 rounded-md bg-muted text-sm overflow-auto">
              <code>{block.text}</code>
            </pre>
          </div>
        )
      case 'divider':
        return <hr key={index} className="my-6 border-dashed" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{command.title}</CardTitle>
          <CardDescription className="text-lg">{command.description}</CardDescription>
        </CardHeader>
        {(command.content || command.blocks) && (
          <CardContent className="space-y-5 max-w-3xl">
            {Array.isArray(command.blocks) && command.blocks.filter(b => b.type === 'heading')?.length > 2 && (
              <div className="rounded-lg border bg-background p-4">
                <div className="text-sm font-medium mb-2">목차</div>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                  {command.blocks.filter(b => b.type === 'heading').map((h, i) => (
                    <li key={`toc-${i}`}>
                      <a href={`#${slugify(h.text)}`} className="hover:underline">{h.text}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {command.blocks
              ? command.blocks.map((b, idx) => renderBlock(b, idx))
              : <p className="text-muted-foreground">{command.content}</p>}
          </CardContent>
        )}
      </Card>

      {command.options && command.options.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>주요 옵션</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {command.options.map((opt, index) => (
                <li key={index} className="flex items-start gap-4">
                  <Badge variant="secondary" className="text-base font-mono">{opt.flag}</Badge>
                  <span className="text-muted-foreground">{opt.description}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {command.examples && command.examples.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>사용 예시</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {command.examples.map((ex, index) => (
                <div key={index} className="p-4 bg-muted rounded-lg">
                  <p className="font-mono text-sm text-foreground">{ex.command}</p>
                  <p className="text-sm text-muted-foreground mt-1">{ex.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function LinuxPage() {
  const [selectedCommand, setSelectedCommand] = useState<any>(null);
  const [loading, setLoading] = useState(false)
  const handleSelect = (cmd: any) => {
    setSelectedCommand((prev: any) => (prev?.id === cmd?.id ? prev : cmd))
  }

  useEffect(() => {
    const loadBlocks = async () => {
      if (!selectedCommand) return
      const key = selectedCommand.loaderKey || deriveKey(selectedCommand)
      if (!key) return
      try {
        setLoading(true)
        const mod = await loadLinuxContent(key)
        setSelectedCommand((prev) => prev ? { ...prev, blocks: mod.default } : prev)
      } finally {
        setLoading(false)
      }
    }
    loadBlocks()
  }, [selectedCommand?.loaderKey, selectedCommand?.id])

  const deriveKey = (cmd: any) => {
    // Try from title then name: expect patterns like "01-1 ..." or "3-1 ..."
    const pick = (s?: string) => {
      if (!s) return null
      const m = s.trim().match(/^(\d{1,2})-(\d{1,2})\b/)
      if (!m) return null
      const chapter = m[1].padStart(2, '0')
      const section = String(parseInt(m[2], 10))
      return `${chapter}-${section}`
    }
    return pick(cmd?.title) || pick(cmd?.name) || null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-row gap-8">
          <aside className="w-1/4 hidden lg:block">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>명령어 목록</CardTitle>
              </CardHeader>
              <CardContent>
                <LinuxSidebar topics={linuxTopics} onCommandSelect={handleSelect} />
              </CardContent>
            </Card>
          </aside>

          <main className="w-full lg:w-3/4">
            {loading ? (
              <div className="flex items-center justify-center h-full text-muted-foreground py-12">불러오는 중...</div>
            ) : (
              <CommandDetailView command={selectedCommand} />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
