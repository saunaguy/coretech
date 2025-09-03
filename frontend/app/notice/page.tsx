import Link from "next/link"

export const dynamic = "force-dynamic"

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

type Notice = { id: number | string; title: string; label?: string; created_at?: string }

export default async function NoticePage() {
  const items = await tryFetchJson<Notice[]>(`/api/v1/notice?limit=50`, [])
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-4">공지사항</h1>
      <ul className="divide-y">
        {items.map((n) => (
          <li key={n.id} className="py-3">
            <div className="flex items-start justify-between gap-3">
              <Link href={`/notice/${n.id}`} className="font-medium hover:underline text-foreground">
                {n.title}
              </Link>
              {n.label && (
                <span className="text-[10px] px-2 py-0.5 rounded-full border bg-gray-100 text-gray-700 border-gray-200">
                  {n.label}
                </span>
              )}
            </div>
            {n.created_at && <div className="text-xs text-muted-foreground mt-1">{n.created_at}</div>}
          </li>
        ))}
      </ul>
    </main>
  )
}
