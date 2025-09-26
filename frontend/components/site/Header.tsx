"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Sun, Moon, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMobileSidebar } from "@/lib/MobileSidebarContext"
import { useAuth } from "@/components/auth/AuthProvider"
import React, { useState } from "react"

export default function Header() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { toggleMobileSidebar } = useMobileSidebar()
  const { isAuthenticated, user, logout } = useAuth()

  // State for hover menus
  const [communityOpen, setCommunityOpen] = useState(false)

  // State and handlers for Learning dropdown (merged from remote)
  const [isLearningDropdownOpen, setIsLearningDropdownOpen] = useState(false);
  const handleLearningMouseEnter = () => setIsLearningDropdownOpen(true);
  const handleLearningMouseLeave = () => setIsLearningDropdownOpen(false);

  const headerClassName = 'bg-header text-header-foreground'

  return (
    <header className={`sticky top-0 z-50 w-full border-b border-border/40 shadow-sm backdrop-blur ${headerClassName}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center min-w-0">
            <Link href="/" className="text-xl font-bold flex-shrink-0">CoreTechNet</Link>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-baseline space-x-4">

              {/* 학습 Dropdown */}
              <DropdownMenu open={isLearningDropdownOpen} onOpenChange={setIsLearningDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hover:text-primary transition-colors"
                    onMouseEnter={handleLearningMouseEnter}
                    onMouseLeave={handleLearningMouseLeave}
                  >
                    학습
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  onMouseEnter={handleLearningMouseEnter}
                  onMouseLeave={handleLearningMouseLeave}
                >
                  <DropdownMenuItem asChild>
                    <Link href="/lesson">Linux 기초</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/practice">실습</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/daily">데일리</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* 커뮤니티 Dropdown with Hover */}
              <DropdownMenu open={communityOpen} onOpenChange={setCommunityOpen}>
                <div onMouseEnter={() => setCommunityOpen(true)} onMouseLeave={() => setCommunityOpen(false)}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="hover:text-primary transition-colors border-none outline-none ring-0 focus:outline-none focus:ring-0 focus:ring-offset-0"
                    >
                      커뮤니티
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent sideOffset={4}>
                    <DropdownMenuItem asChild>
                      <Link href="/notice">공지사항</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/board">게시판</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/qna">Q&A</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/about">소개</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </div>
              </DropdownMenu>

              {!isAuthenticated ? (
                <>
                  <Link href="/login" className="hover:text-primary transition-colors">로그인</Link>
                  <Link href="/register" className="hover:text-primary transition-colors">회원가입</Link>
                </>
              ) : (
                <>
                  {user?.role === 'admin' && (
                    <Link href="/admin" className="hover:text-primary transition-colors font-semibold text-yellow-500">관리자</Link>
                  )}
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
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={toggleMobileSidebar}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">메뉴 열기</span>
            </Button>
            <Button
              aria-label="테마 전환"
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex-shrink-0"
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