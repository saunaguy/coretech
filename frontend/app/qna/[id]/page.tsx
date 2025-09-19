import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import CommentSection from "@/components/CommentSection"
import LikeButton from "@/components/LikeButton"
import { cookies } from 'next/headers'
import ViewTracker from '@/components/ViewTracker'
import { authenticatedFetch } from '@/lib/auth'

export const dynamic = "force-dynamic"

async function getQuestion(id: string, token: string | null) {
  try {
    const base = process.env.INTERNAL_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://backend:8000"
    const res = await fetch(`${base.replace(/\/+$/, '')}/api/v1/qna/questions/${id}`, { cache: "no-store" })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null;
  }
}



export default async function QnaDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const token = cookies().get('token')?.value || null

  const question = await getQuestion(id, token)

  if (!question) {
    return (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-muted-foreground">질문을 찾을 수 없습니다.</div>
      </main>
    )
  }

  const createdAt = (question.createdAt || question.created_at || '')

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="w-full">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex items-center gap-2">
                  {question.category && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${
                      (question.category || '').toLowerCase() === 'server'
                        ? 'bg-blue-100 text-blue-700 border-blue-200'
                        : (question.category || '').toLowerCase() === 'network'
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {(question.category || '').toLowerCase() === 'server'
                        ? 'Server'
                        : (question.category || '').toLowerCase() === 'network'
                        ? 'Network'
                        : 'Other'}
                    </span>
                  )}
                  <span className="font-medium truncate">{question.title}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${question.answered ? 'bg-green-100 text-green-700 border-green-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                  {question.answered ? '완료' : '대기'}
                </span>
              </div>
            </CardTitle>
            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href={`/qna/${id}/edit`}>수정</Link>
              </Button>
              {/* LikeButton 추가 */}
              <LikeButton
                parentId={question.id}
                parentType="question"
                initialLikes={question.likes || 0}
                token={token} // Pass the token
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground mb-4 flex gap-3">
            {createdAt && <span>{new Date(createdAt).toLocaleString()}</span>}
            {typeof question.views === "number" && <span>조회 {question.views}</span>}
          </div>
          <div className="whitespace-pre-wrap leading-relaxed">{question.body}</div>
          {Array.isArray(question.tags) && question.tags.length > 0 && (
            <div className="mt-4 text-xs text-muted-foreground">태그: {question.tags.join(", ")}</div>
          )}
        </CardContent>
      </Card>
      {/* CommentSection 추가 */}
      <CommentSection parentId={question.id} parentType="question" />
      <ViewTracker id={id} type="qna" />
    </main>
  )
}
