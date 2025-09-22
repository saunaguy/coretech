import Link from "next/link"
import { Eye, ThumbsUp } from "lucide-react" // 아이콘 임포트
import { format } from "date-fns";

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
  const catInfo = (cat?: string) => {
    const key = (cat || '').toLowerCase()
    if (key === 'server') return { emoji: '🖥', text: 'server' }
    if (key === 'network') return { emoji: '🌐', text: 'network' }
    return { emoji: '❓', text: 'other' }
  }
  return (
    <ul className="divide-y">
      {items.map((q) => (
        <li key={q.id} className="py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex items-center gap-2">
              <span className="inline-block font-mono text-sm text-muted-foreground shrink-0 w-28" aria-label={catInfo(q.category).text}>
                [{catInfo(q.category).emoji} {catInfo(q.category).text}]
              </span>
              <Link href={`${hrefPrefix}/${q.id}`} className="font-medium hover:underline text-foreground line-clamp-2">
                {q.question}
              </Link>
            </div>
            <div className="flex-shrink-0">
              <span className="text-lg" role="img" aria-label={q.answered ? '완료' : '대기'}>
                {q.answered ? '✅' : '⏳'}
              </span>
            </div>
          </div>
          {q.excerpt && <div className="text-sm text-muted-foreground mt-1 line-clamp-2 whitespace-pre-wrap">{q.excerpt}</div>}
          <div className="text-xs text-muted-foreground mt-2 flex gap-3">
            <span>{q.author}</span>
            {q.createdAt && (
              <span>
                {format(new Date(q.createdAt), 'yyyy-MM-dd HH:mm')}
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
