import Link from "next/link"
import fs from "fs"
import path from "path"
import LessonSearch from "@/components/site/LessonSearch"

// Backend content lives under backend/content/lesson (numeric groups like 1-1, 2-3 ...)
const CONTENT_ROOT = path.join(process.cwd(), "backend", "content", "lesson")

function readIndex(): { slug: string; title: string }[] {
  try {
    const dirs = fs.readdirSync(CONTENT_ROOT, { withFileTypes: true })
    return dirs
      .filter((e) => e.isDirectory())
      .map((e) => ({ slug: e.name, title: e.name }))
      .sort((a, b) => a.slug.localeCompare(b.slug, "ko"))
  } catch {
    return []
  }
}

function readGroupFiles(slug: string): { slug: string; title: string }[] {
  const dir = path.join(CONTENT_ROOT, slug)
  if (!fs.existsSync(dir)) return []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  let items: { slug: string; title: string }[] = []
  // root md files (e.g., 1.md, 2.md ...)
  items.push(
    ...entries
      .filter((e) => e.isFile() && e.name.endsWith(".md"))
      .sort((a, b) => a.name.localeCompare(b.name, "ko"))
      .map((e) => ({ slug: `${slug}/${e.name.replace(/\.md$/i, "")}`, title: prettify(e.name) }))
  )
  return items
}

function prettify(name: string): string {
  return name.replace(/^\d+_?/, "").replace(/_/g, " ")
}

export default async function LessonsIndex() {
  const groups = readIndex()
  const items = groups.flatMap((g) => readGroupFiles(g.slug).slice(0, 3))
  const apiBase = (process.env.INTERNAL_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000") as string
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-2xl font-bold">강의자료</h1>
      <LessonSearch apiBase={apiBase} />
      {groups.length === 0 && <div className="text-muted-foreground">강의 그룹이 없습니다.</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it) => (
          <div key={it.slug} className="rounded-xl border bg-card text-card-foreground hover:shadow-sm transition-shadow">
            <div className="p-4">
              <Link href={`/lessons/${it.slug}`} className="font-medium hover:underline">
                {it.title}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
