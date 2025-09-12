"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/AuthProvider"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"

export default function Header() {
  const { theme, setTheme } = useTheme()
  const { isAuthenticated, user, logout } = useAuth()
  const router = useRouter()
  const params = useSearchParams()
  const alerted = useRef(false)

  useEffect(() => {
    // Show one-time notice if redirected due to lack of permission
    if (!alerted.current && params.get('denied') === '1') {
      alerted.current = true
      toast.error('접근 권한이 없습니다.', { duration: 3000 })
      // Clean the query param from URL
      router.replace('/')
    }
  }, [params, router])

  const headerClassName = theme === 'dark' 
    ? 'bg-[#000080] text-white' 
    : 'bg-primary text-primary-foreground';

  return (
    <header className={`sticky top-0 z-50 w-full border-b border-border/40 shadow-sm backdrop-blur ${headerClassName}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">CoreTech</Link>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-baseline space-x-4">
              <Link href="/linux" className="hover:text-primary transition-colors">Linux 기초</Link>
              <Link href="/board" className="hover:text-primary transition-colors">게시판</Link>
              <Link href="/qna" className="hover:text-primary transition-colors">Q&A</Link>
              <Link href="/about" className="hover:text-primary transition-colors">소개</Link>
              {!isAuthenticated ? (
                <>
                  <Link href="/login" className="hover:text-primary transition-colors">로그인</Link>
                  <Link href="/register" className="hover:text-primary transition-colors">회원가입</Link>
                </>
              ) : (
                <>
                  <span className="text-sm opacity-80">{user?.username || user?.email}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-white/10 dark:hover:bg-white/10"
                    onClick={() => {
                      logout()
                      router.push("/")
                    }}
                  >
                    로그아웃
                  </Button>
                </>
              )}
            </nav>
            <Button
              aria-label="테마 전환"
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">테마 전환</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
