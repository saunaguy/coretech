import React from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import DeleteNoticeButton from '@/components/notice/DeleteNoticeButton'

type NoticeDetail = {
  id: number
  title: string
  body_md: string
  label?: string
  is_pinned?: boolean
  author?: string
  created_at?: string
  updated_at?: string
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

async function fetchJson<T>(path: string): Promise<T> {
  const base = (process.env.INTERNAL_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '')
  const res = await fetch(`${base}${path}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch')
  return (await res.json()) as T
}

export const dynamic = 'force-dynamic'

export default async function NoticeDetailPage({ params }: { params: { id: string } }) {
  const data = await fetchJson<NoticeDetail>(`/api/v1/notice/${params.id}`)
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-start justify-between gap-3">
          <h1 className="text-xl font-semibold">{data.title}</h1>
          <div className="flex items-center gap-2">
            <LabelBadge label={data.label} />
            <DeleteNoticeButton id={data.id} />
          </div>
        </div>
        <div className="px-4 py-2 text-xs text-muted-foreground flex gap-3 border-b">
          {data.author && <span>{data.author}</span>}
          {data.created_at && <span>{format(new Date(data.created_at), 'yyyy-MM-dd HH:mm')}</span>}
        </div>
        <article className="p-4 md-prose md-prose-lg">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.body_md}</ReactMarkdown>
        </article>
      </div>
      <div className="pt-2">
        <Link href="/notice" className="text-sm text-muted-foreground hover:underline">목록으로</Link>
      </div>
    </main>
  )
}
