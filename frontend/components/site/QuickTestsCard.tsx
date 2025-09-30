import Link from "next/link"
import { cookies } from "next/headers"

type FetchInit = RequestInit & { next?: { revalidate?: number } }

type TestItem = { id: number | string; title: string; category?: string }
type UserState = { solved: Array<number | string>; favorites: Array<number | string> }

function extractOrder(title: string | undefined, fallback: number): number {
  if (!title) return fallback
  const match = title.match(/(\d+)\s*$/)
  if (!match) return fallback
  const parsed = Number(match[1])
  return Number.isFinite(parsed) ? parsed : fallback
}

function formatTitle(rawTitle: string | undefined, fallbackLabel: string, order: number): string {
  const cleaned = (rawTitle || "").replace(/\?+/g, "").trim()
  const indexLabel = String(order).padStart(2, "0")
  if (!cleaned) {
    return `${fallbackLabel} 테스트 ${indexLabel}`
  }
  if (/\d+$/.test(cleaned)) {
    return cleaned.replace(/\d+$/, indexLabel)
  }
  if (cleaned.endsWith("테스트")) {
    return `${cleaned} ${indexLabel}`
  }
  return `${cleaned} 테스트 ${indexLabel}`
}

async function fetchJson<T>(path: string, init?: FetchInit, revalidate = 30): Promise<T> {
  const base = process.env.INTERNAL_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
  const mergedInit: FetchInit = { ...(init || {}) }
  if (mergedInit.cache !== "no-store") {
    mergedInit.next = { ...(mergedInit.next || {}), revalidate }
  }
  const res = await fetch(`${base}${path}`, mergedInit)
  if (!res.ok) throw new Error(`Failed to fetch ${path}`)
  return (await res.json()) as T
}

async function tryFetchJson<T>(path: string, fallback: T, init?: FetchInit): Promise<T> {
  try {
    return await fetchJson<T>(path, init)
  } catch {
    return fallback
  }
}

function ProgressBar({ percent }: { percent: number }) {
  const pct = Math.max(0, Math.min(100, percent))
  return (
    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
      <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
    </div>
  )
}

export default async function QuickTestsCard() {
  const cookieStore = cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ")
  const authInit: FetchInit | undefined = cookieHeader
    ? {
        headers: {
          Cookie: cookieHeader,
        },
        credentials: "include",
        cache: "no-store",
      }
    : undefined

  const userStatePromise = authInit
    ? tryFetchJson<UserState>("/api/v1/daily/user-state", { solved: [], favorites: [] }, authInit)
    : Promise.resolve<UserState>({ solved: [], favorites: [] })

  const [linux, database, network, server, userState] = await Promise.all([
    tryFetchJson<TestItem[]>("/api/v1/daily/tests?category=linux", []),
    tryFetchJson<TestItem[]>("/api/v1/daily/tests?category=database", []),
    tryFetchJson<TestItem[]>("/api/v1/daily/tests?category=network", []),
    tryFetchJson<TestItem[]>("/api/v1/daily/tests?category=server", []),
    userStatePromise,
  ])

  const solvedSet = new Set((userState?.solved || []).map((value) => String(value)))
  const catalogue: Record<string, TestItem[]> = {
    linux,
    database,
    network,
    server,
  }

  const cards = [
    { key: "linux", label: "Linux" },
    { key: "database", label: "Database" },
    { key: "network", label: "Network" },
    { key: "server", label: "Server" },
  ].map((cfg) => {
    const tests = (catalogue[cfg.key] || []).map((item, idx) => ({
      ...item,
      order: extractOrder(item.title, idx + 1),
    }))
    const sorted = [...tests].sort((a, b) => a.order - b.order)
    const total = sorted.length
    let solved = 0
    for (const item of sorted) {
      if (solvedSet.has(String(item.id))) solved += 1
    }
    const percent = total > 0 ? Math.min(100, Math.round((solved / total) * 100)) : 0
    const next = sorted.find((item) => !solvedSet.has(String(item.id))) || sorted[0]
    const href = next ? `/daily/${next.id}` : "/daily"
    const displayOrder = next ? next.order : 0
    const title = next ? formatTitle(next.title, cfg.label, displayOrder || 1) : cfg.label
    return {
      ...cfg,
      total,
      solved,
      percent,
      title,
      href,
      displayOrder,
    }
  })

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="font-semibold">간단한 테스트</div>
        <Link href="/daily" className="text-sm text-muted-foreground hover:underline">
          전체보기
        </Link>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card) => (
          <div key={card.key} className="rounded-lg border bg-background/40 p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground uppercase">
              <span>{card.label}</span>
              <span>{card.total ? `${card.solved}/${card.total}` : "0/0"}</span>
            </div>
            <Link href={card.href} className="font-medium text-foreground hover:underline line-clamp-2">
              {card.title}
            </Link>
            <ProgressBar percent={card.percent} />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{card.displayOrder ? `#${String(card.displayOrder).padStart(2, "0")}` : ""}</span>
              <span>{card.percent}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
