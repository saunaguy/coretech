import fs from 'fs/promises'
import path from 'path'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

async function listMarkdownFiles(dir: string, base = dir): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files: string[] = []
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      files.push(...(await listMarkdownFiles(full, base)))
    } else if (e.isFile() && e.name.endsWith('.md')) {
      const rel = path.relative(base, full).replace(/\\\\/g, '/')
      files.push(rel)
    }
  }
  return files.sort()
}

function stripExt(p: string) { return p.replace(/\\.md$/i, '') }

export default async function LinuxTestLayout({ children }: { children: React.ReactNode }) {
  const base = await resolveBaseDir()
  let files: string[] = []
  try { files = await listMarkdownFiles(base) } catch {}

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <aside className="lg:sticky lg:top-24 self-start">
            <Card>
              <CardHeader>
                <CardTitle>문서 목록</CardTitle>
              </CardHeader>
              <CardContent>
                {files.length === 0 ? (
                  <p className="text-sm text-muted-foreground">문서를 찾지 못했습니다.</p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {files.map((f) => (
                      <li key={f}>
                        <Link href={`/linuxtest/${encodeURI(stripExt(f))}`} className="hover:underline">
                          {f}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </aside>
          <main>
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

