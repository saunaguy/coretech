"use client"

import { useState, useEffect } from "react"
import { MessageSquarePlus, ArrowUp, ArrowDown, Check, Tag, Trash2, Edit, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCurrentUser, type User } from "@/lib/auth"

// Mock data for Q&A posts
const qnaData = [
  {
    id: 1,
    title: "SSH 접속이 자꾸 끊어져요",
    excerpt: "Ubuntu 서버에 SSH로 접속하면 몇 분 후에 자동으로 연결이 끊어집니다. 설정을 어떻게 변경해야 할까요?",
    votes: 15,
    answers: 3,
    solved: true,
    tags: ["ssh", "ubuntu", "server"],
    author: "리눅스초보",
    date: "2024-01-15",
  },
  {
    id: 2,
    title: "MySQL 데이터베이스 백업 자동화",
    excerpt:
      "MySQL 데이터베이스를 매일 자동으로 백업하는 스크립트를 만들고 싶습니다. cron과 mysqldump를 사용하는 방법을...",
    votes: 8,
    answers: 2,
    solved: false,
    tags: ["mysql", "backup", "cron"],
    author: "DB관리자",
    date: "2024-01-14",
  },
  {
    id: 3,
    title: "포트 포워딩 설정 방법",
    excerpt: "외부에서 내부 서버에 접근하기 위해 포트 포워딩을 설정하려고 하는데, iptables 규칙을 어떻게 작성해야...",
    votes: 22,
    answers: 5,
    solved: true,
    tags: ["network", "iptables", "port-forwarding"],
    author: "네트워크관리자",
    date: "2024-01-13",
  },
  {
    id: 4,
    title: "CentOS vs Ubuntu 서버용 선택",
    excerpt: "새로운 웹 서버를 구축하려고 하는데, CentOS와 Ubuntu 중 어떤 것을 선택하는 것이 좋을까요?",
    votes: 12,
    answers: 1,
    solved: false,
    tags: ["centos", "ubuntu", "server"],
    author: "시스템관리자",
    date: "2024-01-12",
  },
  {
    id: 5,
    title: "Docker 컨테이너 로그 관리 방법",
    excerpt: "Docker 컨테이너의 로그가 계속 쌓여서 디스크 공간을 많이 차지합니다. 로그 로테이션을 어떻게 설정해야...",
    votes: 18,
    answers: 4,
    solved: true,
    tags: ["docker", "logging", "disk-management"],
    author: "데브옵스",
    date: "2024-01-11",
  },
  {
    id: 6,
    title: "Nginx 리버스 프록시 설정 문제",
    excerpt: "Nginx를 리버스 프록시로 사용하려고 하는데, upstream 서버로 요청이 제대로 전달되지 않습니다...",
    votes: 9,
    answers: 2,
    solved: false,
    tags: ["nginx", "reverse-proxy", "configuration"],
    author: "웹서버관리자",
    date: "2024-01-10",
  },
]

export default function QnaPage() {
  const [sortBy, setSortBy] = useState<"votes" | "recent" | "answers">("votes")
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

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
      ssh: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      ubuntu: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      server: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      mysql: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      backup: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      cron: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      network: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      iptables: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      centos: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      docker: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
      nginx: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    }
    return colors[tag] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }

  const handleDeleteQuestion = (questionId: number) => {
    if (confirm("정말로 이 질문을 삭제하시겠습니까?")) {
      console.log(`[v0] Admin deleting question ${questionId}`)
      // Here you would implement actual delete logic
    }
  }

  const handleEditQuestion = (questionId: number) => {
    console.log(`[v0] Admin editing question ${questionId}`)
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
            <div className="flex items-center gap-3">
              {user?.role === "admin" && (
                <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  <Shield className="w-4 h-4" />
                  관리자 모드
                </div>
              )}
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                <MessageSquarePlus className="w-4 h-4 mr-2" />
                질문하기
              </Button>
            </div>
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
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors flex-1">
                          {question.title}
                        </h3>
                        {user?.role === "admin" && (
                          <div className="flex items-center gap-1 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditQuestion(question.id)
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
                                handleDeleteQuestion(question.id)
                              }}
                              className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
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
