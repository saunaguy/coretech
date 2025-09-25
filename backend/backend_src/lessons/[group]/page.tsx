import fs from 'fs'
import path from 'path'
import Link from 'next/link'

const CONTENT_ROOT = path.join(process.cwd(), 'backend', 'content', 'lesson')

function baseName(filename: string) {
  return filename.replace(/\.md$/i, '')
}
function humanizeFull(name: string) {
  return name.replace(/_/g, ' ')
}

function listLessons(group: string) {
  const dir = path.join(CONTENT_ROOT, group)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith('.md'))
    .sort((a, b) => a.localeCompare(b, 'en'))
    .map((file) => {
      const base = baseName(file)
      return {
        slug: `${group}/${base}`,
        title: humanizeFull(base),
      }
    })
}

export default async function LessonGroupPage({ params }: { params: Promise<{ group: string }> }) {
  const { group } = await params
  const lessons = listLessons(group)
  const titleMap: Record<string, string> = {
    'absolute-beginner': '왕초보',
    beginner: '초급',
    intermediate: '중급',
    advanced: '고급',
  }
  const display = titleMap[group] || group

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{display}</h1>
        <p className="text-muted-foreground">해당 과정의 강의 목록입니다.</p>
      </div>
      <ul className="list-disc pl-6 space-y-3">
        {lessons.map((l) => (
          <li key={l.slug}>
            <Link className="underline hover:no-underline block py-1" href={encodeURI(`/lessons/${l.slug}`)}>
              {`${display} - ${l.title}`}
            </Link>
          </li>
        ))}
        {lessons.length === 0 && <li className="text-muted-foreground">레슨 파일이 없습니다.</li>}
      </ul>
      <div>
        <Link className="underline" href="/lessons">← 모든 과정 보기</Link>
      </div>
    </main>
  )
}
