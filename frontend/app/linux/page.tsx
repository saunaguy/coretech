import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DailyList from "@/components/site/DailyList"
import MarkdownArticle from "@/components/lesson/MarkdownArticle"
import { renderMarkdownWithToc, type TocItem } from "@/lib/markdown"
import { Button } from "@/components/ui/button"
import { promises as fs } from "fs"
import path from "path"
async function fetchDaily(): Promise<any[]> {
  const base = process.env.INTERNAL_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
  try {
    const r = await fetch(`${base}/api/v1/daily/tests`, { next: { revalidate: 30 } })
    if (!r.ok) return []
    return r.json()
  } catch {
    return []
  }
}

//

async function loadIntro(): Promise<{ html: string; toc: TocItem[] }> {
  // Prefer first doc from absolute-beginner or beginner as intro
  const base = path.join(process.cwd(), "content", "lessons", "linux")
  const candidates = [
    path.join(base, "absolute-beginner"),
    path.join(base, "beginner"),
    base,
  ]
  for (const dir of candidates) {
    try {
      const list = (await fs.readdir(dir)).filter((f) => f.toLowerCase().endsWith(".md")).sort()
      if (list.length > 0) {
        const md = await fs.readFile(path.join(dir, list[0]), "utf-8")
        const { html, toc } = await renderMarkdownWithToc(md)
        return { html, toc }
      }
    } catch {}
  }
  return { html: "", toc: [] }
}

type LinuxGroup = { slug: string; title: string; path?: string }
async function loadLinuxGroups(): Promise<LinuxGroup[]> {
  try {
    const p = path.join(process.cwd(), "content", "lessons", "linux", "index.json")
    const raw = await fs.readFile(p, "utf-8")
    const j = JSON.parse(raw)
    return (j.groups || []) as LinuxGroup[]
  } catch {
    // Fallback to common defaults
    return [
      { slug: "absolute-beginner", title: "왕초보" },
      { slug: "beginner", title: "초급" },
      { slug: "intermediate", title: "중급" },
      { slug: "advanced", title: "고급" },
    ]
  }
}

function resolveGroupDir(g: LinuxGroup) {
  const raw = g.path || path.join("content", "lessons", g.slug)
  const trimmed = raw.replace(/^\/+/, "")
  return path.join(process.cwd(), trimmed)
}

async function countGroupLessons(g: LinuxGroup): Promise<number> {
  const dir = resolveGroupDir(g)
  try {
    const items = await fs.readdir(dir)
    return items.filter((f) => f.toLowerCase().endsWith(".md")).length
  } catch {
    return 0
  }
}

export default async function LinuxPage() {
  const [daily, intro, groups] = await Promise.all([fetchDaily(), loadIntro(), loadLinuxGroups()])
  const counts = await Promise.all(groups.map((g) => countGroupLessons(g)))
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Hero */}
        <section className="rounded-2xl border bg-gradient-to-br from-primary/10 to-accent/10 p-8 md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold">Linux 기초</h1>
              <p className="text-muted-foreground max-w-2xl">
                기본 개념부터 파일/권한/프로세스/서비스까지. 실습과 데일리 테스트로 차근차근 익혀보세요.
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild size="sm">
                <Link href="/lessons">강의자료</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/daily?category=linux">데일리 테스트</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Learning Paths */}
        <section>
          <h2 className="text-xl font-semibold mb-4">학습 경로</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {groups.map((g, idx) => (
              <div key={g.slug} className="rounded-xl border bg-card text-card-foreground hover:shadow-sm transition-shadow">
                <div className="p-4 space-y-2">
                  <div className="text-sm text-muted-foreground">Linux</div>
                  <h3 className="text-lg font-medium">
                    <Link href={`/lessons/${g.slug}`} className="hover:underline">
                      {g.title}
                    </Link>
                  </h3>
                  <div className="text-sm text-muted-foreground">강의 {counts[idx] ?? 0}개</div>
                  <div>
                    <Link href={`/lessons/${g.slug}`} className="text-sm underline hover:no-underline">
                      바로 보기 →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Content with Sidebar TOC */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            {intro.html && (
              <Card>
                <CardHeader>
                  <CardTitle>리눅스 기초 — 소개</CardTitle>
                </CardHeader>
                <CardContent>
                  <MarkdownArticle html={intro.html} />
                </CardContent>
              </Card>
            )}
            <Card>
              <CardHeader>
                <CardTitle>데일리 테스트 미리보기</CardTitle>
              </CardHeader>
              <CardContent>
                <DailyList items={daily} />
              </CardContent>
            </Card>
          </div>
          <aside className="lg:col-span-4">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>목차</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="text-sm space-y-1">
                  {intro.toc.length === 0 && (
                    <div className="text-muted-foreground">소개 문서에 목차가 없습니다.</div>
                  )}
                  {intro.toc.map((item) => (
                    <div key={item.id} className={item.depth > 2 ? "pl-4" : ""}>
                      <a href={`#${item.id}`} className="hover:underline">{item.text}</a>
                    </div>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </aside>
        </section>
      </div>
    </div>
  )
}
