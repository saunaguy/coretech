"use client"

import { useEffect, useMemo, useState } from "react"

type Hit = { section: string; index: string; title: string; snippet: string }

export default function LessonSearch({ apiBase }: { apiBase?: string }) {
  const [q, setQ] = useState("")
  const [hits, setHits] = useState<Hit[] | null>(null)
  const [loading, setLoading] = useState(false)

  const canSearch = useMemo(() => q.trim().length >= 1, [q])

  useEffect(() => {
    const ctrl = new AbortController()
    const run = async () => {
      if (!canSearch) { setHits(null); return }
      setLoading(true)
      try {
        const url = `${apiBase || ""}/api/v1/lesson-search?q=${encodeURIComponent(q)}&limit=50`
        const r = await fetch(url, { cache: "no-store", signal: ctrl.signal })
        if (!r.ok) { setHits([]); return }
        setHits(await r.json())
      } catch {
        setHits([])
      } finally {
        setLoading(false)
      }
    }
    // debounce a little
    const t = setTimeout(run, 180)
    return () => { clearTimeout(t); ctrl.abort() }
  }, [q, apiBase, canSearch])

  return (
    <div className="rounded-xl border p-4 space-y-3">
      <div className="flex items-center gap-2">
        <input
          className="w-full border rounded-md px-3 py-2 text-sm bg-background"
          placeholder="강의 내용 포함 검색"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      {loading && <div className="text-sm text-muted-foreground">검색 중…</div>}
      {!loading && hits && hits.length === 0 && (
        <div className="text-sm text-muted-foreground">검색 결과가 없습니다.</div>
      )}
      {!loading && hits && hits.length > 0 && (
        <ul className="divide-y">
          {hits.map((h, i) => (
            <li key={`${h.section}-${h.index}-${i}`} className="py-2">
              <a className="font-medium hover:underline" href={`/lessons/${h.section}/${h.index}`}>{h.title || `${h.section}-${h.index}`}</a>
              <div className="text-xs text-muted-foreground line-clamp-2">{h.snippet}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

