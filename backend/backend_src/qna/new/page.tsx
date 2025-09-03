"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function QnaNewPage() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [tags, setTags] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!title.trim() || !body.trim()) return
    setLoading(true)
    try {
      const payload = {
        title,
        body,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }
      const r = await fetch(`${base}/api/v1/qna/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (r.ok) {
        const data = await r.json()
        router.push(`/qna/${data.id}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle>질문 작성</CardTitle>
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
          <Button onClick={submit} disabled={loading}>
            {loading ? "등록 중..." : "등록"}
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}

