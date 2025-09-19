import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import QAList from "@/components/site/QAList"

export const dynamic = "force-dynamic"

async function getQna(params?: { category?: string; status?: string }) {
  try {
    const base = process.env.INTERNAL_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
    const search = new URLSearchParams()
    if (params?.category) search.set("category", params.category)
    if (params?.status) search.set("status", params.status)
    const qs = search.toString()
    const res = await fetch(`${base}/api/v1/qna/questions${qs ? `?${qs}` : ""}`, { cache: "no-store" })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function QnaPage({ searchParams }: { searchParams?: { category?: string; status?: string } }) {
  const items = await getQna(searchParams)
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Q&amp;A</CardTitle>
            <Button asChild size="sm" variant="outline">
              <Link href="/qna/new">질문하기</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="text-sm text-muted-foreground">카테고리/상태로 필터링</div>
            <div className="flex gap-2">
              <Link href="/qna?category=server" className="text-sm underline">server</Link>
              <Link href="/qna?category=network" className="text-sm underline">network</Link>
              <Link href="/qna?category=others" className="text-sm underline">others</Link>
              <Link href="/qna?status=waiting" className="text-sm underline">대기</Link>
              <Link href="/qna?status=done" className="text-sm underline">완료</Link>
            </div>
          </div>
          <QAList
            items={items.map((q: any) => ({
              id: String(q.id),
              question: q.title,
              author: q.author?.username || "",
              answered: !!q.answered,
              createdAt: q.createdAt || "",
              excerpt: q.body || "",
              category: q.category,
            }))}
          />
        </CardContent>
      </Card>
    </main>
  )
}
