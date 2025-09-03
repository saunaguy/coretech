import Link from "next/link"
import fs from "fs"
import path from "path"

function readIndex(): { slug: string; title: string }[] {
  try {
    const p = path.join(process.cwd(), "content", "lessons", "index.json")
    const j = JSON.parse(fs.readFileSync(p, "utf-8"))
    return j.groups || []
  } catch {
    return []
  }
}

function readGroupFiles(slug: string): { slug: string; title: string }[] {
  const dir = path.join(process.cwd(), "content", "lessons", slug)
  if (!fs.existsSync(dir)) return []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  let items: { slug: string; title: string }[] = []
  // root md files
  items.push(
    ...entries
      .filter((e) => e.isFile() && e.name.endsWith(".md"))
      .sort((a, b) => a.name.localeCompare(b.name, "ko"))
      .map((e) => ({ slug: `${slug}/${e.name.replace(/\.md$/i, "")}`, title: prettify(e.name) }))
  )
  // one-level deep subdir md files (first 2 per dir)
  for (const d of entries.filter((e) => e.isDirectory())) {
    const sub = path.join(dir, d.name)
    const mds = fs
      .readdirSync(sub)
      .filter((f) => f.endsWith(".md"))
      .sort((a, b) => a.localeCompare(b, "ko"))
      .slice(0, 2)
      .map((f) => ({ slug: `${slug}/${d.name}/${f.replace(/\.md$/i, "")}`, title: prettify(f) }))
    items.push(...mds)
  }
  return items
}

function prettify(name: string): string {
  return name.replace(/^\d+_?/, "").replace(/_/g, " ")
}

export default async function LessonsIndex() {
  const groups = readIndex()
  const items = groups.flatMap((g) => readGroupFiles(g.slug).slice(0, 3))
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-2xl font-bold">강의자료</h1>
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
