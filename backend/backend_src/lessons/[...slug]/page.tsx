import { promises as fs } from "fs"
import path from "path"
import MarkdownArticle from "@/components/lesson/MarkdownArticle"
import { renderMarkdownWithToc } from "@/lib/markdown"
import Link from "next/link"

export default async function LessonPage({ params }: { params: { slug: string[] } }) {
  const segs = params.slug
  const file = segs[segs.length - 1] + ".md"
  const group = segs[0] || ""
  const p = path.join(process.cwd(), "content", "lessons", group, file)
  let html = ""
  try {
    const md = await fs.readFile(p, "utf-8")
    html = (await renderMarkdownWithToc(md)).html
  } catch {}
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
      <Link href="/lessons" className="text-sm text-muted-foreground hover:underline">
        ← 강의자료
      </Link>
      {html ? (
        <MarkdownArticle html={html} />
      ) : (
        <div className="text-muted-foreground">강의 본문을 불러오지 못했습니다.</div>
      )}
    </main>
  )
}

