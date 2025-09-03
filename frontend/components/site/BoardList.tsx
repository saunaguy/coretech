import Link from "next/link"
import { CalendarDays, Eye, ThumbsUp, User, ChevronRight } from "lucide-react"

type BoardItem = {
  id: string
  title: string
  author?: string
  views?: number
  likes?: number
  createdAt?: string
}

export default function BoardList({
  items,
  showMeta = true,
  hrefPrefix = "/board",
}: {
  items: BoardItem[]
  showMeta?: boolean
  hrefPrefix?: string
}) {
  return (
    <ul className="divide-y">
      {items.map((item) => (
        <li key={item.id} className="group py-4">
          <Link href={`${hrefPrefix}/${item.id}`} className="block">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="font-medium text-foreground line-clamp-2 group-hover:underline">
                  {item.title}
                </div>
                {showMeta && (
                  <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-4 gap-y-1 items-center">
                    <span className="inline-flex items-center gap-1"><User className="h-3.5 w-3.5" />{item.author || "익명"}</span>
                    {item.createdAt && (
                      <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{item.createdAt}</span>
                    )}
                    {typeof item.views === "number" && (
                      <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{item.views}</span>
                    )}
                    {typeof item.likes === "number" && (
                      <span className="inline-flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5" />{item.likes}</span>
                    )}
                  </div>
                )}
              </div>
              <ChevronRight className="h-4 w-4 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
