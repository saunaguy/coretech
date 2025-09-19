import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import BoardList from "@/components/site/BoardList"
import QAList from "@/components/site/QAList"
import { MessageSquare } from "lucide-react"
import Link from "next/link"
import CategoryGrid from "@/components/site/CategoryGrid"
import NoticeListCard from "@/components/site/NoticeListCard"
import QuickTestsCard from "@/components/site/QuickTestsCard"
import fs from "fs"
import path from "path"

async function fetchJson<T>(path: string): Promise<T> {
  const base = process.env.INTERNAL_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
  const res = await fetch(`${base}${path}`, { next: { revalidate: 30 } })
  if (!res.ok) throw new Error(`Failed to fetch ${path}`)
  return (await res.json()) as T
}

async function tryFetchJson<T>(path: string, fallback: T): Promise<T> {
  try {
    return await fetchJson<T>(path)
  } catch {
    return fallback
  }
}

type LessonLink = { slug: string; title: string }

function humanizeName(filename: string): string {
  const base = filename.replace(/\.[^.]+$/i, "")
  const trimmed = base.replace(/^\d+_/, "")
  return trimmed.replace(/_/g, " ")
}

function listLessonGroups(): { slug: string; title: string }[] {
  const contentRoot = path.join(process.cwd(), "content", "lessons")
  const indexPath = path.join(contentRoot, "index.json")
  if (fs.existsSync(indexPath)) {
    try {
      const idx = JSON.parse(fs.readFileSync(indexPath, "utf-8")) as { groups?: { slug: string; title: string }[] }
      if (idx?.groups?.length) return idx.groups
    } catch {}
  }
  const entries = fs.existsSync(contentRoot) ? fs.readdirSync(contentRoot, { withFileTypes: true }) : []
  return entries.filter((e) => e.isDirectory()).map((e) => ({ slug: e.name, title: e.name }))
}

function listLessonsForGroup(groupSlug: string, limit = 3): LessonLink[] {
  const dir = path.join(process.cwd(), "content", "lessons", groupSlug)
  if (!fs.existsSync(dir)) return []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  // 1) pick markdown files in root
  let files = entries.filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".md")).map((e) => ({
    slug: `${groupSlug}/${e.name.replace(/\.md$/i, "")}`,
    title: humanizeName(e.name),
  }))
  // 2) if none, peek one-level subdirs
  if (files.length === 0) {
    for (const e of entries.filter((d) => d.isDirectory())) {
      const subdir = path.join(dir, e.name)
      const md = fs
        .readdirSync(subdir)
        .filter((f) => f.toLowerCase().endsWith(".md"))
        .sort((a, b) => a.localeCompare(b, "ko"))
        .slice(0, Math.max(1, Math.floor(limit / 2)))
        .map((f) => ({ slug: `${groupSlug}/${e.name}/${f.replace(/\.md$/i, "")}`, title: humanizeName(f) }))
      files.push(...md)
      if (files.length >= limit) break
    }
  }
  return files.slice(0, limit)
}

// fetchJson/tryFetchJson already declared above with default revalidate=30

export default async function HomePage() {
  const groups = listLessonGroups()
  const [board, qna] = await Promise.all([
    tryFetchJson<any[]>("/api/v1/board/posts?sort=latest", []),
    tryFetchJson<any[]>("/api/v1/qna/questions", []),
  ])
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Hero */}
        <section className="rounded-2xl border bg-gradient-to-br from-primary/10 to-accent/10 p-6 md:p-10 text-center space-y-4">
          <h1 className="text-2xl md:text-4xl font-bold text-foreground text-balance">
            <span className="md:hidden">CoreTechnet 학습용 웹 페이지</span>
            <span className="hidden md:inline">CoreTech — Linux · Server · Network</span>
          </h1>
          <p className="hidden md:block text-lg md:text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
            Markdown 강의, 데일리 테스트, Q&A 커뮤니티로 학습을 이어가세요. Docs의 계획에 맞춰 점진적으로 확장됩니다.
          </p>
          <div className="flex items-center justify-center gap-2 md:gap-3 pt-2">
            <Button asChild>
              <Link href="/lessons" className="whitespace-nowrap">
                <span className="md:hidden">강의</span>
                <span className="hidden md:inline">강의 시작하기</span>
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/daily" className="whitespace-nowrap">
                <span className="md:hidden">테스트</span>
                <span className="hidden md:inline">데일리 테스트</span>
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/qna/new" className="whitespace-nowrap">
                <span className="md:hidden">Q&amp;A</span>
                <span className="hidden md:inline">질문하기</span>
              </Link>
            </Button>
          </div>
        </section>
        <CategoryGrid />

        {/* Lessons preview */}
        <section className="space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">추천 강의</h2>
            <p className="text-muted-foreground">그룹별 초반 레슨을 골라 담았어요</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.flatMap((g) => listLessonsForGroup(g.slug, 2)).map((l) => (
              <Card key={l.slug} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <Link className="font-medium hover:underline" href={encodeURI(`/lessons/${l.slug}`)}>
                    {l.title}
                  </Link>
                </CardContent>
              </Card>
            ))}
            {groups.length === 0 && (
              <Card>
                
              </Card>
            )}
          </div>
        </section>

        {/* 최근 활동: 공지(좌) + 간단한 테스트(우) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NoticeListCard />
          <QuickTestsCard />
        </section>

        {/* 최근 활동 (게시글 + Q&A) */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">최근 활동</h2>
            <p className="text-muted-foreground">커뮤니티의 최신 소식을 확인하세요</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="h-fit">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    최근 게시글
                  </CardTitle>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/board">더보기</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <BoardList
                  items={(board || []).slice(0, 5).map((b: any) => ({
                    id: String(b.id),
                    title: b.title,
                    author: "",
                    views: b.views,
                    likes: b.likes,
                    createdAt: b.createdAt || "",
                  }))}
                />
              </CardContent>
            </Card>

            <Card className="h-fit">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle>인기 Q&A</CardTitle>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/qna">더보기</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <QAList
                  items={(qna || []).slice(0, 5).map((q: any) => ({
                    id: String(q.id),
                    question: q.title,
                    author: "",
                    answered: false,
                    createdAt: "",
                    excerpt: q.body || "",
                  }))}
                />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
