import fs from 'fs'
import path from 'path'
import Link from 'next/link'

type Group = { slug: string; title: string }
type IndexJson = { groups: { slug: string; title: string }[]; notes?: string }

const CONTENT_ROOT = path.join(process.cwd(), 'content', 'lessons')

function loadIndex(): IndexJson | null {
  const p = path.join(CONTENT_ROOT, 'index.json')
  if (!fs.existsSync(p)) return null
  return JSON.parse(fs.readFileSync(p, 'utf-8'))
}

function listGroups(): Group[] {
  const idx = loadIndex()
  if (idx) return idx.groups.map(({ slug, title }) => ({ slug, title }))
  // Fallback: read subdirectories as groups
  const entries = fs.existsSync(CONTENT_ROOT) ? fs.readdirSync(CONTENT_ROOT, { withFileTypes: true }) : []
  return entries
    .filter((e) => e.isDirectory())
    .map((e) => ({ slug: e.name, title: e.name }))
}

function humanizeName(filename: string): string {
  // Drop extension
  const base = filename.replace(/\.md$/i, '')
  // Remove numeric prefix like `01_`
  const trimmed = base.replace(/^\d+_/, '')
  // Replace underscores with spaces
  return trimmed.replace(/_/g, ' ')
}

function listLessonsForGroup(groupSlug: string): { slug: string; title: string }[] {
  const dir = path.join(CONTENT_ROOT, groupSlug)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith('.md'))
    .sort((a, b) => a.localeCompare(b, 'en'))
    .map((file) => ({
      slug: `${groupSlug}/${file.replace(/\.md$/i, '')}`,
      title: humanizeName(file),
    }))
}

export default function LessonsIndex() {
  const groups = listGroups()
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Linux Lessons</h1>
        <p className="text-muted-foreground">그룹별로 정리된 강의 자료를 클릭해 바로 이동하세요.</p>
      </div>

      <div className="space-y-10">
        {groups.map((g) => (
          <section key={g.slug} className="space-y-3">
            <h2 className="text-xl font-semibold">
              {g.title}
              <span className="text-muted-foreground ml-2 text-sm">({g.slug})</span>
            </h2>
            <ul className="list-disc pl-6 space-y-3">
              {listLessonsForGroup(g.slug).map((l) => (
                <li key={l.slug}>
                  <Link className="underline hover:no-underline block py-1" href={encodeURI(`/lessons/${l.slug}`)}>
                    {l.title}
                  </Link>
                </li>
              ))}
              {listLessonsForGroup(g.slug).length === 0 && (
                <li className="text-muted-foreground">등록된 레슨 파일이 없습니다.</li>
              )}
            </ul>
          </section>
        ))}
      </div>

      <div>
        <Link className="underline" href="/lessons/plan">
          커리큘럼 계획표 보기
        </Link>
      </div>
    </main>
  )
}
