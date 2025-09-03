import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DailyList from "@/components/site/DailyList"

export const dynamic = "force-dynamic"

async function getDaily(category?: string) {
  try {
    const base = process.env.INTERNAL_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
    const qs = category ? `?category=${encodeURIComponent(category)}` : ""
    const res = await fetch(`${base}/api/v1/daily/tests${qs}`, { cache: "no-store" })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function DailyPage() {
  const [linux, server, network] = await Promise.all([
    getDaily("linux"),
    getDaily("server"),
    getDaily("network"),
  ])
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle>데일리 테스트</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
