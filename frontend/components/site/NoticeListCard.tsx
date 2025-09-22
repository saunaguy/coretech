import Link from "next/link"
import { format } from "date-fns";

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

type Notice = {
  id: string | number
  title: string
  label?: "중요" | "공지" | "업데이트" | "이벤트" | string
  author?: string
  created_at?: string
}

function LabelBadge({ label }: { label?: string }) {
  const map: Record<string, string> = {
    중요: "bg-red-100 text-red-700 border-red-200",
    공지: "bg-blue-100 text-blue-700 border-blue-200",
    업데이트: "bg-emerald-100 text-emerald-700 border-emerald-200",
    이벤트: "bg-purple-100 text-purple-700 border-purple-200",
  }
  const cls = map[label || ""] || "bg-gray-100 text-gray-700 border-gray-200"
  return <span className={`text-[10px] px-2 py-0.5 rounded-full border ${cls}`}>{label || "일반"}</span>
}

export default async function NoticeListCard() {
  const items = await tryFetchJson<Notice[]>("/api/v1/notice?limit=5", [])
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="font-semibold">공지사항</div>
        <Link href="/notice" className="text-sm text-muted-foreground hover:underline">
          더보기
        </Link>
      </div>
      <div className="p-4">
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground">표시할 공지가 없습니다.</div>
        ) : (
          <ul className="divide-y">
            {items.map((n) => (
              <li key={n.id} className="py-3">
                <div className="flex items-start justify-between gap-3">
                  <Link href={`/notice/${n.id}`} className="font-medium hover:underline text-foreground line-clamp-2">
                    {n.title}
                  </Link>
                  <LabelBadge label={n.label} />
                </div>
                <div className="text-xs text-muted-foreground mt-1 flex gap-3">
                  {n.author && <span>{n.author}</span>}
                  {n.created_at && <span>{format(new Date(n.created_at), 'yyyy-MM-dd HH:mm')}</span>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

