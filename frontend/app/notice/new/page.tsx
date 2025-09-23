"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { authenticatedFetch } from '@/lib/auth'
import { Button } from '@/components/ui/button'

export default function NewNoticePage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [label, setLabel] = useState("")
  const [body, setBody] = useState("")
  const [pinned, setPinned] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      alert('관리자만 접근할 수 있습니다.')
      router.replace('/notice')
    }
  }, [isAuthenticated, user, router])

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

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
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
        </div>
        <textarea
          className="w-full border rounded-md px-3 py-2 text-sm bg-background min-h-[240px]"
          placeholder="Markdown 형식으로 내용을 작성하세요"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <div className="pt-2">
          <Button onClick={submit} disabled={submitting}>등록</Button>
        </div>
      </div>
    </main>
  )
}

