"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { Sun, Moon, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMobileSidebar } from "@/lib/MobileSidebarContext" // New import

export default function Header() {
  const { theme, setTheme } = useTheme()
  const { toggleMobileSidebar } = useMobileSidebar() // Use context

  const headerClassName = theme === 'dark' 
    ? 'bg-[#000080] text-white' 
    : 'bg-primary text-primary-foreground';

  return (
    <header className={`sticky top-0 z-50 w-full border-b border-border/40 shadow-sm backdrop-blur ${headerClassName}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center min-w-0"> {/* Added min-w-0 to prevent shrinking */}
            <Link href="/" className="text-xl font-bold flex-shrink-0">CoreTech</Link> {/* Added flex-shrink-0 */}
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-baseline space-x-4">
              <Link href="/linux" className="hover:text-primary transition-colors">Linux 기초</Link>
              <Link href="/board" className="hover:text-primary transition-colors">게시판</Link>
              <Link href="/qna" className="hover:text-primary transition-colors">Q&A</Link>
              <Link href="/about" className="hover:text-primary transition-colors">소개</Link>
              <Link href="/login" className="hover:text-primary transition-colors">로그인</Link>
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
