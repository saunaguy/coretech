import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import QAList from "@/components/site/QAList"

export const dynamic = "force-dynamic"

async function getQna() {
  try {
    const base = process.env.INTERNAL_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
    const res = await fetch(`${base}/api/v1/qna/questions`, { cache: "no-store" })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function QnaPage() {
  const items = await getQna()
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
          <QAList
            items={items.map((q: any) => ({
              id: String(q.id),
              question: q.title,
              author: "",
              answered: false,
              createdAt: "",
              excerpt: q.body || "",
            }))}
          />
        </CardContent>
      </Card>
    </main>
  )
}
