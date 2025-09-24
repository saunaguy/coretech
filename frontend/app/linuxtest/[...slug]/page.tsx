import fs from 'fs/promises'
import path from 'path'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

async function resolveBaseDir(): Promise<string> {
  const cand = [
    path.join(process.cwd(), 'content', 'linux', 'pages'),
    path.join(process.cwd(), 'frontend', 'content', 'linux', 'pages'),
  ]
  for (const p of cand) {
    try { const st = await fs.stat(p); if (st.isDirectory()) return p } catch {}
  }
  return cand[0]
}

async function isFile(p: string) {
  try { const st = await fs.stat(p); return st.isFile() } catch { return false }
}

async function resolveMdPath(slugParts: string[]): Promise<{ abs: string, rel: string } | null> {
  const base = await resolveBaseDir()
  const joined = path.join(base, ...slugParts)
  const last = slugParts[slugParts.length - 1] || ''

  // 1) exact .md path (if URL already has .md)
  if (/\.md$/i.test(last)) {
    if (await isFile(joined)) return { abs: joined, rel: path.relative(base, joined) }
  }
  // 2) add .md
  const withExt = joined + '.md'
  if (await isFile(withExt)) return { abs: withExt, rel: path.relative(base, withExt) }
  // 3) index.md in directory
  const indexMd = path.join(joined, 'index.md')
  if (await isFile(indexMd)) return { abs: indexMd, rel: path.relative(base, indexMd) }
  return null
}

export default async function LinuxTestDetail({ params }: { params: { slug: string[] } }) {
  const found = await resolveMdPath(params.slug)
  if (!found) return notFound()

  const md = await fs.readFile(found.abs, 'utf8')
  const title = found.rel.replace(/\\\\/g, '/').replace(/\.md$/i, '')

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            <CardDescription>
              <Link href="/linuxtest" className="underline hover:no-underline">목록으로</Link>
            </CardDescription>
          </CardHeader>
          <CardContent className="md-prose md-prose-lg">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{md}</ReactMarkdown>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
