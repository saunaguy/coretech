"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { authenticatedFetch } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider"
import { User, Clock, Tag, CheckCircle } from "lucide-react"

type QItem = {
  id: number
  title: string
  body: string
  tags: string[]
  createdAt: string
  answered: boolean
  author: { id: number; username: string; }
  views: number
  category: string
}

type Answer = {
  id: number
  body: string
  createdAt: string
  author: string // Assuming author is a simple string
  isAccepted?: boolean // To mark the best answer
}

export default function QuestionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const id = params.id as string

  const [question, setQuestion] = useState<QItem | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [newAnswer, setNewAnswer] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editingAnswerId, setEditingAnswerId] = useState<number | null>(null)
  const [editingAnswerBody, setEditingAnswerBody] = useState("")

  useEffect(() => {
    if (!id) return

    const loadData = async () => {
      setLoading(true)
      try {
        const qData = await authenticatedFetch(`/api/v1/qna/questions/${id}`)

        // The API response for a question includes its comments.
        // We map the backend's 'comment' object to the frontend's 'Answer' type.
        const questionData = {
            ...qData,
        }
        setQuestion(questionData)

        const answersData = (qData.comments || []).map((c: any) => ({
          id: c.id,
          body: c.content, // Map content from backend to body in frontend
          createdAt: c.created_at,
          author: c.author?.username || "User" + Math.floor(Math.random() * 100), // Use real author if available
          isAccepted: false, // Add logic if applicable
        }))
        setAnswers(answersData)

      } catch (e) {
        setError("데이터를 불러오는 데 실패했습니다.")
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm("정말로 이 질문을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      return
    }

    setIsDeleting(true)
    setError(null)
    try {
      await authenticatedFetch(`/api/v1/qna/questions/${id}`, {
        method: "DELETE",
      })
      router.push("/qnatest")
    } catch (err) {
      setError("질문 삭제에 실패했습니다.")
      console.error(err)
      setIsDeleting(false)
    }
  }

  const handleAnswerUpdate = async (answerId: number) => {
    if (!editingAnswerBody.trim()) return

    try {
      const updatedAnswer = await authenticatedFetch(`/api/v1/comments/${answerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editingAnswerBody }),
      })

      setAnswers(answers.map((a) => (a.id === answerId ? { ...a, body: updatedAnswer.content } : a)))
      setEditingAnswerId(null)
      setEditingAnswerBody("")
    } catch (err) {
      console.error("답변 수정에 실패했습니다.", err)
      alert("답변 수정에 실패했습니다.")
    }
  }

  const handleAnswerDelete = async (answerId: number) => {
    if (!window.confirm("정말로 이 답변을 삭제하시겠습니까?")) {
      return
    }

    try {
      await authenticatedFetch(`/api/v1/comments/${answerId}`, {
        method: "DELETE",
      })
      setAnswers(answers.filter((a) => a.id !== answerId))
    } catch (err) {
      // You might want to show a toast or a more specific error message
      console.error("답변 삭제에 실패했습니다.", err)
      alert("답변 삭제에 실패했습니다.")
    }
  }

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAnswer.trim() || !user) return

    setIsSubmitting(true)
    try {
      const response = await authenticatedFetch(`/api/v1/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newAnswer,
          parent_id: parseInt(id, 10),
          parent_type: "question",
        }),
      })

      const newComment = {
        id: response.id,
        body: response.content,
        createdAt: response.created_at,
        author: response.author.username,
        isAccepted: false,
      }

      setAnswers([...answers, newComment])
      setNewAnswer("")
    } catch (err) {
      console.error("Failed to submit answer:", err)
      alert("답변 등록에 실패했습니다.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <main className="max-w-4xl mx-auto px-4 py-12 text-center">로딩 중...</main>
  }

  if (error) {
    return <main className="max-w-4xl mx-auto px-4 py-12 text-center text-red-500">{error}</main>
  }

  if (!question) {
    return <main className="max-w-4xl mx-auto px-4 py-12 text-center">질문을 찾을 수 없습니다.</main>
  }

  const isOwner = !!user && !!question && user.username === question.author.username;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-3xl font-extrabold tracking-tight mb-2">{question.title}</CardTitle>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`/placeholder.svg`} alt={question.author.username} />
                  <AvatarFallback>{question.author.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-foreground">{question.author.username}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{new Date(question.createdAt).toLocaleDateString()}</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full border bg-secondary text-secondary-foreground capitalize">
                {question.category}
              </span>
            </div>
            {isOwner && (
              <div className="flex gap-2 flex-shrink-0">
                <Link href={`/qna/${id}/edit`} passHref>
                  <Button variant="outline" size="sm">수정</Button>
                </Link>
                <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? "삭제 중..." : "삭제"}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="py-6">
          <div className="prose dark:prose-invert max-w-none">
            <p>{question.body}</p>
          </div>
        </CardContent>
        {(question.tags && question.tags.length > 0) && (
          <CardFooter className="flex flex-wrap gap-2 pt-4 border-t">
            {question.tags.map((t) => (
              <span key={t} className="text-xs px-2 py-1 rounded-full border bg-background">
                #{t}
              </span>
            ))}
          </CardFooter>
        )}
      </Card>

      <Separator />

      {/* Answers Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{answers.length}개의 답변</h2>
        {answers.map((answer) => {
          const isEditing = editingAnswerId === answer.id
          const isOwner = user?.username === answer.author

          return (
            <Card key={answer.id} className={`${answer.isAccepted ? 'border-green-500' : ''}`}>
              <CardContent className="p-6 flex gap-4">
                <Avatar>
                  <AvatarImage src={`https://github.com/shadcn.png`} alt={answer.author} />
                  <AvatarFallback>{answer.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{answer.author}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(answer.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {isEditing ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editingAnswerBody}
                        onChange={(e) => setEditingAnswerBody(e.target.value)}
                        rows={4}
                      />
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingAnswerId(null)}>
                          취소
                        </Button>
                        <Button size="sm" onClick={() => handleAnswerUpdate(answer.id)}>
                          저장
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-card-foreground">{answer.body}</p>
                      <div className="mt-4 flex justify-between items-center">
                        {answer.isAccepted ? (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            <span className="font-semibold">채택된 답변</span>
                          </div>
                        ) : <div /> /* Empty div to keep alignment */}

                        {isOwner && (
                          <div className="flex gap-2 items-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingAnswerId(answer.id)
                                setEditingAnswerBody(answer.body)
                              }}
                            >
                              수정
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleAnswerDelete(answer.id)}>
                              삭제
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* New Answer Form */}
      <Card>
        <CardHeader>
          <CardTitle>답변 작성하기</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAnswerSubmit} className="space-y-4">
            <Textarea
              placeholder="자세하고 친절한 답변은 질문자에게 큰 도움이 됩니다."
              rows={5}
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              required
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "등록 중..." : "답변 등록"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}