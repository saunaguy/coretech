"use client"

import { useState, useEffect, useCallback } from "react"
import { authenticatedFetch } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { format } from "date-fns"
import { useAuth } from "@/components/auth/AuthProvider"

type Comment = {
  id: number
  content: string
  user_id: number
  created_at: string
  author: { id: number; username: string }
  is_accepted?: boolean
}

type CommentSectionProps = {
  parentId: number
  parentType: "post" | "question"
}

const maskErrorMessage = (message: string | null | undefined, fallback: string) => {
  if (!message) {
    return fallback
  }
  const normalized = message.replace(/\\/g, "/").toLowerCase()
  return normalized.includes("docs/error.md") ? fallback : message
}

export default function CommentSection({ parentId, parentType }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null)
  const { user } = useAuth()

  const rawUserId = user?.id ?? (user as any)?.user_id ?? null
  const parseUserId = (value: unknown): number | null => {
    if (typeof value === "number") {
      return Number.isNaN(value) ? null : value
    }
    if (typeof value === "string") {
      const parsed = Number(value)
      return Number.isNaN(parsed) ? null : parsed
    }
    return null
  }
  const currentUserId = parseUserId(rawUserId)
  const isPrivileged =
    typeof (user as any)?.role === "string" &&
    ["admin", "operator"].includes((user as any).role)

  const canDeleteComment = (comment: Comment) => {
    if (!user) {
      return false
    }
    if (isPrivileged) {
      return true
    }
    return currentUserId !== null && comment.user_id === currentUserId
  }

  const fetchComments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const url = `/api/v1/${parentType}/${parentId}/comments`
      const response = await authenticatedFetch(url)
      setComments(Array.isArray(response) ? response : [])
    } catch (err: any) {
      console.error("Failed to fetch comments:", err)
      const message = typeof err?.message === "string" ? err.message : null
      setError(maskErrorMessage(message, "댓글을 불러오지 못했습니다."))
    } finally {
      setLoading(false)
    }
  }, [parentId, parentType])

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await authenticatedFetch(`/api/v1/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parent_id: parentId,
          parent_type: parentType,
          content: newComment,
        }),
      })
      setComments((prev) => [...prev, response])
      setNewComment("")

      if (parentType === "question") {
        try {
          await fetchComments()
          if (typeof window !== "undefined") {
            window.location.reload()
          }
        } catch (refreshError) {
          console.error("Failed to refresh question state after comment submit:", refreshError)
        }
      }
    } catch (err: any) {
      console.error("Failed to submit comment:", err)
      const message = typeof err?.message === "string" ? err.message : null
      setError(maskErrorMessage(message, "댓글을 등록하지 못했습니다."))
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm("정말 이 댓글을 삭제하시겠어요?")) {
      return
    }
    setPendingDeleteId(commentId)
    setError(null)
    try {
      await authenticatedFetch(`/api/v1/comments/${commentId}`, {
        method: "DELETE",
      })
      setComments((prev) => prev.filter((comment) => comment.id !== commentId))
    } catch (err: any) {
      console.error("Failed to delete comment:", err)
      const message = typeof err?.message === "string" ? err.message : null
      setError(maskErrorMessage(message, "댓글을 삭제하지 못했습니다."))
    } finally {
      setPendingDeleteId(null)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>댓글</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <p>댓글을 불러오는 중입니다...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="space-y-4">
          {comments.length === 0 && !loading && !error && <p>아직 댓글이 없습니다.</p>}
          {comments.map((comment) => {
            const canDelete = canDeleteComment(comment)
            const isDeleting = pendingDeleteId === comment.id

            return (
              <div key={comment.id} className="border-b pb-2 last:border-b-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <ReactMarkdown
                      className="md-prose md-prose-sm break-words px-4"
                      remarkPlugins={[remarkGfm]}
                      components={{
                        pre: ({ node, ...props }) => (
                          <pre {...props} className="whitespace-pre-wrap break-words" />
                        ),
                        code: ({ node, ...props }) => (
                          <code {...props} className="break-words" />
                        ),
                      }}
                    >
                      {comment.content}
                    </ReactMarkdown>
                    <p className="text-xs text-muted-foreground mt-1">
                      작성자: {comment.author?.username || "알 수 없는 사용자"}
                      <span className="ml-2">
                        {comment.created_at &&
                        !Number.isNaN(new Date(comment.created_at).getTime())
                          ? format(new Date(comment.created_at), "yyyy-MM-dd HH:mm")
                          : "날짜 정보 없음"}
                      </span>
                    </p>
                  </div>
                  {canDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteComment(comment.id)}
                      disabled={loading || isDeleting}
                      data-testid={`comment-delete-${comment.id}`}
                    >
                      삭제
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-6">
          <Textarea
            placeholder="댓글을 작성하세요..."
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
            rows={3}
          />
          <Button onClick={handleSubmitComment} disabled={loading} className="mt-2">
            댓글 작성
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
