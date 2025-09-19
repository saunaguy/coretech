"use client"
export const dynamic = "force-dynamic"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { format, isValid, parseISO } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, Eye, ThumbsUp, Search, ChevronRight, User } from "lucide-react"
import { useAuth } from "@/components/auth/AuthProvider"

type AuthorInfo = {
  id: number;
  username: string;
};

type Post = {
  id: number
  title: string
  body?: string
  createdAt?: string
  views?: number
  likes?: number
  author?: AuthorInfo
}

export default function BoardPage() {
  const { isAuthenticated } = useAuth()
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000").replace(/\/+$/, '')
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<"latest" | "views" | "likes">("latest")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const load = async () => {
    setLoading(true)
    try {
      const r = await fetch(`${base}/api/v1/board/posts`, { cache: "no-store" })
      if (r.ok) setPosts(await r.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  // Reset to first page on filter changes
  useEffect(() => {
    setPage(1)
  }, [query, sort])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = posts
    if (q) list = list.filter((p) => p.title.toLowerCase().includes(q) || (p.body || "").toLowerCase().includes(q))
    switch (sort) {
      case "views":
        return [...list].sort((a, b) => (b.views || 0) - (a.views || 0))
      case "likes":
        return [...list].sort((a, b) => (b.likes || 0) - (a.likes || 0))
      default:
        return [...list]
    }
  }, [posts, query, sort])

  const total = filtered.length
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)
  const paged = filtered.slice(start - 1, end)
  const maxPage = Math.max(1, Math.ceil(total / pageSize))

  const fmtDate = (iso?: string) => {
    if (!iso) return null
    const d = parseISO(iso)
    return isValid(d) ? format(d, "yyyy-MM-dd") : iso
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">게시판</h1>
          <p className="text-sm text-muted-foreground">질문/공유/후기를 자유롭게 남겨보세요.</p>
        </div>
        {isAuthenticated ? (
          <Button asChild>
            <Link href="/board/new">새 글 작성</Link>
          </Button>
        ) : (
          <Button asChild variant="outline">
            <Link href="/login">로그인 후 글 작성</Link>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-lg">전체 글 {posts.length}개</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-muted-foreground">
                  <Search className="h-4 w-4" />
                </span>
                <input
                  className="w-60 md:w-72 border rounded-md pl-8 pr-3 py-2 text-sm bg-background"
                  placeholder="검색 (제목/내용)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <select
                className="border rounded-md px-3 py-2 text-sm bg-background"
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                aria-label="정렬"
              >
                <option value="latest">최신순</option>
                <option value="views">조회순</option>
                <option value="likes">추천순</option>
              </select>
              <select
                className="border rounded-md px-3 py-2 text-sm bg-background"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                aria-label="페이지 크기"
              >
                {[10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}/페이지
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y">
            {loading && (
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <li key={i} className="p-4">
                    <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-1/3 bg-muted rounded mt-2 animate-pulse" />
                  </li>
                ))}
              </>
            )}
            {!loading && total === 0 && (
              <li className="p-8 text-center text-sm text-muted-foreground">
                아직 작성된 글이 없습니다. 첫 글의 주인공이 되어보세요!
              </li>
            )}
            {!loading &&
              paged.map((p) => (
                <li key={p.id} className="group p-4 md:p-5 hover:bg-muted/40 transition-colors">
                  <Link href={`/board/${p.id}`} className="block">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="font-medium text-foreground line-clamp-2 group-hover:underline">
                          {p.title}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-4 gap-y-1 items-center">
                          <span className="inline-flex items-center gap-1"><User className="h-3.5 w-3.5" />{p.author?.username || "익명"}</span>
                          {p.createdAt && (
                            <span className="inline-flex items-center gap-1">
                              <CalendarDays className="h-3.5 w-3.5" /> {fmtDate(p.createdAt)}
                            </span>
                          )}
                          {typeof p.views === "number" && (
                            <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {p.views}</span>
                          )}
                          {typeof p.likes === "number" && (
                            <span className="inline-flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5" /> {p.likes}</span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                </li>
              ))}
          </ul>
          {!loading && total > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3">
              <div className="text-xs text-muted-foreground">
                {start}-{end} / {total}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  이전
                </Button>
                <span className="text-xs text-muted-foreground">
                  {page} / {maxPage}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
                  disabled={page >= maxPage}
                >
                  다음
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
