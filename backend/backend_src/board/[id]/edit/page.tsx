"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function BoardEditPage({ params }: { params: { id: string } }) {
  const { id } = params
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      const r = await fetch(`${base}/api/v1/board/posts/${id}`)
      if (r.ok) {
        const p = await r.json()
        setTitle(p.title || "")
        setBody(p.body || "")
      }
    }
    load()
  }, [id])

  const submit = async () => {
    if (!title.trim() || !body.trim()) return
    setLoading(true)
    try {
      const r = await fetch(`${base}/api/v1/board/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      })
      if (r.ok) router.push(`/board/${id}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle>글 수정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <input
            className="w-full border rounded-md px-3 py-2 text-sm"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full border rounded-md px-3 py-2 text-sm h-52"
            placeholder="내용"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={submit} disabled={loading}>
              {loading ? "저장 중..." : "저장"}
            </Button>
            <Button asChild variant="outline">
              <a href={`/board/${id}`}>취소</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

