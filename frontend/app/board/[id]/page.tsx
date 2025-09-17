import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import DeleteButton from "@/components/board/DeleteButton"
import CommentSection from "@/components/CommentSection" // CommentSection import
import LikeButton from "@/components/LikeButton"         // LikeButton import
import { authenticatedFetch, getUser } from '@/lib/auth' // getUser 함수 import
import { cookies, headers } from 'next/headers'

import {jwtDecode} from 'jwt-decode'; // jwtDecode 직접 import
import ViewTracker from '@/components/ViewTracker';

export const dynamic = "force-dynamic"

async function getPost(id: string, token: string | null, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const base = (process.env.INTERNAL_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000").replace(/\/+$/, '')
      const url = `${base}/api/v1/board/posts/${id}`;
      console.log(`[getPost] Attempt ${i + 1}: Fetching post from URL:`, url);
      console.log(`[getPost] Token present:`, !!token);

      const data = await authenticatedFetch(url, token, {
        cache: "no-store",
      });

      console.log(`[getPost] Attempt ${i + 1}: Fetched post data:`, data);
      return data;

    } catch (error: any) {
      console.error(`[getPost] Attempt ${i + 1}: Error in getPost:`, error.message || error);
      if (error.detail) {
        console.error(`[getPost] Error detail:`, error.detail);
      }
    }
    if (i < retries - 1) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  return null;
}



export default async function BoardDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const token = cookies().get('token')?.value || null

  

  const post = await getPost(id, token)

  // 현재 로그인한 사용자 정보 가져오기 (서버 컴포넌트에서 쿠키를 통해 토큰을 직접 디코딩)
  let currentUserId: string | null = null;
  if (token) {
    try {
      const user = getUser(token); // Use getUser
      currentUserId = user ? user.sub : null; // Access sub from user object
    } catch (error) {
      console.error("Error decoding token in server component:", error);
    }
  }

  if (!post) {
    return (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:lg-8 py-8">
        <div className="text-muted-foreground">게시글을 찾을 수 없습니다. ID: {id}</div>
        {process.env.NODE_ENV !== 'production' && (
          <div className="text-sm text-red-500 mt-2">
            <p>디버깅 힌트:</p>
            <ul>
              <li>- 백엔드 서버가 실행 중인지 확인하세요.</li>
              <li>- API 엔드포인트 ({process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/api/v1/board/posts/{id})가 올바른지 확인하세요.</li>
              <li>- 브라우저 개발자 도구의 네트워크 탭에서 API 호출 오류를 확인하세요.</li>
            </ul>
          </div>
        )}
      </main>
    )
  }

  // 게시글 작성자와 현재 로그인한 사용자가 동일한지 확인
  // post 객체에 user_id 필드가 있다고 가정합니다. 실제 백엔드 응답에 따라 필드 이름이 다를 수 있습니다.
  const isAuthor = currentUserId && Number(post.author_id) === Number(currentUserId); // post.author_id와 비교

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:lg-8 py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-xl">{post.title}</CardTitle>
            <div className="flex gap-2">
              {isAuthor && (
                <>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/board/${id}/edit`}>수정</Link>
                  </Button>
                  <DeleteButton id={id} />
                </>
              )}
              {/* LikeButton 추가 */}
              <LikeButton
                parentId={post.id}
                parentType="post"
                initialLikes={post.likes}
                token={token}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground mb-4 flex gap-3">
            {post.createdAt && <span>{new Date(post.createdAt).toLocaleString()}</span>}
            {typeof post.views === "number" && <span>조회 {post.views}</span>}
            {/* likes는 LikeButton에서 관리하므로 여기서는 제거 */}
            {/* {typeof post.likes === "number" && <span>추천 {post.likes}</span>} */}
          </div>
          <div className="whitespace-pre-wrap leading-relaxed">{post.body}</div>
        </CardContent>
      </Card>
      <div className="mt-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/board">목록으로</Link>
        </Button>
      </div>
      {/* CommentSection 추가 */}
      {/* CommentSection 추가 */}
      <CommentSection parentId={post.id} parentType="post" />
      <ViewTracker id={id} type="post" />
    </main>
  )
}