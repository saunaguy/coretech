import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

async function getQna(id: string) {
  try {
    const base = process.env.INTERNAL_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
    const res = await fetch(`${base}/api/v1/qna/questions/${id}`, { cache: "no-store" })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function QnaDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const q = await getQna(id)
  if (!q) {
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
            <CardTitle>{q.title}</CardTitle>
            <Button asChild size="sm" variant="outline">
              <Link href={`/qna/${id}/edit`}>수정</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-wrap leading-relaxed">{q.body}</div>
          {Array.isArray(q.tags) && q.tags.length > 0 && (
            <div className="mt-4 text-xs text-muted-foreground">태그: {q.tags.join(", ")}</div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
