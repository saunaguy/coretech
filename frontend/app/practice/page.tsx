"use client"

import { useState } from "react"
import { BookOpen, Clock, Star, Filter, Search, Play, CheckCircle, Lock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
// removed local header; rely on global header in layout

export default function PracticePage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const practices = [
    {
      id: 1,
      title: "Linux 기본 명령어 실습",
      description: "파일 시스템 탐색, 파일 조작, 권한 설정 등 기본 명령어를 실습합니다.",
      category: "linux",
      difficulty: "초급",
      duration: "30분",
      status: "in-progress",
      tasks: ["디렉토리 생성 및 이동", "파일 복사 및 이동", "권한 설정 및 확인", "프로세스 관리"],
    },
    {
      id: 2,
      title: "Apache 웹서버 구축",
      description: "Ubuntu에서 Apache 웹서버를 설치하고 가상 호스트를 설정합니다.",
      category: "server",
      difficulty: "중급",
      duration: "45분",
      status: "in-progress",
      tasks: ["Apache 설치 및 시작", "기본 설정 파일 수정", "가상 호스트 설정", "SSL 인증서 적용"],
    },
    {
      id: 3,
      title: "방화벽 설정 실습",
      description: "iptables와 ufw를 사용하여 네트워크 보안을 설정합니다.",
      category: "network",
      difficulty: "중급",
      duration: "40분",
      status: "in-progress",
      tasks: ["iptables 기본 규칙 설정", "ufw 방화벽 구성", "포트 포워딩 설정", "로그 분석"],
    },
    {
      id: 4,
      title: "Docker 컨테이너 관리",
      description: "Docker를 사용하여 컨테이너를 생성하고 관리하는 방법을 학습합니다.",
      category: "server",
      difficulty: "고급",
      duration: "60분",
      status: "in-progress",
      tasks: ["Docker 설치 및 설정", "이미지 빌드 및 실행", "볼륨 마운트", "Docker Compose 사용"],
    },
    {
      id: 5,
      title: "네트워크 진단 도구 활용",
      description: "ping, traceroute, netstat 등을 사용하여 네트워크 문제를 진단합니다.",
      category: "network",
      difficulty: "초급",
      duration: "25분",
      status: "in-progress",
      tasks: ["기본 연결 테스트", "경로 추적", "포트 스캔", "패킷 캡처"],
    },
    {
      id: 6,
      title: "MySQL 데이터베이스 설정",
      description: "MySQL 서버를 설치하고 데이터베이스를 생성하여 관리합니다.",
      category: "server",
      difficulty: "중급",
      duration: "50분",
      status: "in-progress",
      tasks: ["MySQL 설치 및 보안 설정", "데이터베이스 생성", "사용자 권한 관리", "백업 및 복원"],
    },
    {
      id: 7,
      title: "Apache-Tomcat-Mariadb 3TIER",
      description: "Ubuntu에서 Apache 웹서버를 설치하고 가상 호스트를 설정합니다.",
      category: "linux",
      difficulty: "중급",
      duration: "45분",
      status: "in-progress",
      tasks: ["Apache", "Tomcat", "Mysql", "jdk"],
      href: "/practice/linux-3tier",
    },
  ]

  const categories = [
    { id: "all", name: "전체", color: "default" },
    { id: "linux", name: "Linux", color: "blue" },
    { id: "server", name: "서버", color: "red" },
    { id: "network", name: "네트워크", color: "indigo" },
  ]

  const filteredPractices = practices.filter((practice) => {
    const matchesCategory = selectedCategory === "all" || practice.category === selectedCategory
    const matchesSearch =
      practice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      practice.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "in-progress":
        return <Play className="w-5 h-5 text-blue-600" />
      case "locked":
        return <Lock className="w-5 h-5 text-gray-400" />
      default:
        return <BookOpen className="w-5 h-5 text-gray-600" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "초급":
        return "bg-green-100 text-green-800"
      case "중급":
        return "bg-yellow-100 text-yellow-800"
      case "고급":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground text-balance">실무 중심 실습 과제</h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
              단계별 실습을 통해 리눅스, 서버, 네트워크 기술을 체계적으로 익혀보세요
            </p>
          </div>

          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                학습 진행률
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-green-600">2</div>
                  <div className="text-sm text-muted-foreground">완료된 실습</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-blue-600">2</div>
                  <div className="text-sm text-muted-foreground">진행 중인 실습</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-gray-600">6</div>
                  <div className="text-sm text-muted-foreground">전체 실습</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="실습 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="whitespace-nowrap"
                >
                  <Filter className="w-4 h-4 mr-1" />
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Practice Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPractices.map((practice) => (
              <Card key={practice.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(practice.status)}
                      <CardTitle className="text-lg">{practice.title}</CardTitle>
                    </div>
                    <Badge className={getDifficultyColor(practice.difficulty)}>{practice.difficulty}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{practice.description}</p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {practice.duration}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {practice.category}
                    </Badge>
                  </div>


                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">실습 과제:</h4>
                    <ul className="space-y-1">
                      {practice.tasks.map((task, index) => (
                        <li key={index} className="text-xs text-muted-foreground flex items-center gap-2">
                          <div className="w-1 h-1 bg-gray-400 rounded-full" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {"href" in practice && practice.href ? (
                    <Button
                      asChild
                      className="w-full"
                      disabled={practice.status === "locked"}
                      variant={practice.status === "completed" ? "outline" : "default"}
                    >
                      <Link href={practice.href}>
                        {practice.status === "completed"
                          ? "다시 풀기"
                          : practice.status === "in-progress"
                            ? "시작하기"
                            : practice.status === "locked"
                              ? "잠김"
                              : "시작하기"}
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      disabled={practice.status === "locked"}
                      variant={practice.status === "completed" ? "outline" : "default"}
                    >
                      {practice.status === "completed"
                        ? "다시 풀기"
                        : practice.status === "in-progress"
                          ? "시작하기"
                          : practice.status === "locked"
                            ? "잠김"
                            : "시작하기"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
