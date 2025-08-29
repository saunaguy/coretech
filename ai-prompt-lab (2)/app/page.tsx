import { BookOpen, MessageSquare, Terminal, Server, Network } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
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
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
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

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
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

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
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

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
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
                      최근 게시글
                    </CardTitle>
                    <a href="/board" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      더보기 →
                    </a>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <h4 className="font-medium text-sm mb-1">Ubuntu 22.04 서버 초기 설정 가이드</h4>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>리눅스관리자</span>
                        <span>2시간 전</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          15
                        </span>
                      </div>
                    </div>

                    <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <h4 className="font-medium text-sm mb-1">Nginx vs Apache 성능 비교 실험</h4>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>서버엔지니어</span>
                        <span>5시간 전</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          12
                        </span>
                      </div>
                    </div>

                    <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <h4 className="font-medium text-sm mb-1">Docker 컨테이너 네트워크 구성하기</h4>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>데브옵스</span>
                        <span>1일 전</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          18
                        </span>
                      </div>
                    </div>

                    <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <h4 className="font-medium text-sm mb-1">방화벽 설정과 보안 강화 방법</h4>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>보안전문가</span>
                        <span>2일 전</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          25
                        </span>
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
                      인기 Q&A
                    </CardTitle>
                    <a href="/qna" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      더보기 →
                    </a>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center gap-1 text-xs">
                          <div className="bg-green-100 text-green-700 px-2 py-1 rounded font-medium">해결됨</div>
                          <span className="text-muted-foreground">+32</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1">SSH 접속이 자꾸 끊어져요</h4>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>리눅스초보</span>
                            <span>3시간 전</span>
                            <Badge variant="secondary" className="text-xs">
                              SSH
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center gap-1 text-xs">
                          <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">답변중</div>
                          <span className="text-muted-foreground">+18</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1">MySQL 데이터베이스 백업 자동화</h4>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>DB관리자</span>
                            <span>6시간 전</span>
                            <Badge variant="secondary" className="text-xs">
                              MySQL
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center gap-1 text-xs">
                          <div className="bg-green-100 text-green-700 px-2 py-1 rounded font-medium">해결됨</div>
                          <span className="text-muted-foreground">+24</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1">포트 포워딩 설정 방법</h4>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>네트워크관리자</span>
                            <span>1일 전</span>
                            <Badge variant="secondary" className="text-xs">
                              Network
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center gap-1 text-xs">
                          <div className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-medium">토론중</div>
                          <span className="text-muted-foreground">+41</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1">CentOS vs Ubuntu 서버용 선택</h4>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>시스템관리자</span>
                            <span>2일 전</span>
                            <Badge variant="secondary" className="text-xs">
                              Linux
                            </Badge>
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
