import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import CommentSection from "@/components/CommentSection" // CommentSection import
import LikeButton from "@/components/LikeButton"         // LikeButton import
import { cookies } from 'next/headers'
import {jwtDecode} from 'jwt-decode'; // jwtDecode 직접 import

export const dynamic = "force-dynamic"

async function getQna(id: string) {
  try {
    const base = process.env.INTERNAL_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
    const res = await fetch(`${base}/api/v1/qna/questions/${id}`, { cache: "no-store" })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function QnaDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value || null
  const q = await getQna(id)

  let currentUserId: string | null = null;
  if (token) {
    try {
      const decodedToken: any = jwtDecode(token); // jwtDecode 직접 사용
      currentUserId = decodedToken.sub;
    } catch (error) {
      console.error("Error decoding token in server component:", error);
    }
  }

  if (!q) {
    return (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-muted-foreground">질문을 찾을 수 없습니다.</div>
      </main>
    )
  }

  // Q&A 질문에는 author_id 필드가 있다고 가정합니다.
  // 백엔드 Question 모델에 author_id가 int로 정의되어 있으므로, 비교 시 타입을 맞춥니다.
  const isAuthor = currentUserId && q.author_id === parseInt(currentUserId);

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{q.title}</CardTitle>
            <div className="flex gap-2"> {/* 버튼들을 감싸는 div 추가 */}
              {isAuthor && (
                <Button asChild size="sm" variant="outline">
                  <Link href={`/qna/${id}/edit`}>수정</Link>
                </Button>
              )}
              {/* LikeButton 추가 */}
              <LikeButton
                parentId={q.id}
                parentType="question"
                initialLikes={q.likes || 0} // Q&A 질문에 likes 필드가 없을 수 있으므로 기본값 0
                currentUserId={currentUserId}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-wrap leading-relaxed">{q.body}</div>
          {Array.isArray(q.tags) && q.tags.length > 0 && (
            <div className="mt-4 text-xs text-muted-foreground">태그: {q.tags.join(", ")}</div>
          )}
        </CardContent>
      </Card>
      {/* CommentSection 추가 */}
      <CommentSection parentId={q.id} parentType="question" />
    </main>
  )
}