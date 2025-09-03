import Link from "next/link"

export const dynamic = "force-dynamic"

async function fetchJson<T>(path: string, revalidate = 30): Promise<T> {
  const base = process.env.INTERNAL_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
  const res = await fetch(`${base}${path}`, { next: { revalidate } })
  if (!res.ok) throw new Error(`Failed to fetch ${path}`)
  return (await res.json()) as T
}

type NoticeDetail = { id: number | string; title: string; body_md: string; label?: string; created_at?: string }

export default async function NoticeDetailPage({ params }: { params: { id: string } }) {
  let n: NoticeDetail | null = null
  try {
    n = await fetchJson<NoticeDetail>(`/api/v1/notice/${params.id}`)
  } catch {
    n = null
  }
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
      <Link href="/notice" className="text-sm text-muted-foreground hover:underline">
        ← 목록으로
      </Link>
      {!n ? (
        <div className="text-muted-foreground">공지 정보를 불러오지 못했습니다.</div>
      ) : (
        <>
          <h1 className="text-2xl font-bold">{n.title}</h1>
          <div className="text-sm text-muted-foreground">{n.created_at}</div>
          <article className="prose prose-sm sm:prose max-w-none whitespace-pre-wrap">{n.body_md}</article>
        </>
      )}
    </main>
  )
}
