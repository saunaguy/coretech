import Link from "next/link"
import { Eye, ThumbsUp } from "lucide-react" // 아이콘 임포트

type QAItem = {
  id: string
  question: string
  author: string
  answered: boolean
  createdAt: string
  excerpt?: string
  views?: number // 조회수 추가
  likes?: number // 추천수 추가
  category?: string
}

export default function QAList({ items, hrefPrefix = "/qna" }: { items: QAItem[]; hrefPrefix?: string }) {
  const catStyle = (cat?: string) => {
    switch ((cat || '').toLowerCase()) {
      case 'server':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'network':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }
  const catLabel = (cat?: string) => {
    switch ((cat || '').toLowerCase()) {
      case 'server':
        return 'Server'
      case 'network':
        return 'Network'
      default:
        return 'Other'
    }
  }
  return (
    <ul className="divide-y">
      {items.map((q) => (
        <li key={q.id} className="py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex items-center gap-2">
              {q.category && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${catStyle(q.category)}`}>
                  {catLabel(q.category)}
                </span>
              )}
              <Link href={`${hrefPrefix}/${q.id}`} className="font-medium hover:underline text-foreground line-clamp-2">
                {q.question}
              </Link>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${q.answered ? "bg-green-100 text-green-700 border-green-200" : "bg-amber-100 text-amber-700 border-amber-200"}`}
            >
              {q.answered ? "완료" : "대기"}
            </span>
          </div>
          {q.excerpt && <div className="text-sm text-muted-foreground mt-1 line-clamp-2 whitespace-pre-wrap">{q.excerpt}</div>}
          <div className="text-xs text-muted-foreground mt-1 flex gap-3">
            <span>{q.author}</span>
            {q.createdAt && (
              <span>
                {new Date(q.createdAt).toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' })}
                {' '}
                {new Date(q.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            {typeof q.views === "number" && (
              <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {q.views}</span>
            )}
            {typeof q.likes === "number" && (
              <span className="inline-flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5" /> {q.likes}</span>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
