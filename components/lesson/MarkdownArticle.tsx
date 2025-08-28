"use client"

import { useEffect, useRef } from 'react'

export default function MarkdownArticle({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (target && target.classList.contains('copy-btn')) {
        const pre = target.closest('div')?.querySelector('pre > code') as HTMLElement | null
        const text = pre?.innerText || ''
        if (text) navigator.clipboard.writeText(text)
        target.textContent = 'Copied'
        setTimeout(() => (target.textContent = 'Copy'), 1200)
      }
    }
    root.addEventListener('click', onClick)
    return () => root.removeEventListener('click', onClick)
  }, [])

  return (
    <article className="prose prose-slate max-w-none dark:prose-invert" ref={ref}>
      {/* eslint-disable-next-line react/no-danger */}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  )
}

