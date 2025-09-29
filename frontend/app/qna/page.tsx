"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authenticatedFetch } from "@/lib/auth"
import { ChevronDown, Search, PlusCircle } from "lucide-react"
import Link from "next/link"

type Category = "all" | "server" | "network" | "others"
type SortBy = "latest" | "views"

type QItem = {
  id: number
  title: string
  body?: string
  tags?: string[]
  createdAt: string
  answered: boolean
  author: { id: number; username: string; }
  views: number
}

const CATEGORIES: Category[] = ["all", "server", "network", "others"]
const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "latest", label: "최신순" },
  { value: "views", label: "조회순" },
]

export const dynamic = "force-dynamic"

export default function QnaPage() {
  const [category, setCategory] = useState<Category>("all")
  const [items, setItems] = useState<QItem[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<SortBy>("latest")

  const load = async () => {
    setLoading(true)
    try {
      const base = `/api/v1/qna/questions`
      let url = `${base}?sort=${sortBy}`;
      if (category !== "all") {
        url += `&category=${encodeURIComponent(category)}`;
      }
      const data = await authenticatedFetch(url)
      const list = (data || []).map((q: any) => ({
        id: q.id,
        title: q.title,
        body: q.body,
        tags: (q.tags || []).filter(Boolean),
        createdAt: q.createdAt,
        answered: !!q.answered,
        author: q.author, // Use real author from API
        views: q.views, // Use real views from API
      })) as QItem[]
      setItems(list)
    } catch (e) {
      console.error("Failed to load Q&A items:", e)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [category, sortBy]) // Add sortBy to dependencies

  const filteredAndSortedItems = useMemo(() => {
    let filtered = items
    if (searchTerm) {
      filtered = items.filter(
        (it) =>
          it.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          it.body?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          it.author.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          it.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    return filtered.sort((a, b) => {
      if (sortBy === "views") {
        return b.views - a.views
      }
      // Default to latest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [items, searchTerm, sortBy])

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">Q&A 게시판</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            궁금한 점을 해결하고 지식을 공유하세요.
          </p>
        </div>

        {/* Control Panel */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:max-w-xs">
                <Input
                  placeholder="검색 (제목, 내용, 작성자, 태그...)"
                  className="pl-10 border-slate-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex gap-2 items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" className="w-32 justify-between border-slate-300">
                      {SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {SORT_OPTIONS.map((opt) => (
                      <DropdownMenuItem key={opt.value} onClick={() => setSortBy(opt.value)}>
                        {opt.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link href="/qna/new" passHref>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />새 질문 작성
                  </Button>
                </Link>
              </div>
            </div>
            <Separator />
            <div className="flex justify-center gap-2 flex-wrap">
              {CATEGORIES.map((c) => (
                <Button
                  key={c}
                  variant={category === c ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setCategory(c)}
                  className={category !== c ? 'border-slate-300' : ''}
                >
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Q&A Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4 bg-card animate-pulse">
                <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-16 bg-muted rounded mb-4"></div>
                <div className="flex flex-wrap gap-2">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                </div>
              </div>
            ))
          ) : filteredAndSortedItems.length > 0 ? (
            filteredAndSortedItems.map((q) => (
              <Link key={q.id} href={`/qna/${q.id}`} passHref>
                <div className="block border border-slate-200 rounded-lg bg-card text-card-foreground hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                  <div className="p-5 flex-grow">
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          q.answered
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {q.answered ? "답변 완료" : "답변 대기"}
                      </span>
                      <span className="text-xs text-muted-foreground">조회 {q.views}</span>
                    </div>
                    <h2 className="text-lg font-bold line-clamp-3 mb-2 min-h-[84px]">{q.title}</h2>
                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">{q.body}</p>
                  </div>
                  {(q.tags && q.tags.length > 0) && (
                    <div className="border-t p-4 mt-auto">
                      <div className="flex flex-wrap gap-2">
                        {(q.tags || []).slice(0, 3).map((t) => (
                          <span key={t} className="text-xs px-2 py-1 rounded-full border bg-background">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground py-16">
              <p>표시할 질문이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}