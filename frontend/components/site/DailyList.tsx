import Link from "next/link"

type DailyItem = {
  id: number
  title: string
  createdAt?: string
}

export default function DailyList({ items, hrefPrefix = "/daily" }: { items: DailyItem[]; hrefPrefix?: string }) {
  return (
    <ul className="divide-y">
      {items.map((it) => (
        <li key={it.id} className="py-3">
          <Link href={`${hrefPrefix}/${it.id}`} className="font-medium hover:underline text-foreground">
            {it.title}
          </Link>
          {it.createdAt && <div className="text-xs text-muted-foreground mt-1">{it.createdAt}</div>}
        </li>
      ))}
    </ul>
  )
}

