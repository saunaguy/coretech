'use client'

import Link from "next/link"
import { useMobileSidebar } from "@/lib/MobileSidebarContext"
import { useAuth } from "@/components/auth/AuthProvider"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

export default function MobileSidebar() {
  const { isMobileSidebarOpen, closeMobileSidebar } = useMobileSidebar()
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <Sheet open={isMobileSidebarOpen} onOpenChange={closeMobileSidebar}>
      <SheetContent side="left" className="w-[250px] sm:w-[300px] flex flex-col">
        <SheetHeader>
          <SheetTitle>CoreTech 메뉴</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-grow py-4">
          <nav className="flex flex-col space-y-2">
            <Link href="/linux?open=1" className="text-lg font-medium hover:text-primary transition-colors" onClick={closeMobileSidebar}>Linux 기초</Link>
            <Link href="/board" className="text-lg font-medium hover:text-primary transition-colors" onClick={closeMobileSidebar}>게시판</Link>
            <Link href="/qna" className="text-lg font-medium hover:text-primary transition-colors" onClick={closeMobileSidebar}>Q&A</Link>
            <Link href="/about" className="text-lg font-medium hover:text-primary transition-colors" onClick={closeMobileSidebar}>소개</Link>
            <Separator className="my-2" />
            {!isAuthenticated ? (
              <>
                <Link href="/login" className="text-lg font-medium hover:text-primary transition-colors" onClick={closeMobileSidebar}>로그인</Link>
                <Link href="/register" className="text-lg font-medium hover:text-primary transition-colors" onClick={closeMobileSidebar}>회원가입</Link>
              </>
            ) : (
              <>
                {user?.role === 'admin' && (
                  <Link href="/admin" className="text-lg font-medium hover:text-primary transition-colors font-semibold text-yellow-500" onClick={closeMobileSidebar}>관리자</Link>
                )}
                <span className="text-sm opacity-80 pt-2">환영합니다, {user?.username || user?.email}님!</span>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-lg font-medium"
                  onClick={() => {
                    logout()
                    closeMobileSidebar()
                  }}
                >
                  로그아웃
                </Button>
              </>
            )}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}