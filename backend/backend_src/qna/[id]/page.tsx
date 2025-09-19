"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Qna = {
  id: number
  title: string
  body: string
  answered?: boolean
  category?: string
  tags?: string[]
  createdAt?: string
}

export default function QnaDetailPage({ params }: { params: { id: string } }) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
  const { id } = params
  const [data, setData] = useState<Qna | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const r = await fetch(`${base}/api/v1/qna/questions/${id}`, { cache: "no-store" })
        if (r.ok) setData(await r.json())
        else setData(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-muted-foreground">로딩 중...</div>
      </main>
    )
  }
  if (!data) {
    return (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-muted-foreground">질문을 찾을 수 없습니다.</div>
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {data.title}
              {data.category && (
                <span className="ml-2 text-xs text-muted-foreground align-middle">[{data.category}]</span>
              )}
              {data.answered ? (
                <span className="ml-2 text-xs text-green-600 align-middle">완료</span>
              ) : (
                <span className="ml-2 text-xs text-amber-600 align-middle">대기</span>
              )}
            </CardTitle>
            <Button asChild size="sm" variant="outline">
              <Link href={`/qna/${id}/edit`}>수정</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground mb-4">{data.createdAt || ""}</div>
          <div className="whitespace-pre-wrap leading-relaxed">{data.body}</div>
          {Array.isArray(data.tags) && data.tags.length > 0 && (
            <div className="mt-4 text-xs text-muted-foreground">태그: {data.tags.join(", ")}</div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
