"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { getCurrentUser, logout } from "@/lib/auth"
import { Button } from "@/components/ui/button"

export function UserMenu() {
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    const u = getCurrentUser()
    setUsername(u?.username ?? null)
  }, [])

  if (!username) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/login" className="underline">
          로그인
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm">{username}</span>
      <Button size="sm" variant="outline" onClick={() => logout()}>로그아웃</Button>
    </div>
  )
}

