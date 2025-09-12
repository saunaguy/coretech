import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import DeleteButton from "@/components/board/DeleteButton"

export const dynamic = "force-dynamic"

async function getPost(id: string) {
  try {
    const base = (process.env.INTERNAL_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000").replace(/\/+$/, '')
    const res = await fetch(`${base}/api/v1/board/posts/${id}`, { cache: "no-store" })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function BoardDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const post = await getPost(id)
  if (!post) {
    return (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-muted-foreground">게시글을 찾을 수 없습니다.</div>
      </main>
    )
  }
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-xl">{post.title}</CardTitle>
            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href={`/board/${id}/edit`}>수정</Link>
              </Button>
              <DeleteButton id={id} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground mb-4 flex gap-3">
            {post.createdAt && <span>{post.createdAt}</span>}
            {typeof post.views === "number" && <span>조회 {post.views}</span>}
            {typeof post.likes === "number" && <span>추천 {post.likes}</span>}
          </div>
          <div className="whitespace-pre-wrap leading-relaxed">{post.body}</div>
        </CardContent>
      </Card>
      <div className="mt-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/board">목록으로</Link>
        </Button>
      </div>
    </main>
  )
}

 
