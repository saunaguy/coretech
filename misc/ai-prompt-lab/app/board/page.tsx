"use client"

import { useState, useEffect } from "react"
import { PenTool, ChevronLeft, ChevronRight, Trash2, Edit, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getCurrentUser, type User } from "@/lib/auth"

// Mock data for forum posts
const forumPosts = [
  {
    id: 1,
    title: "Ubuntu 22.04 서버 초기 설정 가이드",
    author: "리눅스관리자",
    date: "2024-01-15",
    views: 245,
  },
  {
    id: 2,
    title: "Nginx vs Apache 성능 비교 실험",
    author: "서버엔지니어",
    date: "2024-01-14",
    views: 189,
  },
  {
    id: 3,
    title: "Docker 컨테이너 네트워크 구성하기",
    author: "데브옵스",
    date: "2024-01-13",
    views: 312,
  },
  {
    id: 4,
    title: "방화벽 설정과 보안 강화 방법",
    author: "보안전문가",
    date: "2024-01-12",
    views: 156,
  },
  {
    id: 5,
    title: "Linux 명령어 치트시트 공유",
    author: "시스템관리자",
    date: "2024-01-11",
    views: 203,
  },
  {
    id: 6,
    title: "SSH 키 기반 인증 설정하기",
    author: "네트워크관리자",
    date: "2024-01-10",
    views: 178,
  },
  {
    id: 7,
    title: "CentOS 8 EOL 대응 마이그레이션 가이드",
    author: "인프라엔지니어",
    date: "2024-01-09",
    views: 134,
  },
  {
    id: 8,
    title: "Kubernetes 클러스터 구축 경험담",
    author: "클라우드엔지니어",
    date: "2024-01-08",
    views: 267,
  },
  {
    id: 9,
    title: "로그 분석을 위한 ELK 스택 구성",
    author: "모니터링전문가",
    date: "2024-01-07",
    views: 145,
  },
  {
    id: 10,
    title: "백업 및 복구 전략 수립하기",
    author: "데이터관리자",
    date: "2024-01-06",
    views: 198,
  },
]

export default function BoardPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [user, setUser] = useState<User | null>(null)
  const postsPerPage = 10
  const totalPages = Math.ceil(forumPosts.length / postsPerPage)

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  const getCurrentPosts = () => {
    const startIndex = (currentPage - 1) * postsPerPage
    const endIndex = startIndex + postsPerPage
    return forumPosts.slice(startIndex, endIndex)
  }

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const handleDeletePost = (postId: number) => {
    if (confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      console.log(`[v0] Admin deleting post ${postId}`)
      // Here you would implement actual delete logic
    }
  }

  const handleEditPost = (postId: number) => {
    console.log(`[v0] Admin editing post ${postId}`)
    // Here you would implement edit logic
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Linux & Server Lab</h1>
            </div>
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="/" className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  홈
                </a>
                <a
                  href="/linux"
                  className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Linux 기초
                </a>
                <a href="/board" className="bg-primary/80 px-3 py-2 rounded-md text-sm font-medium">
                  게시판
                </a>
                <a
                  href="/qna"
                  className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Q&A
                </a>
                <a
                  href="/about"
                  className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  소개
                </a>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">자유 게시판</h1>
            <div className="flex items-center gap-3">
              {user?.role === "admin" && (
                <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  <Shield className="w-4 h-4" />
                  관리자 모드
                </div>
              )}
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                <PenTool className="w-4 h-4 mr-2" />
                글쓰기
              </Button>
            </div>
          </div>

          {/* Posts Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground w-16">번호</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">제목</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground w-32">작성자</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground w-32">작성일</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground w-20">조회수</th>
                      {user?.role === "admin" && (
                        <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground w-24">관리</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {getCurrentPosts().map((post, index) => (
                      <tr key={post.id} className="hover:bg-muted/30 transition-colors cursor-pointer">
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {(currentPage - 1) * postsPerPage + index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                            {post.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{post.author}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{post.date}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{post.views}</td>
                        {user?.role === "admin" && (
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditPost(post.id)
                                }}
                                className="h-7 w-7 p-0"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeletePost(post.id)
                                }}
                                className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination */}
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(page)}
                  className={`w-10 ${currentPage === page ? "bg-primary text-primary-foreground" : ""}`}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
