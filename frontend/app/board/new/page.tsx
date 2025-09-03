"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function BoardNewPage() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!title.trim() || !body.trim()) return
    setLoading(true)
    try {
      const r = await fetch(`${base}/api/v1/board/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      })
      if (r.ok) {
        const data = await r.json()
        router.push(`/board/${data.id ?? ""}` || "/board")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle>새 글 작성</CardTitle>
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
              {loading ? "등록 중..." : "등록"}
            </Button>
            <Button asChild variant="outline">
              <a href="/board">취소</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

