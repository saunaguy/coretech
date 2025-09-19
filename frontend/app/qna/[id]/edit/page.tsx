"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function QnaEditPage() {
  // Use relative paths so Next.js rewrites proxy to backend
  const params = useParams() as { id: string }
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [tags, setTags] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      const r = await fetch(`/api/v1/qna/questions/${params.id}`)
      if (r.ok) {
        const q = await r.json()
        setTitle(q.title || "")
        setBody(q.body || "")
        setTags(Array.isArray(q.tags) ? q.tags.join(", ") : "")
      }
    }
    load()
  }, [params.id])

  const update = async () => {
    setLoading(true)
    try {
      const payload: any = {
        title,
        body,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }
      const r = await fetch(`/api/v1/qna/questions/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (r.ok) router.push(`/qna/${params.id}`)
    } finally {
      setLoading(false)
    }
  }

  const remove = async () => {
    const r = await fetch(`/api/v1/qna/questions/${params.id}`, { method: "DELETE" })
    if (r.status === 204) router.push("/qna")
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle>질문 수정/삭제</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <input
            className="w-full border rounded-md px-3 py-2 text-sm"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full border rounded-md px-3 py-2 text-sm h-44"
            placeholder="내용"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <input
            className="w-full border rounded-md px-3 py-2 text-sm"
            placeholder="태그(쉼표로 구분)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={update} disabled={loading}>
              {loading ? "저장 중..." : "저장"}
            </Button>
            <Button variant="outline" onClick={remove}>
              삭제
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

