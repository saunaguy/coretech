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
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const suggested = [
    "linux",
    "server",
    "network",
    "docker",
    "nginx",
    "bash",
    "permissions",
  ]
  const [category, setCategory] = useState<"server" | "network" | "others">("others")
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!title.trim() || !body.trim()) return
    setLoading(true)
    try {
      const manual = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
      const uniqueTags = Array.from(new Set([...
        selectedTags,
        ...manual,
      ]))
      const payload = {
        title,
        body,
        category,
        tags: uniqueTags,
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
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              className="border rounded-md px-3 py-2 text-sm bg-background"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
            >
              <option value="server">server</option>
              <option value="network">network</option>
              <option value="others">others</option>
            </select>
            <input
              className="flex-1 border rounded-md px-3 py-2 text-sm"
              placeholder="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <textarea
            className="w-full border rounded-md px-3 py-2 text-sm h-44"
            placeholder="내용"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">추천 태그(클릭하여 추가/제거)</div>
            <div className="flex flex-wrap gap-2">
              {suggested.map((t) => {
                const active = selectedTags.includes(t)
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() =>
                      setSelectedTags((prev) =>
                        prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
                      )
                    }
                    className={`px-2 py-1 rounded border text-xs ${
                      active ? "bg-primary text-primary-foreground" : "bg-background"
                    }`}
                  >
                    #{t}
                  </button>
                )
              })}
            </div>
          </div>
          <input
            className="w-full border rounded-md px-3 py-2 text-sm"
            placeholder="태그(쉼표로 구분, 예: linux, server)"
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

