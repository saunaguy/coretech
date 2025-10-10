'use client'

import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'

const INACTIVITY_DEFAULT = 86400

export default function IdleLogout() {
  const { isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const timerRef = useRef<number | null>(null)

  const timeoutSec = Number(process.env.NEXT_PUBLIC_INACTIVITY_SECONDS || INACTIVITY_DEFAULT)

  useEffect(() => {
    if (!isAuthenticated) {
      if (timerRef.current) window.clearTimeout(timerRef.current)
      timerRef.current = null
      return
    }
    if (pathname === '/auto-logout') {
      return
    }

    const navigateAutoLogout = () => {
      try {
        router.push('/auto-logout')
      } catch {}
      try { if (typeof window !== 'undefined') window.location.href = '/auto-logout' } catch {}
    }

    const reset = () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(async () => {
        try { await logout() } catch {}
        navigateAutoLogout()
      }, timeoutSec * 1000)
    }

    const events: (keyof DocumentEventMap)[] = ['click', 'mousemove', 'keydown', 'scroll', 'touchstart']
    events.forEach((e) => document.addEventListener(e, reset, { passive: true }))
    reset()

    const interval = window.setInterval(async () => {
      try {
        const res = await fetch('/api/v1/auth/verify-token', { credentials: 'include' })
        if (res.status === 401) {
          try { await logout() } catch {}
          navigateAutoLogout()
        }
      } catch {}
    }, Math.max(10, Math.floor(timeoutSec / 3)) * 1000)

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
      window.clearInterval(interval)
      events.forEach((e) => document.removeEventListener(e, reset))
    }
  }, [isAuthenticated, router, pathname, timeoutSec, logout])

  return null
}

