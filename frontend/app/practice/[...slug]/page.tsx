import fs from "fs"
import path from "path"
import Link from "next/link"
import { renderMarkdownWithToc } from "@/lib/markdown"

function resolveMdPath(segments: string[]): string | null {
  const base = path.join(process.cwd(), "app", "practice")
  const rel = segments.join(path.sep)
  const direct = path.join(base, rel + ".md")
  const index = path.join(base, rel, "index.md")
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return direct
  if (fs.existsSync(index) && fs.statSync(index).isFile()) return index
  return null
}

export default async function PracticeDocPage({ params }: { params: { slug: string[] } }) {
  const file = resolveMdPath(params.slug || [])
  if (!file) {
    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <h1 className="text-xl font-semibold">문서를 찾을 수 없습니다</h1>
        <p className="text-muted-foreground">경로를 확인하세요. 이 폴더 내의 .md 파일만 렌더링합니다.</p>
        <Link href="/practice" className="underline">실습 목록으로 돌아가기</Link>
      </main>
    )
  }

  const md = fs.readFileSync(file, "utf-8")
  const { html, toc } = await renderMarkdownWithToc(md)

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="mb-6">
          <Link href="/practice" className="text-sm underline">← 실습 목록</Link>
        </div>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </article>
      <aside className="hidden lg:block">
        <div className="sticky top-8 space-y-2">
          <div className="font-semibold">목차</div>
          <ul className="text-sm space-y-1">
            {toc.map((t) => (
              <li key={t.id} className={t.depth === 3 ? "pl-4" : ""}>
                <a href={`#${t.id}`} className="hover:underline">{t.text}</a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </main>
  )
}

export const dynamic = "force-dynamic"

