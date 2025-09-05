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
      title: "Apache-Tomcat-Mariadb 3TIER",
      description: "Ubuntu에서 Apache 웹서버를 설치하고 가상 호스트를 설정합니다.",
      category: "linux",
      difficulty: "중급",
      duration: "45분",
      status: "in-progress",
      tasks: ["Apache", "Tomcat", "Mysql", "jdk"],
      href: "/practice/server-3tier",
    },
    {
      id: 2,
      title: "DNS 서버 구축",
      description: "Ubuntu에서 BIND9를 설치하고 존/레코드를 구성합니다.",
      category: "network",
      difficulty: "중급",
      duration: "40분",
      status: "in-progress",
      tasks: ["BIND9 설치", "정방향/역방향 존", "A/CNAME/MX 레코드", "서비스 관리"],
      href: "/practice/server-dns",
    },
    {
      id: 3,
      title: "메일 서버 구축",
      description: "Postfix와 Dovecot으로 메일 송수신 환경을 구성합니다.",
      category: "server",
      difficulty: "고급",
      duration: "90분",
      status: "in-progress",
      tasks: ["Postfix", "Dovecot(IMAP/POP3)", "SPF/DKIM 기본", "테스트 계정"],
      href: "/practice/linux-mail",
    },
    {
      id: 4,
      title: "웹메일 구축(+DNS 연동)",
      description: "Roundcube 웹메일을 설치하고 DNS(MX)와 연동합니다.",
      category: "complex",
      difficulty: "고급",
      duration: "75분",
      status: "in-progress",
      tasks: ["Roundcube", "PHP/Apache", "DNS MX 연동", "로그 점검"],
      href: "/practice/webmail-dns",
    },
    {
      id: 5,
      title: "Apache 소스 설치",
      description: "Apache HTTPD를 소스에서 컴파일/설치합니다.",
      category: "server",
      difficulty: "중급",
      duration: "50분",
      status: "in-progress",
      tasks: ["빌드 도구", "httpd 컴파일", "서비스 등록", "가상호스트"],
      href: "/practice/apache-source",
    },
    {
      id: 6,
      title: "Tomcat 소스 설치",
      description: "Apache Tomcat을 배포하고 서비스로 등록합니다.",
      category: "server",
      difficulty: "중급",
      duration: "45분",
      status: "in-progress",
      tasks: ["JDK 준비", "Tomcat 설치", "연동 설정", "서비스 스크립트"],
      href: "/practice/tomcat-source",
    },
    {
      id: 7,
      title: "MySQL(MariaDB) 소스 설치",
      description: "MariaDB를 소스에서 빌드하고 초기 보안을 설정합니다.",
      category: "server",
      difficulty: "중급",
      duration: "60분",
      status: "in-progress",
      tasks: ["의존성 설치", "컴파일/설치", "초기화", "계정/권한"],
      href: "/practice/mysql-source",
    },
    {
      id: 8,
      title: "DNS 자동 설치 스크립트",
      description: "Bash로 BIND9 설치/설정을 자동화하는 스크립트를 작성합니다.",
      category: "server",
      difficulty: "중급",
      duration: "35분",
      status: "in-progress",
      tasks: ["환경 변수", "템플릿 적용", "서비스 재시작", "검증"],
      href: "/practice/dns-script",
    },
    {
      id: 9,
      title: "3TIER 자동 설치 스크립트",
      description: "Apache+Tomcat+DB 환경을 자동으로 구성하는 스크립트를 작성합니다.",
      category: "complex",
      difficulty: "고급",
      duration: "80분",
      status: "in-progress",
      tasks: ["프리체크", "컴포넌트 설치", "연결 테스트", "롤백 처리"],
      href: "/practice/linux-3tier-script",
    },
    {
      id: 10,
      title: "스위치 기본 설정",
      description: "VLAN, 트렁크, 포트 보안 등 기초 설정을 수행합니다.",
      category: "network",
      difficulty: "초급",
      duration: "30분",
      status: "in-progress",
      tasks: ["VLAN 생성", "Access/Trunk", "STP 확인", "보안 기본"],
      href: "/practice/network-switch",
    },
    {
      id: 11,
      title: "라우터 설정",
      description: "정적 라우팅과 기본 ACL을 구성합니다.",
      category: "network",
      difficulty: "중급",
      duration: "40분",
      status: "in-progress",
      tasks: ["인터페이스 설정", "Static Route", "NAT 기본", "ACL"],
      href: "/practice/network-router",
    },

  ]

  const categories = [
    { id: "all", name: "전체", color: "default" },
    { id: "network", name: "네트워크", color: "blue" },
    { id: "server", name: "서버", color: "green" },
    { id: "complex", name: "복합", color: "yellow" },
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
              <div className="grid grid-cols-4 gap-6 justify-items-center">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-green-600">5</div>
                  <div className="text-sm text-muted-foreground">서버</div>
                </div>

                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-blue-600">3</div>
                  <div className="text-sm text-muted-foreground">네트워크</div>
                </div>

                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-yellow-600">2</div>
                  <div className="text-sm text-muted-foreground">복합실습</div>
                </div>

                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-gray-600">11</div>
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
              <Card key={practice.id} className="hover:shadow-lg transition-shadow flex flex-col">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(practice.status)}
                      <CardTitle className="text-lg">{practice.title}</CardTitle>
                    </div>
                    <Badge className={getDifficultyColor(practice.difficulty)}>{practice.difficulty}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex flex-col h-full">
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

                  <div className="mt-auto">
                    {"href" in practice && practice.href ? (
                      <Button
                        asChild
                        className="w-full"
                        disabled={practice.status === "locked"}
                        variant={practice.status === "completed" ? "outline" : "default"}
                      >
                        <Link href={practice.href} className="w-full">
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
