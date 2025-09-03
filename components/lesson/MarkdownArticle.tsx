export default function MarkdownArticle({ html }: { html: string }) {
  return (
    <article
      className="prose prose-sm sm:prose max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

