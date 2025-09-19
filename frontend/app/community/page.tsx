import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import QAList from "@/components/site/QAList"
import DailyList from "@/components/site/DailyList"

export const dynamic = "force-dynamic"

async function fetchJson<T>(path: string): Promise<T> {
  try {
    const base = process.env.INTERNAL_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
    const res = await fetch(`${base}${path}`, { cache: "no-store" })
    if (!res.ok) return [] as unknown as T
    return (await res.json()) as T
  } catch {
    return [] as unknown as T
  }
}

export default async function CommunityPage() {
  const [qna, linux, server, network] = await Promise.all([
    fetchJson<any[]>("/api/v1/qna/questions"),
    fetchJson<any[]>("/api/v1/daily/tests?category=linux"),
    fetchJson<any[]>("/api/v1/daily/tests?category=server"),
    fetchJson<any[]>("/api/v1/daily/tests?category=network"),
  ])

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Q&amp;A</CardTitle>
            <Link className="text-sm underline" href="/qna">전체 보기</Link>
          </div>
        </CardHeader>
        <CardContent>
          <QAList
            items={qna.map((q: any) => ({
              id: String(q.id),
              question: q.title,
              author: q.author?.username || "",
              answered: !!q.answered,
              createdAt: q.createdAt || q.created_at || "",
              excerpt: q.body || "",
              category: q.category,
            }))}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>데일리 테스트</CardTitle>
            <Link className="text-sm underline" href="/daily">전체 보기</Link>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section>
            <div className="font-semibold mb-2">리눅스 기초</div>
            <DailyList items={linux} />
          </section>
          <section>
            <div className="font-semibold mb-2">서버</div>
            <DailyList items={server} />
          </section>
          <section>
            <div className="font-semibold mb-2">네트워크</div>
            <DailyList items={network} />
          </section>
        </CardContent>
      </Card>
    </main>
  )
}

