import Link from "next/link"

async function fetchJson<T>(path: string, revalidate = 30): Promise<T> {
  const base = process.env.INTERNAL_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
  const res = await fetch(`${base}${path}`, { next: { revalidate } })
  if (!res.ok) throw new Error(`Failed to fetch ${path}`)
  return (await res.json()) as T
}

async function tryFetchJson<T>(path: string, fallback: T): Promise<T> {
  try {
    return await fetchJson<T>(path)
  } catch {
    return fallback
  }
}

type TestItem = { id: number | string; title: string; category?: string }

function ProgressBar({ percent }: { percent: number }) {
  const pct = Math.max(0, Math.min(100, percent))
  return (
    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
      <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
    </div>
  )
}

export default async function QuickTestsCard() {
  const [linux, server, network] = await Promise.all([
    tryFetchJson<TestItem[]>("/api/v1/daily/tests?category=linux", []),
    tryFetchJson<TestItem[]>("/api/v1/daily/tests?category=server", []),
    tryFetchJson<TestItem[]>("/api/v1/daily/tests?category=network", []),
  ])
  const progress = await tryFetchJson<Record<string, number | { percent: number }>>(
    "/api/v1/daily/progress?by=category",
    { linux: 0, server: 0, network: 0 }
  )

  function getPercent(key: string): number {
    const v = (progress as any)[key]
    const raw = typeof v === "number" ? v : typeof v?.percent === "number" ? v.percent : 0
    return raw <= 1 ? raw * 100 : raw
  }

  const rows = [
    { key: "linux", title: linux[0]?.title || "Linux", href: linux[0] ? `/daily/${linux[0].id}` : "/daily" },
    { key: "server", title: server[0]?.title || "Server", href: server[0] ? `/daily/${server[0].id}` : "/daily" },
    { key: "network", title: network[0]?.title || "Network", href: network[0] ? `/daily/${network[0].id}` : "/daily" },
  ]

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="font-semibold">간단한 테스트</div>
        <Link href="/daily" className="text-sm text-muted-foreground hover:underline">
          더보기
        </Link>
      </div>
      <div className="p-4 space-y-4">
        {rows.map((r) => (
          <div key={r.key} className="flex items-center gap-3">
            <span className="text-xs px-2 py-0.5 rounded-full border bg-gray-100 text-gray-700 border-gray-200 capitalize min-w-16 text-center">
              {r.key}
            </span>
            <div className="flex-1 min-w-0">
              <Link href={r.href} className="block font-medium text-foreground hover:underline truncate">
                {r.title}
              </Link>
              <div className="mt-2">
                <ProgressBar percent={getPercent(r.key)} />
              </div>
            </div>
            <div className="text-xs text-muted-foreground w-10 text-right">{Math.round(getPercent(r.key))}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}
