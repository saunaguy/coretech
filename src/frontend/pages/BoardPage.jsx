import React, { useState } from 'react';
import { PenTool, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Mock data for forum posts
const forumPosts = [
  {
    id: 1,
    title: "React 18의 새로운 기능들에 대해 알아보자",
    author: "개발자김씨",
    date: "2024-01-15",
    views: 245,
  },
  {
    id: 2,
    title: "Linux 서버 관리 팁 공유합니다",
    author: "서버관리자",
    date: "2024-01-14",
    views: 189,
  },
  {
    id: 3,
    title: "AI 프롬프트 엔지니어링 베스트 프랙티스",
    author: "AI전문가",
    date: "2024-01-13",
    views: 312,
  },
  {
    id: 4,
    title: "Next.js 14 App Router 마이그레이션 후기",
    author: "프론트개발자",
    date: "2024-01-12",
    views: 156,
  },
  {
    id: 5,
    title: "TypeScript 5.0 새로운 기능 정리",
    author: "타입스크립트러버",
    date: "2024-01-11",
    views: 203,
  },
  {
    id: 6,
    title: "Docker 컨테이너 최적화 방법",
    author: "데브옵스엔지니어",
    date: "2024-01-10",
    views: 178,
  },
  {
    id: 7,
    title: "웹 접근성 개선을 위한 실무 가이드",
    author: "UX개발자",
    date: "2024-01-09",
    views: 134,
  },
  {
    id: 8,
    title: "GraphQL vs REST API 비교 분석",
    author: "백엔드개발자",
    date: "2024-01-08",
    views: 267,
  },
  {
    id: 9,
    title: "모바일 퍼스트 반응형 디자인 팁",
    author: "웹디자이너",
    date: "2024-01-07",
    views: 145,
  },
  {
    id: 10,
    title: "Git 워크플로우 최적화 방법",
    author: "시니어개발자",
    date: "2024-01-06",
    views: 198,
  },
]

const BoardPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 10
  const totalPages = Math.ceil(forumPosts.length / postsPerPage)

  const getCurrentPosts = () => {
    const startIndex = (currentPage - 1) * postsPerPage
    const endIndex = startIndex + postsPerPage
    return forumPosts.slice(startIndex, endIndex)
  }

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">자유 게시판</h1>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          <PenTool className="w-4 h-4 mr-2" />
          글쓰기
        </Button>
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
  );
};

export default BoardPage;