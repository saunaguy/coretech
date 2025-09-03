"use client"

import { BookOpen, MessageSquare, Terminal, Server, Network } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserMenu } from "@/components/user-menu"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  const handleCardClick = (path: string) => {
    console.log("[v0] Card clicked, navigating to:", path)
    router.push(path)
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
            <div className="flex items-center gap-6">
              <nav className="hidden md:block">
                <div className="flex items-baseline space-x-4">
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
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground text-balance">리눅스, 서버, 네트워크 전문 학습 플랫폼</h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
              리눅스 기초부터 서버 관리, 네트워크 구성까지 - 시스템 엔지니어링의 모든 것을 체계적으로 학습하세요
            </p>
          </div>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => handleCardClick("/linux")}
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto group-hover:bg-blue-200 transition-colors">
                  <Terminal className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Linux 기초</h3>
                  <p className="text-sm text-muted-foreground">명령어부터 시스템 관리까지</p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => handleCardClick("/server")}
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto group-hover:bg-red-200 transition-colors">
                  <Server className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">서버 관리</h3>
                  <p className="text-sm text-muted-foreground">웹서버, DB서버 구축과 운영</p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => handleCardClick("/network")}
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto group-hover:bg-indigo-200 transition-colors">
                  <Network className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">네트워크</h3>
                  <p className="text-sm text-muted-foreground">네트워크 구성과 보안 설정</p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => handleCardClick("/qna")}
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto group-hover:bg-green-200 transition-colors">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">커뮤니티</h3>
                  <p className="text-sm text-muted-foreground">시스템 관리자들과 소통</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Posts and Q&A Section */}
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-foreground">최근 활동</h2>
              <p className="text-muted-foreground">커뮤니티의 최신 소식을 확인해보세요</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Board Posts */}
              <Card className="h-fit">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-green-600" />
                      공지사항
                    </CardTitle>
                    <Link href="/board" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      더보기 →
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="destructive" className="text-xs">
                          중요
                        </Badge>
                        <h4 className="font-medium text-sm">서버 정기 점검 안내 (12/15 02:00~04:00)</h4>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>관리자</span>
                        <span>1시간 전</span>
                      </div>
                    </div>

                    <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="default" className="text-xs">
                          공지
                        </Badge>
                        <h4 className="font-medium text-sm">새로운 Linux 실습 환경 오픈</h4>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>관리자</span>
                        <span>2일 전</span>
                      </div>
                    </div>

                    <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs">
                          업데이트
                        </Badge>
                        <h4 className="font-medium text-sm">네트워크 보안 가이드 업데이트</h4>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>관리자</span>
                        <span>3일 전</span>
                      </div>
                    </div>

                    <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          이벤트
                        </Badge>
                        <h4 className="font-medium text-sm">12월 시스템 관리자 스터디 모집</h4>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>관리자</span>
                        <span>5일 전</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Q&A */}
              <Card className="h-fit">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-purple-600" />
                      간단한 테스트
                    </CardTitle>
                    <Link href="/qna" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      더보기 →
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center gap-1 text-xs">
                          <Badge variant="default" className="text-xs">
                            리눅스
                          </Badge>
                          <span className="text-muted-foreground">5문제</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1">기본 명령어 테스트</h4>
                          <p className="text-xs text-muted-foreground mb-2">ls, cd, mkdir 등 기본 명령어 숙련도 확인</p>
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "80%" }}></div>
                            </div>
                            <span className="text-xs text-muted-foreground">80%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center gap-1 text-xs">
                          <Badge variant="destructive" className="text-xs">
                            서버
                          </Badge>
                          <span className="text-muted-foreground">8문제</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1">웹서버 구축 테스트</h4>
                          <p className="text-xs text-muted-foreground mb-2">Apache, Nginx 설정 및 관리 능력 평가</p>
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-red-600 h-2 rounded-full" style={{ width: "60%" }}></div>
                            </div>
                            <span className="text-xs text-muted-foreground">60%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center gap-1 text-xs">
                          <Badge variant="secondary" className="text-xs">
                            네트워크
                          </Badge>
                          <span className="text-muted-foreground">6문제</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1">네트워크 설정 테스트</h4>
                          <p className="text-xs text-muted-foreground mb-2">IP 설정, 방화벽, 라우팅 기본 지식 확인</p>
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                            </div>
                            <span className="text-xs text-muted-foreground">45%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center gap-1 text-xs">
                          <Badge variant="outline" className="text-xs">
                            종합
                          </Badge>
                          <span className="text-muted-foreground">15문제</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1">시스템 관리자 종합 테스트</h4>
                          <p className="text-xs text-muted-foreground mb-2">리눅스, 서버, 네트워크 전 영역 통합 평가</p>
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full" style={{ width: "25%" }}></div>
                            </div>
                            <span className="text-xs text-muted-foreground">25%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
