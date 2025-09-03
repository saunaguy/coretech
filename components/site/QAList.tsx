import Link from "next/link"

type QAItem = {
  id: string
  question: string
  author: string
  answered: boolean
  createdAt: string
  excerpt?: string
}

export default function QAList({ items, hrefPrefix = "/qna" }: { items: QAItem[]; hrefPrefix?: string }) {
  return (
    <ul className="divide-y">
      {items.map((q) => (
        <li key={q.id} className="py-3">
          <div className="flex items-start justify-between gap-3">
            <Link href={`${hrefPrefix}/${q.id}`} className="font-medium hover:underline text-foreground">
              {q.question}
            </Link>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full border ${q.answered ? "bg-green-100 text-green-700 border-green-200" : "bg-amber-100 text-amber-700 border-amber-200"}`}
            >
              {q.answered ? "답변완료" : "대기"}
            </span>
          </div>
          {q.excerpt && <div className="text-sm text-muted-foreground mt-1 line-clamp-2 whitespace-pre-wrap">{q.excerpt}</div>}
          <div className="text-xs text-muted-foreground mt-1 flex gap-3">
            <span>{q.author}</span>
            <span>{q.createdAt}</span>
          </div>
        </li>
      ))}
    </ul>
  )
}
