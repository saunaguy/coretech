"use client"

import { useState } from "react"
import { MessageSquarePlus, ArrowUp, ArrowDown, Check, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data for Q&A posts
const qnaData = [
  {
    id: 1,
    title: "React에서 useEffect 의존성 배열을 올바르게 사용하는 방법",
    excerpt:
      "useEffect를 사용할 때 의존성 배열에 어떤 값들을 넣어야 하는지 헷갈립니다. 특히 함수나 객체를 의존성으로 사용할 때...",
    votes: 15,
    answers: 3,
    solved: true,
    tags: ["react", "hooks", "javascript"],
    author: "초보개발자",
    date: "2024-01-15",
  },
  {
    id: 2,
    title: "Linux 서버에서 Docker 컨테이너가 자꾸 종료되는 문제",
    excerpt:
      "Docker 컨테이너를 실행하면 몇 분 후에 자동으로 종료됩니다. 로그를 확인해봐도 특별한 에러 메시지가 없어서...",
    votes: 8,
    answers: 2,
    solved: false,
    tags: ["linux", "docker", "server"],
    author: "서버관리자",
    date: "2024-01-14",
  },
  {
    id: 3,
    title: "TypeScript에서 Generic 타입을 활용한 유틸리티 함수 작성법",
    excerpt: "여러 타입에서 공통으로 사용할 수 있는 유틸리티 함수를 만들고 싶은데, Generic을 어떻게 활용해야 할지...",
    votes: 22,
    answers: 5,
    solved: true,
    tags: ["typescript", "generic", "utility"],
    author: "타입스크립트러버",
    date: "2024-01-13",
  },
  {
    id: 4,
    title: "Next.js App Router에서 동적 라우팅 구현하기",
    excerpt: "App Router를 사용해서 동적 라우팅을 구현하려고 하는데, 기존 Pages Router와 다른 점이 많아서...",
    votes: 12,
    answers: 1,
    solved: false,
    tags: ["nextjs", "routing", "app-router"],
    author: "프론트개발자",
    date: "2024-01-12",
  },
  {
    id: 5,
    title: "AI 프롬프트 엔지니어링에서 효과적인 프롬프트 작성 팁",
    excerpt: "ChatGPT나 Claude 같은 AI 모델에게 더 정확한 답변을 받기 위한 프롬프트 작성 방법이 궁금합니다...",
    votes: 18,
    answers: 4,
    solved: true,
    tags: ["ai", "prompt", "chatgpt"],
    author: "AI전문가",
    date: "2024-01-11",
  },
  {
    id: 6,
    title: "Python Django REST Framework 인증 구현 방법",
    excerpt: "DRF에서 JWT 토큰 기반 인증을 구현하려고 하는데, 토큰 갱신과 보안 관련해서 베스트 프랙티스가...",
    votes: 9,
    answers: 2,
    solved: false,
    tags: ["python", "django", "api", "auth"],
    author: "백엔드개발자",
    date: "2024-01-10",
  },
]

export default function QnaPage() {
  const [sortBy, setSortBy] = useState<"votes" | "recent" | "answers">("votes")

  const getSortedQuestions = () => {
    const sorted = [...qnaData].sort((a, b) => {
      switch (sortBy) {
        case "votes":
          return b.votes - a.votes
        case "recent":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "answers":
          return b.answers - a.answers
        default:
          return 0
      }
    })
    return sorted
  }

  const getTagColor = (tag: string) => {
    const colors: { [key: string]: string } = {
      react: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      javascript: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      typescript: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      linux: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      docker: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
      nextjs: "bg-black text-white dark:bg-white dark:text-black",
      python: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      ai: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    }
    return colors[tag] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">AI Prompt Lab</h1>
            </div>
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="/" className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  AI Lab
                </a>
                <a
                  href="/linux"
                  className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Linux 기초
                </a>
                <a
                  href="/board"
                  className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  게시판
                </a>
                <a href="/qna" className="bg-primary/80 px-3 py-2 rounded-md text-sm font-medium">
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
            <h1 className="text-3xl font-bold text-foreground">Q&A</h1>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              <MessageSquarePlus className="w-4 h-4 mr-2" />
              질문하기
            </Button>
          </div>

          {/* Sort Options */}
          <div className="flex gap-2">
            <Button variant={sortBy === "votes" ? "default" : "outline"} size="sm" onClick={() => setSortBy("votes")}>
              인기순
            </Button>
            <Button variant={sortBy === "recent" ? "default" : "outline"} size="sm" onClick={() => setSortBy("recent")}>
              최신순
            </Button>
            <Button
              variant={sortBy === "answers" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("answers")}
            >
              답변순
            </Button>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {getSortedQuestions().map((question) => (
              <Card key={question.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Stats Section */}
                    <div className="flex flex-col items-center space-y-2 min-w-20">
                      <div className="flex items-center space-x-1 text-sm">
                        <ArrowUp className="w-3 h-3" />
                        <span className="font-medium">{question.votes}</span>
                        <ArrowDown className="w-3 h-3" />
                      </div>
                      <div className="text-xs text-muted-foreground">Votes</div>

                      <div className="flex items-center space-x-1">
                        <div
                          className={`flex items-center space-x-1 text-sm ${question.solved ? "text-green-600" : ""}`}
                        >
                          {question.solved && <Check className="w-3 h-3" />}
                          <span className="font-medium">{question.answers}</span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">Answers</div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 space-y-3">
                      <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                        {question.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{question.excerpt}</p>

                      {/* Tags and Meta */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {question.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className={`text-xs ${getTagColor(tag)}`}>
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {question.author} • {question.date}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
