"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { authenticatedFetch } from "@/lib/auth"

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter()
  const onDelete = async () => {
    if (!confirm("정말 게시글을 삭제하시겠어요?")) return
    try {
      await authenticatedFetch(`/api/v1/board/posts/${id}`, { method: "DELETE" })
      router.replace("/board")
    } catch (e) {
      alert("삭제 권한이 없습니다.")
    }
  }
  return (
    <Button size="sm" variant="destructive" onClick={onDelete} data-testid="board-delete-button">
      삭제
    </Button>
  )
}
