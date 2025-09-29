import Link from "next/link"

export const dynamic = "force-dynamic"

async function getDaily(category?: string) {
  try {
    const base = (process.env.INTERNAL_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000").replace(/\/+$/, "")
    const qs = category ? `?category=${encodeURIComponent(category)}` : ""
    const res = await fetch(`${base}/api/v1/daily/tests${qs}`, { cache: "no-store" })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function DailyTestPage() {
  const [linux, server, network] = await Promise.all([
    getDaily("linux"),
    getDaily("server"),
    getDaily("network"),
  ])
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">데일리 테스트</h1>
      <div className="space-y-8">
        <section>
          <div className="font-semibold mb-2">리눅스 기초</div>
          <ul className="divide-y">
            {(linux || []).slice(0,3).map((it: any) => (
              <li key={it.id} className="py-3">
                <Link href={`/dailytest/${it.id}`} className="hover:underline">
                  {it.title}
                </Link>
                {it.createdAt && (
                  <div className="text-xs text-muted-foreground mt-1">{it.createdAt}</div>
                )}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <div className="font-semibold mb-2">서버</div>
          <ul className="divide-y">
            {(server || []).slice(0,3).map((it: any) => (
              <li key={it.id} className="py-3">
                <Link href={`/dailytest/${it.id}`} className="hover:underline">
                  {it.title}
                </Link>
                {it.createdAt && (
                  <div className="text-xs text-muted-foreground mt-1">{it.createdAt}</div>
                )}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <div className="font-semibold mb-2">네트워크</div>
          <ul className="divide-y">
            {(network || []).slice(0,3).map((it: any) => (
              <li key={it.id} className="py-3">
                <Link href={`/dailytest/${it.id}`} className="hover:underline">
                  {it.title}
                </Link>
                {it.createdAt && (
                  <div className="text-xs text-muted-foreground mt-1">{it.createdAt}</div>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}
