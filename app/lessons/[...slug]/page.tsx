import fs from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import MarkdownArticle from '@/components/lesson/MarkdownArticle'
import { renderMarkdownWithToc } from '@/lib/markdown'

function getMdPath(slugParts: string[]) {
  // handle /lessons/plan → content/lessons/plan.md
  const rel = slugParts.length === 1 && slugParts[0] === 'plan'
    ? 'plan.md'
    : path.join(...slugParts) + '.md'
  return path.join(process.cwd(), 'content', 'lessons', rel)
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const decoded = slug.map((s) => decodeURIComponent(s))
  const filePath = getMdPath(decoded)
  if (!fs.existsSync(filePath)) {
    console.error('[lessons] not found:', filePath)
    return notFound()
  }

  const md = await fs.promises.readFile(filePath, 'utf-8')
  const { html, toc } = await renderMarkdownWithToc(md)

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
      <aside className="hidden lg:block">
        <div className="sticky top-8">
          <div className="text-sm font-semibold mb-2">목차</div>
          <nav className="space-y-1 text-sm">
            {toc.map((t, i) => (
              <a key={i} className="block hover:underline" style={{ paddingLeft: (t.depth - 1) * 8 }} href={`#${t.id}`}>
                {t.text}
              </a>
            ))}
            {toc.length === 0 && <div className="text-muted-foreground">헤더가 없습니다.</div>}
          </nav>
        </div>
      </aside>
      <MarkdownArticle html={html} />
    </main>
  )
}
