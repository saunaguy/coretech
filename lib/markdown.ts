export type TocItem = { id: string; text: string; depth: number }

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-_]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
}

export async function renderMarkdownWithToc(md: string): Promise<{ html: string; toc: TocItem[] }> {
  const { marked } = await import("marked")
  const tokens = marked.lexer(md)
  const toc: TocItem[] = []
  // Collect TOC for h2/h3
  tokens.forEach((t: any) => {
    if (t.type === "heading" && (t.depth === 2 || t.depth === 3)) {
      const id = slugify(String(t.text || ""))
      toc.push({ id, text: String(t.text || ""), depth: t.depth })
    }
  })
  let html = marked.parse(md) as string
  // Inject ids into h2/h3 headings for anchor links
  toc.forEach((item) => {
    const esc = item.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const reH2 = new RegExp(`<h${item.depth}>(\\s*)${esc}(\\s*)</h${item.depth}>`, "g")
    html = html.replace(reH2, `<h${item.depth} id="${item.id}">$1${item.text}$2</h${item.depth}>`)
  })
  return { html, toc }
}

