import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Server, Database, Globe, Layers } from "lucide-react"

export default function LinuxEducationPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Linux 실습 교육</h1>
            </div>
            <Badge variant="secondary" className="text-sm">
              실습 중심 학습
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h2 className="text-4xl font-bold text-balance text-foreground">웹 서비스 아키텍처 이해하기</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Web, WAS, DB의 3계층 구조를 통해 현대 웹 서비스가 어떻게 동작하는지 알아보세요
          </p>
        </section>

        {/* Architecture Diagram */}
        <section className="space-y-8">
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-4">시스템 아키텍처</h3>
            <div className="bg-card rounded-lg p-8 border">
              <img
                src="/web-was-db-architecture.jpg"
                alt="Web, WAS1, WAS2, DB 아키텍처 다이어그램"
                className="w-full max-w-4xl mx-auto rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Architecture Explanation */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  비유로 이해하는 웹 서비스
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  웹 서비스를 <strong className="text-foreground">레스토랑</strong>에 비유해보면:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">
                      Web
                    </Badge>
                    <p className="text-sm">
                      <strong>웨이터</strong> - 고객(사용자)의 주문을 받고 음식을 서빙하는 역할
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">
                      WAS
                    </Badge>
                    <p className="text-sm">
                      <strong>주방장</strong> - 실제 요리(비즈니스 로직)를 처리하는 핵심 역할
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">
                      DB
                    </Badge>
                    <p className="text-sm">
                      <strong>창고</strong> - 재료(데이터)를 안전하게 보관하고 관리하는 공간
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-accent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-accent" />
                  기술적 구조
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Web Server</p>
                      <p className="text-sm text-muted-foreground">정적 파일 서빙, 로드 밸런싱</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Server className="h-5 w-5 text-accent mt-1" />
                    <div>
                      <p className="font-medium">WAS (Web Application Server)</p>
                      <p className="text-sm text-muted-foreground">동적 콘텐츠 생성, 비즈니스 로직 처리</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Database className="h-5 w-5 text-chart-2 mt-1" />
                    <div>
                      <p className="font-medium">Database</p>
                      <p className="text-sm text-muted-foreground">데이터 저장, 관리, 트랜잭션 처리</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Architecture Components */}
        <section className="space-y-6">
          <h3 className="text-2xl font-semibold text-center">구성 요소별 상세 설명</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Globe className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle>Web Server</CardTitle>
                <CardDescription>프론트엔드 서버</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• HTML, CSS, JS 파일 서빙</li>
                  <li>• 사용자 요청 최초 접수</li>
                  <li>• SSL/TLS 암호화 처리</li>
                  <li>• 캐싱 및 압축</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Server className="h-12 w-12 text-accent mx-auto mb-2" />
                <CardTitle>WAS</CardTitle>
                <CardDescription>애플리케이션 서버</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• 비즈니스 로직 실행</li>
                  <li>• 동적 콘텐츠 생성</li>
                  <li>• 세션 관리</li>
                  <li>• API 엔드포인트 제공</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Database className="h-12 w-12 text-chart-2 mx-auto mb-2" />
                <CardTitle>Database</CardTitle>
                <CardDescription>데이터베이스 서버</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• 데이터 영구 저장</li>
                  <li>• CRUD 연산 처리</li>
                  <li>• 트랜잭션 관리</li>
                  <li>• 데이터 무결성 보장</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Practice Section */}
        <section className="space-y-6">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-semibold">실습 과정</h3>
            <p className="text-muted-foreground">단계별 실습을 통해 리눅스 환경에서 웹 서비스를 구축해보세요</p>
          </div>

          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">🚀 실습 시작하기</CardTitle>
              <CardDescription>
                리눅스 환경에서 Web-WAS-DB 3계층 아키텍처를 직접 구축하고 설정해보는 실습입니다
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button size="lg" className="gap-2">
                실습 링크로 이동
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-sm text-muted-foreground mt-4">예상 소요 시간: 2-3시간 | 난이도: 중급</p>
            </CardContent>
          </Card>
        </section>

        {/* Learning Objectives */}
        <section className="bg-muted/30 rounded-lg p-8">
          <h3 className="text-xl font-semibold mb-4 text-center">학습 목표</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-primary">이론적 이해</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✓ 3계층 아키텍처의 개념과 장점</li>
                <li>✓ 각 계층의 역할과 책임</li>
                <li>✓ 확장성과 유지보수성</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-accent">실무 역량</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✓ 리눅스 서버 환경 구성</li>
                <li>✓ 웹 서버 설치 및 설정</li>
                <li>✓ 데이터베이스 연동 및 최적화</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 Linux 실습 교육 플랫폼. 모든 권리 보유.</p>
            <p className="mt-2">문의사항이 있으시면 언제든 연락주세요.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
