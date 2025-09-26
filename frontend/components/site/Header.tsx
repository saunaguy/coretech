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

import React, { useState, useRef } from "react"

export default function Header() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { toggleMobileSidebar } = useMobileSidebar()
  const { isAuthenticated, user, logout } = useAuth()

  // State for dropdowns
  const [isLearningDropdownOpen, setIsLearningDropdownOpen] = useState(false)
  const [isCommunityDropdownOpen, setIsCommunityDropdownOpen] = useState(false)

  // Refs for managing timeouts
  const learningTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const communityTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Use CSS variables via tokens to keep colors consistent across themes
  const headerClassName = 'bg-header text-header-foreground'

  // Hover handlers for Learning dropdown
  const handleLearningMouseEnter = () => {
    if (learningTimeoutRef.current) {
      clearTimeout(learningTimeoutRef.current)
    }
    setIsLearningDropdownOpen(true)
  }
  const handleLearningMouseLeave = () => {
    learningTimeoutRef.current = setTimeout(() => {
      setIsLearningDropdownOpen(false)
    }, 150) // Small delay to allow moving to dropdown content
  }

  // Hover handlers for Community dropdown
  const handleCommunityMouseEnter = () => {
    if (communityTimeoutRef.current) {
      clearTimeout(communityTimeoutRef.current)
    }
    setIsCommunityDropdownOpen(true)
  }
  const handleCommunityMouseLeave = () => {
    communityTimeoutRef.current = setTimeout(() => {
      setIsCommunityDropdownOpen(false)
    }, 150) // Small delay to allow moving to dropdown content
  }

  return (
    <header className={`sticky top-0 z-50 w-full border-b border-border/40 shadow-sm backdrop-blur ${headerClassName}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center min-w-0"> {/* Added min-w-0 to prevent shrinking */}
            <Link href="/" className="text-xl font-bold flex-shrink-0">CoreTechNet</Link> {/* Added flex-shrink-0 */}
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
                  <DropdownMenuItem>
                    <Link href="/lesson">Linux 기초</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/practice">실습</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* 커뮤니티 Dropdown */}
              <DropdownMenu open={isCommunityDropdownOpen} onOpenChange={setIsCommunityDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hover:text-primary transition-colors"
                    onMouseEnter={handleCommunityMouseEnter}
                    onMouseLeave={handleCommunityMouseLeave}
                  >
                    커뮤니티
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  onMouseEnter={handleCommunityMouseEnter}
                  onMouseLeave={handleCommunityMouseLeave}
                >
                  <DropdownMenuItem>
                    <Link href="/notice">공지사항</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/board">게시판</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/qna">Q&A</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/about">소개</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
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
              className="md:hidden" // Visible only on small screens
              onClick={toggleMobileSidebar} // Use context to toggle
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">메뉴 열기</span>
            </Button>
            <Button
              aria-label="테마 전환"
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex-shrink-0" // Added flex-shrink-0
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">테마 전환</span>
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile Sidebar is now rendered by LinuxPage using context */}
    </header>
  )
}
