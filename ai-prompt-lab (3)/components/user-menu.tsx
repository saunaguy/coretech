"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings, Shield } from "lucide-react"
import { getCurrentUser, logout, type User as UserType } from "@/lib/auth"
import Link from "next/link"

export function UserMenu() {
  const [user, setUser] = useState<UserType | null>(null)

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  if (!user) {
    return (
      <Link href="/login">
        <Button variant="outline" size="sm">
          로그인
        </Button>
      </Link>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <User className="w-4 h-4" />
          {user.username}
          {user.role === "admin" && <Shield className="w-3 h-3 text-yellow-600" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem disabled>
          <User className="w-4 h-4 mr-2" />
          {user.username}
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <span className="text-xs text-muted-foreground">{user.role === "admin" ? "관리자" : "일반 사용자"}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {user.role === "admin" && (
          <DropdownMenuItem asChild>
            <Link href="/admin">
              <Settings className="w-4 h-4 mr-2" />
              관리자 페이지
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={logout} className="text-red-600">
          <LogOut className="w-4 h-4 mr-2" />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
