"use client"

import { useEffect, useMemo, useRef, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { authenticatedFetch } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function NewNoticePage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [label, setLabel] = useState("")
  const [body, setBody] = useState("")
  const [pinned, setPinned] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const editorBoxRef = useRef<HTMLDivElement | null>(null)
  const previewBoxRef = useRef<HTMLDivElement | null>(null)

  const syncHeights = useCallback(() => {
    const ta = textareaRef.current
    if (ta) {
      ta.style.height = 'auto'
      ta.style.overflow = 'hidden'
      ta.style.resize = 'none'
      ta.style.height = `${ta.scrollHeight}px`
    }
    const e = editorBoxRef.current
    const p = previewBoxRef.current
    if (e && p) {
      // measure full box heights (header + content)
      const target = Math.max(e.scrollHeight, p.scrollHeight, 360)
      e.style.height = `${target}px`
      p.style.height = `${target}px`
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      alert('관리자만 접근할 수 있습니다.')
      router.replace('/notice')
    }
  }, [isAuthenticated, user, router])

  useEffect(() => {
    // Sync when body/help toggled changes layout
    syncHeights()
  }, [body, showHelp, syncHeights])

  useEffect(() => {
    // Respond to container resizes (e.g., fonts/images in preview)
    const e = editorBoxRef.current
    const p = previewBoxRef.current
    if (!e || !p) return
    const ro = new ResizeObserver(() => syncHeights())
    ro.observe(e)
    ro.observe(p)
    const onResize = () => syncHeights()
    window.addEventListener('resize', onResize)
    // initial
    syncHeights()
    return () => {
      try { ro.disconnect() } catch {}
      window.removeEventListener('resize', onResize)
    }
  }, [syncHeights])

  const submit = async () => {
    if (!title.trim() || !body.trim()) {
      alert('제목과 내용을 입력해주세요.')
      return
    }
    setSubmitting(true)
    try {
      const res = await authenticatedFetch('/api/v1/notice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body_md: body, label: label || undefined, is_pinned: pinned }),
        // if this fails with 401, auto logout to keep admin flow consistent
        autoLogoutOn401: true,
      } as any)
      router.push(`/notice/${res.id}`)
    } catch (e: any) {
      alert(e?.message || '등록에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const insertTemplate = () => {
    const template = `# 제목을 입력하세요\n\n> 간단한 안내 문구를 여기에 작성합니다.\n\n---\n\n## 요약\n- 핵심 내용 1\n- 핵심 내용 2\n\n## 상세 내용\n자유롭게 Markdown으로 작성하세요. **굵게**, _기울임_, \n코드 블록:\n\n\`\`\`bash\n# 예시 명령어\necho "hello"\n\`\`\`\n\n## 표 예시\n| 항목 | 내용 |\n| --- | --- |\n| 안내 | 설명을 적습니다 |\n| 일정 | 2025-01-01 |\n\n---\n\n감사합니다.`
    setBody((prev) => (prev?.trim() ? prev + "\n\n" + template : template))
  }

  const insertTable = () => {
    const table = `\n\n| 항목 | 내용 |\n| --- | --- |\n| 예시 | 값을 입력하세요 |\n`
    setBody((prev) => (prev || "") + table)
  }

  const helper = useMemo(() => (
    <div className="text-xs text-muted-foreground space-y-2">
      <div className="font-medium">Markdown 가이드</div>
      <ul className="list-disc pl-5 space-y-1">
        <li>제목: <code># 제목</code></li>
        <li>굵게/기울임: <code>**굵게**</code>, <code>_기울임_</code></li>
        <li>목록: <code>- 항목</code></li>
        <li>코드 블록: <code>```언어</code> ... <code>```</code></li>
        <li>표: <code>| 열1 | 열2 |</code> + <code>| --- | --- |</code></li>
        <li>구분선: <code>---</code></li>
      </ul>
    </div>
  ), [])

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
      <h1 className="text-2xl font-bold">새 공지 등록</h1>
      <div className="space-y-3">
        <input
          className="w-full border rounded-md px-3 py-2 text-sm bg-background"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex gap-2 items-center">
          <select
            className="border rounded-md px-3 py-2 text-sm bg-background"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          >
            <option value="">라벨 없음</option>
            <option value="공지">공지</option>
            <option value="중요">중요</option>
            <option value="업데이트">업데이트</option>
            <option value="이벤트">이벤트</option>
          </select>
          <label className="text-sm flex items-center gap-2">
            <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} />
            상단 고정
          </label>
          <div className="flex-1" />
          <Button variant="outline" size="sm" onClick={insertTemplate}>템플릿 넣기</Button>
          <Button variant="outline" size="sm" onClick={insertTable}>표 추가</Button>
          <Button variant="ghost" size="sm" onClick={() => setShowHelp((s) => !s)}>{showHelp ? '가이드 닫기' : '가이드 보기'}</Button>
        </div>
        {showHelp && (
          <div className="border rounded-md p-3">
            {helper}
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          <div ref={editorBoxRef} className="border rounded-md overflow-hidden">
            <div className="border-b px-3 py-2 text-xs text-muted-foreground">작성</div>
            <textarea
              ref={textareaRef}
              className="w-full p-3 text-sm bg-background min-h-[360px] outline-none"
              placeholder="Markdown 형식으로 내용을 작성하세요"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
          <div ref={previewBoxRef} className="border rounded-md overflow-hidden">
            <div className="border-b px-3 py-2 text-xs text-muted-foreground">미리보기</div>
            <div className="p-3 md-prose md-prose-lg min-h-[360px]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {body || '여기에 미리보기가 표시됩니다.'}
              </ReactMarkdown>
            </div>
          </div>
        </div>
        <div className="pt-2 flex gap-2">
          <Button onClick={submit} disabled={submitting}>등록</Button>
          <Button variant="outline" onClick={() => setBody("")}>초기화</Button>
        </div>
      </div>
    </main>
  )
}
