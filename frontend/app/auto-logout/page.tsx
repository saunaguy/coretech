'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth/AuthProvider'

export default function AutoLogoutPage() {
  const router = useRouter()
  const { logout } = useAuth()

  useEffect(() => {
    logout().catch(() => {})
  }, [logout])

  return (
    <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6 text-center">
      <h1 className="text-2xl font-bold">자동 로그아웃되었습니다</h1>
      <p className="text-muted-foreground">오랫동안 활동이 없어 보안을 위해 로그아웃했어요.</p>
      <div className="pt-4">
        <Button onClick={() => { try { router.push('/') } catch {}; try { if (typeof window !== 'undefined') window.location.href = '/' } catch {} }}>확인</Button>
      </div>
    </main>
  )
}

