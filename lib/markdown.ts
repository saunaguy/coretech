import { marked, Renderer } from 'marked'

export type TocItem = { depth: number; id: string; text: string }

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
}

export async function renderMarkdownWithToc(md: string): Promise<{ html: string; toc: TocItem[] }> {
  const toc: TocItem[] = []
  const renderer = new Renderer()

  renderer.heading = (text: string, level: number) => {
    const id = slugify(text)
    toc.push({ depth: level, id, text })
    return `<h${level} id="${id}">${text}</h${level}>`
  }

  renderer.code = (code: string, infostring?: string) => {
    const lang = (infostring || '').split(/\s+/)[0]
    const escaped = code.replace(/</g, '&lt;').replace(/>/g, '&gt;')
    return `
<div class="relative group">
  <pre class="bg-slate-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto"><code${lang ? ` class="language-${lang}"` : ''}>${escaped}</code></pre>
  <button class="copy-btn opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 h-8 px-2 text-xs rounded-md border bg-background/70">Copy</button>
  </div>
`
  }

  marked.setOptions({ renderer, gfm: true, breaks: false, mangle: false, headerIds: false })
  const html = marked.parse(md) as string
  return { html, toc }
}

