"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { authenticatedFetch } from "@/lib/auth"

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter()
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000").replace(/\/+$/, '')
  const onDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return
    try {
      await authenticatedFetch(`${base}/api/v1/board/posts/${id}`, { method: "DELETE" })
      router.replace("/board")
    } catch (e) {
      alert("삭제 권한이 없거나 오류가 발생했습니다.")
    }
  }
  return (
    <Button size="sm" variant="destructive" onClick={onDelete}>
      삭제
    </Button>
  )
}

