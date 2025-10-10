"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { authenticatedFetch } from "@/lib/auth"

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter()
  const onDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return
    try {
      await authenticatedFetch(`/api/v1/board/posts/${id}`, { method: "DELETE" })
      router.replace("/board")
    } catch (e) {
      alert("You are not authorized to delete this post.")
    }
  }
  return (
    <Button size="sm" variant="destructive" onClick={onDelete} data-testid="board-delete-button">
      Delete
    </Button>
  )
}
