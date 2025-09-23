"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { authenticatedFetch } from '@/lib/auth'
import { useAuth } from '@/components/auth/AuthProvider'

export default function DeleteNoticeButton({ id }: { id: number }) {
  const router = useRouter()
  const { user } = useAuth()

  const onDelete = async () => {
    if (!user || user.role !== 'admin') {
      alert('관리자만 삭제할 수 있습니다.')
      return
    }
    if (!confirm('해당 공지를 삭제하시겠습니까?')) return
    try {
      await authenticatedFetch(`/api/v1/notice/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, autoLogoutOn401: true } as any)
      router.push('/notice')
    } catch (e: any) {
      alert(e?.message || '삭제에 실패했습니다.')
    }
  }

  if (!user || user.role !== 'admin') return null
  return (
    <Button variant="outline" size="sm" onClick={onDelete}>삭제</Button>
  )
}

