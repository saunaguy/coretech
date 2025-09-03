"use client"

import { useState } from "react"
import { Search, MessageSquare, Eye, ThumbsUp, Calendar, User, Edit, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserMenu } from "@/components/user-menu"
import { AuthGuard } from "@/components/auth-guard"
import Link from "next/link"

export default function ServerBoardPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("전체")

  const categories = ["전체", "웹서버", "데이터베이스", "클라우드", "모니터링", "백업", "보안"]

  const posts = [
    {
      id: 1,
      title: "Ubuntu 22.04 서버 초기 설정 완벽 가이드",
      author: "리눅스관리자",
      date: "2024-01-15",
      views: 342,
      likes: 28,
      comments: 15,
      category: "웹서버",
      excerpt: "새로운 Ubuntu 서버 설치 후 필수 보안 설정, 방화벽 구성, SSH 키 설정까지 단계별 가이드입니다.",
    },
    {
      id: 2,
      title: "Nginx 로드 밸런싱과 SSL 인증서 자동 갱신",
      author: "웹서버전문가",
      date: "2024-01-14",
      views: 289,
      likes: 35,
      comments: 12,
      category: "웹서버",
      excerpt: "여러 서버에 트래픽을 분산하는 Nginx 로드 밸런서 설정과 Let's Encrypt를 이용한 SSL 자동화 방법입니다.",
    },
    {
      id: 3,
      title: "MySQL 마스터-슬레이브 복제 설정하기",
      author: "DB관리자",
      date: "2024-01-13",
      views: 256,
      likes: 22,
      comments: 18,
      category: "데이터베이스",
      excerpt: "고가용성을 위한 MySQL 복제 환경 구축과 장애 발생 시 페일오버 처리 방법을 실습합니다.",
    },
    {
      id: 4,
      title: "Docker Swarm으로 컨테이너 오케스트레이션",
      author: "데브옵스엔지니어",
      date: "2024-01-12",
      views: 198,
      likes: 19,
      comments: 9,
      category: "클라우드",
      excerpt: "Docker Swarm을 사용해 여러 서버에서 컨테이너를 관리하고 자동 스케일링을 구현하는 방법입니다.",
    },
    {
      id: 5,
      title: "Prometheus + Grafana 실시간 서버 모니터링",
      author: "모니터링전문가",
      date: "2024-01-11",
      views: 234,
      likes: 31,
      comments: 14,
      category: "모니터링",
      excerpt: "서버 리소스, 애플리케이션 성능을 실시간으로 모니터링하고 알림을 설정하는 완벽한 가이드입니다.",
    },
    {
      id: 6,
      title: "PostgreSQL 자동 백업 및 복구 시스템 구축",
      author: "백업전문가",
      date: "2024-01-10",
      views: 167,
      likes: 24,
      comments: 11,
      category: "백업",
      excerpt: "cron을 이용한 자동 백업 스케줄링과 Point-in-Time Recovery를 위한 WAL 아카이빙 설정법입니다.",
    },
    {
      id: 7,
      title: "fail2ban으로 서버 보안 강화하기",
      author: "보안관리자",
      date: "2024-01-09",
      views: 189,
      likes: 26,
      comments: 8,
      category: "보안",
      excerpt: "무차별 대입 공격을 차단하는 fail2ban 설정과 iptables 규칙을 통한 서버 보안 강화 방법입니다.",
    },
    {
      id: 8,
      title: "Redis 클러스터 구성과 성능 최적화",
      author: "캐시전문가",
      date: "2024-01-08",
      views: 145,
      likes: 17,
      comments: 6,
      category: "데이터베이스",
      excerpt: "고성능 캐싱을 위한 Redis 클러스터 설정과 메모리 최적화, 데이터 영속성 설정 방법입니다.",
    },
    {
      id: 9,
      title: "Apache Kafka 메시지 큐 시스템 구축",
      author: "시스템아키텍트",
      date: "2024-01-07",
      views: 178,
      likes: 20,
      comments: 13,
      category: "클라우드",
      excerpt: "대용량 실시간 데이터 처리를 위한 Kafka 클러스터 구성과 프로듀서/컨슈머 최적화 가이드입니다.",
    },
    {
      id: 10,
      title: "ELK 스택으로 로그 분석 시스템 구축하기",
      author: "로그분석가",
      date: "2024-01-06",
      views: 203,
      likes: 29,
      comments: 16,
      category: "모니터링",
      excerpt: "Elasticsearch, Logstash, Kibana를 이용한 중앙 집중식 로그 수집 및 분석 시스템 구축 방법입니다.",
    },
  ]

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "전체" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Linux & Server Lab</h1>
            </div>
            <div className="flex items-center gap-6">
              <nav className="hidden md:block">
                <div className="flex items-baseline space-x-4">
                  <Link
                    href="/"
                    className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    홈
                  </Link>
                  <Link
                    href="/linux"
                    className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Linux 기초
                  </Link>
                  <Link
                    href="/board"
                    className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    게시판
                  </Link>
                  <Link
                    href="/qna"
                    className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Q&A
                  </Link>
                  <Link
                    href="/about"
                    className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    소개
                  </Link>
                </div>
              </nav>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">서버 관리 게시판</h1>
            <p className="text-muted-foreground">웹서버, 데이터베이스, 클라우드 서비스 관련 정보를 공유하세요</p>
          </div>

          {/* Search and Filter */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="게시글 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="text-sm"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-foreground hover:text-primary cursor-pointer">
                          {post.title}
                        </h3>
                        <Badge variant="secondary">{post.category}</Badge>
                      </div>

                      <p className="text-muted-foreground text-sm">{post.excerpt}</p>

                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                    </div>

                    <AuthGuard requiredRole="admin">
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </AuthGuard>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Write Post Button */}
          <div className="text-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              새 글 작성
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
