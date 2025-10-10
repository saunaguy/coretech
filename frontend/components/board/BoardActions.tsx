"use client"

import Link from "next/link"
import DeleteButton from "@/components/board/DeleteButton"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/AuthProvider"

type PossibleAuthor =
  | string
  | { username?: string | null }
  | null
  | undefined

type BoardActionsProps = {
  postId: string
  author: PossibleAuthor
}

const normalize = (value: string | null | undefined) =>
  value?.trim().toLowerCase() ?? null

export default function BoardActions({ postId, author }: BoardActionsProps) {
  const { user } = useAuth()

  const authorUsername =
    typeof author === "string" ? author : author?.username ?? null

  const normalizedAuthor = normalize(authorUsername)
  const normalizedCurrentUser = normalize(user?.username)

  if (!normalizedAuthor || !normalizedCurrentUser) {
    return null
  }

  if (normalizedAuthor !== normalizedCurrentUser) {
    return null
  }

  return (
    <>
      <Button asChild size="sm" variant="outline">
        <Link href={`/board/${postId}/edit`} data-testid="board-edit-link">Edit</Link>
      </Button>
      <DeleteButton id={postId} />
    </>
  )
}
