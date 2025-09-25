"use client"

import { useMemo, useState, useEffect, useRef } from "react"
import LinuxSidebar from "@/components/linux/LinuxSidebar"
import { linuxTopics } from "@/lib/linux-data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

type Command = {
  id?: string
  name?: string
  title: string
  description?: string
  loaderKey?: string
}

function normalizeSection(sec?: string): string | undefined {
  if (!sec) return undefined
  const m = sec.match(/^(\d+)-(\d+)$/)
  if (!m) return sec
  const a = String(parseInt(m[1], 10))
  const b = String(parseInt(m[2], 10))
  return `${a}-${b}`
}

function parseSectionAndIndexFromLoaderKey(loaderKey?: string): { section?: string; index?: string } {
  if (!loaderKey) return {}
  const nums = loaderKey.split('-').map((p) => parseInt(p, 10)).filter((n) => !isNaN(n))
  // Cases:
  // - a-b-c-d => section b-c, index d   (e.g., 01-1-2-5 -> 1-2/5.md)
  // - a-b-c   => section a-b, index c   (e.g., 01-1-3   -> 1-1/3.md)
  // - a-b     => section a-b, index undefined (default 1)
  if (nums.length >= 4) {
    return { section: `${nums[1]}-${nums[2]}`, index: String(nums[3]) }
  }
  if (nums.length === 3) {
    return { section: `${nums[0]}-${nums[1]}`, index: String(nums[2]) }
  }
  if (nums.length === 2) {
    return { section: `${nums[0]}-${nums[1]}` }
  }
  return {}
}

function parseSectionAndIndex(cmdId?: string, loaderKey?: string): { section?: string; index?: string } {
  const byKey = parseSectionAndIndexFromLoaderKey(loaderKey)
  if (byKey.section) return byKey
  // Expect formats like plan-2-3-4 -> section 2-3, index 4
  if (!cmdId) return {}
  const m = cmdId.match(/^(?:plan|lab|env)-(\d+-\d+)-(\d+)$/)
  if (m) return { section: normalizeSection(m[1]), index: String(parseInt(m[2], 10)) }
  // Fallback: try to extract at least 2-3 from id
  const m2 = cmdId.match(/(\d+-\d+)/)
  return { section: normalizeSection(m2?.[1]) }
}

function getContentBase(): string {
  // Fetch directly from backend static content to avoid Next rewrites
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000").replace(/\/+$/, "")
  return `${base}/content/lesson`
}

export default function LessonPage() {
  const [selected, setSelected] = useState<Command | null>(null)
  const [md, setMd] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [attemptUrl, setAttemptUrl] = useState<string | null>(null)
  const readerRef = useRef<HTMLDivElement | null>(null)

  // Prevent browser from restoring previous scroll on same-page updates
  useEffect(() => {
    try { (window.history as any).scrollRestoration = 'manual' } catch {}
  }, [])

  const { section, index } = useMemo(() => parseSectionAndIndex(selected?.id, selected?.loaderKey), [selected?.id, selected?.loaderKey])

  useEffect(() => {
    const fetchMd = async () => {
      setError(null)
      setMd("")
      if (!section) return
      // Default to first item when index missing
      const idx = index || "1"
      const url = `${getContentBase()}/${encodeURIComponent(section)}/${encodeURIComponent(idx)}.md`
      setAttemptUrl(url)
      try {
        setLoading(true)
        const res = await fetch(url, { cache: "no-store" })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const text = await res.text()
        setMd(text)
      } catch (e: any) {
        setError(`콘텐츠를 불러오지 못했습니다: ${e?.message || e}`)
      } finally {
        setLoading(false)
      }
    }
    fetchMd()
  }, [section, index])

  // Scroll only the right reader pane to top whenever a new document is loaded
  useEffect(() => {
    if (!md) return
    try {
      readerRef.current?.scrollTo?.({ top: 0, left: 0 })
      // Also ensure inner prose container is scrolled to top if independently scrollable
      const prose = readerRef.current?.querySelector('.md-prose') as HTMLElement | null
      if (prose) prose.scrollTop = 0
    } catch {}
  }, [md])

  const handleSelect = (cmd: Command) => {
    setSelected(cmd)
    try {
      readerRef.current?.scrollTo?.({ top: 0, left: 0 })
      const prose = readerRef.current?.querySelector('.md-prose') as HTMLElement | null
      if (prose) prose.scrollTop = 0
    } catch {}
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-row gap-8">
          {/* Sidebar from /linux */}
          <aside className="hidden lg:block lg:w-72 xl:w-80 shrink-0">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>명령어 목록</CardTitle>
              </CardHeader>
              <CardContent className="overflow-y-auto max-h-[calc(100vh-10rem)] pr-1">
                <LinuxSidebar topics={linuxTopics} onCommandSelect={handleSelect} remoteLessonSearch={true} />
              </CardContent>
            </Card>
          </aside>

          {/* Reader */}
          <main className="w-full lg:flex-1 min-w-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl font-bold">
                  {selected?.title || selected?.name || "문서를 선택하세요"}
                </CardTitle>
                {section && (
                  <CardDescription>
                    경로: <code className="font-mono">lesson/{section}/{index || 1}.md</code>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent ref={readerRef} className="overflow-y-auto max-h-[calc(100vh-10rem)] pr-1">
                {loading && <div className="text-muted-foreground">불러오는 중...</div>}
                {error && (
                  <div className="text-destructive space-y-2">
                    <div>{error}</div>
                    {attemptUrl && (
                      <div className="text-sm">
                        시도한 경로: <a className="underline" href={attemptUrl} target="_blank" rel="noreferrer">{attemptUrl}</a>
                      </div>
                    )}
                  </div>
                )}
                {!loading && !error && md && (
                  <div className="md-prose md-prose-lg">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{md}</ReactMarkdown>
                  </div>
                )}
                {!loading && !error && !md && (
                  <p className="text-muted-foreground">좌측에서 항목을 선택해주세요.</p>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  )
}
