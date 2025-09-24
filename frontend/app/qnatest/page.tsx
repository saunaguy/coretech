"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth/AuthProvider"
import { authenticatedFetch } from "@/lib/auth"

type Category = "all" | "server" | "network" | "others"

type QItem = {
  id: number
  title: string
  body?: string
  tags?: string[]
  createdAt?: string
  answered?: boolean
}

const CATEGORIES: Category[] = ["all", "server", "network", "others"]

export const dynamic = "force-dynamic"

export default function QnaTestPage() {
  const { isAuthenticated } = useAuth()
  const [category, setCategory] = useState<Category>("all")
  const [items, setItems] = useState<QItem[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())
  const [showCreate, setShowCreate] = useState(false)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [tags, setTags] = useState("")

  const load = async () => {
    setLoading(true)
    try {
      const base = `/api/v1/qna/questions`
      const url = category === 'all' ? base : `${base}?category=${encodeURIComponent(category)}`
      const data = await authenticatedFetch(url)
      const list = (data || []).map((q: any) => ({
        id: q.id,
        title: q.title,
        body: q.body,
        tags: (q.tags || []).filter(Boolean),
        createdAt: q.createdAt,
        answered: !!q.answered,
      })) as QItem[]
      setItems(list)
    } catch (e) {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    setSelectedTags(new Set())
  }, [category])

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const it of items) {
      for (const t of it.tags || []) {
        counts.set(t, (counts.get(t) || 0) + 1)
      }
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])
  }, [items])

  const filtered = useMemo(() => {
    if (selectedTags.size === 0) return items
    return items.filter((it) => (it.tags || []).some((t) => selectedTags.has(t)))
  }, [items, selectedTags])

  const maxTiles = 20 // 4 x 5 grid
  const toShow = filtered.slice(0, maxTiles)
  const placeholders = Math.max(0, maxTiles - toShow.length)

  const toggleTag = (t: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev)
      next.has(t) ? next.delete(t) : next.add(t)
      return next
    })
  }

  const submit = async () => {
    if (!isAuthenticated) {
      alert("로그인이 필요합니다.")
      return
    }
    if (!title.trim() || !body.trim()) {
      alert("제목/내용을 작성해주세요.")
      return
    }
    const tagsArr = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
    try {
      const res = await authenticatedFetch(
        "/api/v1/qna/questions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: title.trim(), body: body.trim(), tags: tagsArr, category }),
          autoLogoutOn401: true,
        } as any
      )
      // optimistic add on top
      setItems((prev) => [{ id: res.id, title: res.title, body: res.body, tags: res.tags || [], createdAt: res.createdAt }, ...prev])
      setShowCreate(false)
      setTitle("")
      setBody("")
      setTags("")
    } catch (e: any) {
      alert(e?.message || "생성 실패")
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">QnA 테스트 보드</h1>
          <p className="text-sm text-muted-foreground">카테고리 4x5 타일, 태그 집계/필터, 빠른 질문 작성</p>
        </div>
        <div className="flex gap-2">
          {CATEGORIES.map((c) => (
            <Button key={c} variant={category === c ? "default" : "outline"} size="sm" onClick={() => setCategory(c)}>
              {c}
            </Button>
          ))}
          <Button size="sm" onClick={() => setShowCreate((s) => !s)}>{showCreate ? "작성 닫기" : "새 질문"}</Button>
        </div>
      </div>

      {/* Tag selector just below category row */}
      <div className="rounded-xl border bg-card text-card-foreground">
        <div className="p-3 border-b text-sm text-muted-foreground">태그 선택</div>
        <div className="p-3 flex flex-wrap gap-2">
          {tagCounts.length === 0 && <span className="text-xs text-muted-foreground">태그 없음</span>}
          {tagCounts.map(([t, n]) => {
            const active = selectedTags.has(t)
            return (
              <button
                key={t}
                onClick={() => toggleTag(t)}
                className={`text-xs px-2 py-1 rounded-full border ${
                  active ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-muted"
                }`}
              >
                #{t} <span className="opacity-70">{n}</span>
              </button>
            )
          })}
          {selectedTags.size > 0 && (
            <button
              onClick={() => setSelectedTags(new Set())}
              className="text-xs px-2 py-1 rounded-full border bg-background hover:bg-muted"
            >
              필터 해제
            </button>
          )}
        </div>
      </div>

      {/* Quick create panel */}
      {showCreate && (
        <div className="rounded-xl border bg-card text-card-foreground p-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((c) => (
              <Button key={c} variant={category === c ? "default" : "outline"} size="sm" onClick={() => setCategory(c)}>
                {c}
              </Button>
            ))}
          </div>
          <input
            className="w-full border rounded-md px-3 py-2 text-sm bg-background"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            rows={6}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="내용 (Markdown 가능)"
          />
          <input
            className="w-full border rounded-md px-3 py-2 text-sm bg-background"
            placeholder="태그 (쉼표로 구분)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={submit}>등록</Button>
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              취소
            </Button>
          </div>
        </div>
      )}

      {/* 4 x 5 grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
        {toShow.map((q) => (
          <div key={q.id} className="border rounded-lg p-3 bg-card text-card-foreground hover:shadow-sm transition-shadow aspect-square flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <div className="text-sm font-medium line-clamp-2 min-w-0">{q.title}</div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap ${q.answered ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-yellow-100 text-yellow-800 border-yellow-300'}`}
              >
                {q.answered ? '해결됨' : '대기'}
              </span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground line-clamp-3">{q.body}</div>
            <div className="mt-auto pt-2 flex flex-wrap gap-1">
              {(q.tags || []).slice(0, 4).map((t) => (
                <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full border bg-background">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        ))}
        {Array.from({ length: placeholders }).map((_, i) => (
          <button
            key={`ph-${i}`}
            onClick={() => setShowCreate(true)}
            className="border-2 border-dashed rounded-lg p-3 bg-background/50 hover:bg-background transition-colors aspect-square flex items-center justify-center text-sm text-muted-foreground"
          >
            새 질문 작성
          </button>
        ))}
      </div>
    </main>
  )
}
