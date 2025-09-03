"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter()
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
  const onDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return
    const r = await fetch(`${base}/api/v1/board/posts/${id}`, { method: "DELETE" })
    if (r.ok) router.replace("/board")
  }
  return (
    <Button size="sm" variant="destructive" onClick={onDelete}>
      삭제
    </Button>
  )
}

