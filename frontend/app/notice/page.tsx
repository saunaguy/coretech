import Link from "next/link"
import { format } from "date-fns";

type Notice = {
  id: number
  title: string
  label?: string
  author?: string
  created_at?: string
}

async function fetchJson<T>(path: string, revalidate = 30): Promise<T> {
  const base = (process.env.INTERNAL_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000").replace(/\/+$/, '')
  const res = await fetch(`${base}${path}`, { next: { revalidate } })
  if (!res.ok) throw new Error(`Failed to fetch ${path}`)
  return (await res.json()) as T
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

export const dynamic = "force-dynamic"

export default async function NoticePage() {
  const items = await fetchJson<Notice[]>(`/api/v1/notice?limit=100`, 10)
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-bold">공지사항</h1>
        <Link href="/notice/new" className="text-sm text-primary hover:underline">새 공지</Link>
      </div>
      <ul className="divide-y">
        {items.map((n) => (
          <li key={n.id} className="py-3">
            <div className="flex items-start justify-between gap-3">
              <Link href={`/notice/${n.id}`} className="font-medium hover:underline text-foreground">
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
        {items.length === 0 && (
          <li className="py-6 text-sm text-muted-foreground">등록된 공지가 없습니다.</li>
        )}
      </ul>
    </main>
  )
}

