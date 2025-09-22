'use client'

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Menu, X } from "lucide-react" // Added Menu, X
import { Button } from "@/components/ui/button" // Added Button
import { useMobileSidebar } from "@/lib/MobileSidebarContext" // New import
//
import LinuxSidebar from "@/components/linux/LinuxSidebar"
import { linuxTopics } from "@/lib/linux-data"
import { loadLinuxContent } from "@/content/linux/loader"

type ContentBlock = {
  type: 'heading' | 'paragraph' | 'image' | 'list' | 'aside' | 'callout' | 'code' | 'divider' | 'quote'
  text?: string
  src?: string
  alt?: string
  caption?: string
  items?: string[]
  icon?: string
}

type Command = {
  id?: string
  name?: string
  title: string
  description?: string
  content?: string
  blocks?: ContentBlock[]
  options?: { flag: string; description: string }[]
  examples?: { command: string; description: string }[]
  loaderKey?: string
}

const CommandDetailView = ({ command, isMobile }: { command: Command | null; isMobile: boolean }) => {
  if (!command) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>{isMobile ? '위의 메뉴에서 골라주세요.' : '왼쪽 메뉴에서 학습할 명령어를 선택하세요.'}</p>
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

  const cleanTitle = (s: string) => {
    let t = String(s || '').replace(/\u00A0/g, ' ').trim()
    t = t.replace(/^커리큘럼:\s*/i, '').trim()
    t = t.replace(/^\d+\s*-\s*\d+\s*/, '').trim()
    t = t.replace(/^\d+\s*/, '').trim()
    t = t.replace(/^[·•\-:\|]\s*/, '').trim()
    t = t.replace(/^\d+\.\s*/, '').trim()
    return t
  }

  const renderBlock = (block: ContentBlock, index: number) => {
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
          <CardTitle className="text-3xl font-bold">{cleanTitle(command.title || command.name || '')}</CardTitle>
          <CardDescription className="text-lg">{command.description}</CardDescription>
        </CardHeader>
        {(command.content || command.blocks) && (
          <CardContent className="space-y-4 max-w-3xl">
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
  const router = useRouter()
  const [selectedCommand, setSelectedCommand] = useState<Command | null>(null)
  const [loading, setLoading] = useState(false)
  const [isLocalSidebarOpen, setIsLocalSidebarOpen] = useState(false) // Local state for sidebar
  const searchParams = useSearchParams()
  const lastFocusedRef = useRef<HTMLElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const initialAutoOpenRef = useRef(false)

  const handleSelect = (cmd: Command) => {
    setSelectedCommand((prev) => (prev?.id === cmd?.id ? prev : cmd))
    setIsLocalSidebarOpen(false) // Close local sidebar on command select
  }

  // Open drawer on initial mobile visit when ?open=1 is present
  useEffect(() => {
    if (typeof window === 'undefined') return
    const open = searchParams?.get('open')
    const isMobile = window.innerWidth < 1024
    if (open && isMobile && !isLocalSidebarOpen) {
      setIsLocalSidebarOpen(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Track viewport to detect mobile and auto-open once when landing
  useEffect(() => {
    if (typeof window === 'undefined') return
    const update = () => setIsMobile(window.innerWidth < 1024)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    if (!isMobile) return
    if (initialAutoOpenRef.current) return
    if (!isLocalSidebarOpen) {
      setIsLocalSidebarOpen(true)
    }
    initialAutoOpenRef.current = true
    // do not add toggleMobileSidebar to deps to avoid re-run
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, isLocalSidebarOpen])

  // Scroll lock and focus trap handling for mobile drawer
  useEffect(() => {
    if (typeof document === 'undefined') return
    if (isLocalSidebarOpen) {
      lastFocusedRef.current = document.activeElement as HTMLElement
      // lock scroll
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'

      // focus the first focusable element in panel
      const panel = panelRef.current
      if (panel) {
        const focusables = panel.querySelectorAll<HTMLElement>(
          'input, button, a, [tabindex]:not([tabindex="-1"])'
        )
        if (focusables.length > 0) focusables[0].focus()
      }

      // ESC to close
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault()
          setIsLocalSidebarOpen(false)
        }
        if (e.key === 'Tab' && panelRef.current) {
          // simple focus trap
          const focusables = panelRef.current.querySelectorAll<HTMLElement>(
            'input, button, a, [tabindex]:not([tabindex="-1"])'
          )
          if (focusables.length === 0) return
          const first = focusables[0]
          const last = focusables[focusables.length - 1]
          const active = document.activeElement as HTMLElement
          const shift = e.shiftKey
          if (!shift && active === last) {
            e.preventDefault()
            first.focus()
          } else if (shift && active === first) {
            e.preventDefault()
            last.focus()
          }
        }
      }
      document.addEventListener('keydown', onKey)

      return () => {
        document.body.style.overflow = prevOverflow
        document.removeEventListener('keydown', onKey)
        // restore focus
        lastFocusedRef.current?.focus()
      }
    }
  }, [isLocalSidebarOpen])

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

  const deriveKey = (cmd: Command | null) => {
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
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:w-72 xl:w-80 shrink-0">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>명령어 목록</CardTitle>
              </CardHeader>
              <CardContent className="overflow-y-auto max-h-[calc(100vh-10rem)] pr-1">
                <LinuxSidebar topics={linuxTopics} onCommandSelect={handleSelect} />
              </CardContent>
            </Card>
          </aside>

          {/* Mobile Sidebar Overlay (Local to LinuxPage) */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden fixed top-4 left-1/2 -translate-x-1/2 z-[60]"
            onClick={() => setIsLocalSidebarOpen(true)}
          >
            <span>▽</span>
            <span className="sr-only">Linux 메뉴 열기</span>
          </Button>

          {isLocalSidebarOpen && (
            <div className="fixed inset-0 z-[60] bg-background/90 backdrop-blur-sm lg:hidden" role="dialog" aria-modal="true" aria-labelledby="linux-drawer-title">
              <div className="absolute inset-0 left-0 bg-black/50" onClick={() => setIsLocalSidebarOpen(false)} />
              <div ref={panelRef} className="absolute inset-y-0 left-0 w-full bg-card shadow-lg overflow-y-auto focus:outline-none">
                {/* Drawer header */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b bg-card/95 backdrop-blur">
                  <Link href="/" className="text-sm text-sidebar-foreground hover:text-sidebar-primary">홈</Link>
                  <h2 id="linux-drawer-title" className="text-sm font-semibold">Linux</h2>
                  <Button variant="ghost" size="icon" onClick={() => router.push('/')} aria-label="홈으로 이동">
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                {/* Drawer content */}
                <div className="px-4 pb-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>명령어 목록</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-y-auto max-h-[calc(100vh-12rem)] pr-1">
                      <LinuxSidebar autoFocus topics={linuxTopics} onCommandSelect={handleSelect} />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          <main className="w-full lg:flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center justify-center h-full text-muted-foreground py-12">불러오는 중...</div>
            ) : (
              <CommandDetailView command={selectedCommand} isMobile={isMobile} />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}