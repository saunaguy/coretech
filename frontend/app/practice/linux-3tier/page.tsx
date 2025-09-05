import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Server, Database, Globe, Layers, Star } from "lucide-react"
import Link from "next/link"

export default function Linux3TierPage() {
  return (
    <main className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="flex items-center justify-center gap-2">
          <Layers className="h-8 w-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Linux 실습 교육</h1>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-balance text-foreground">웹 서비스 아키텍처 이해하기</h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
          Web, WAS, DB의 3계층 구조를 통해 현대 웹 서비스가 어떻게 동작하는지 알아보세요
        </p>
      </section>

      {/* Architecture Diagram (placeholder area) */}
      <section className="space-y-8">
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-4">시스템 아키텍처</h3>
          <div className="bg-card rounded-lg p-8 border">
            <div className="w-full max-w-4xl mx-auto rounded-lg shadow-lg border border-dashed h-64 md:h-80 flex items-center justify-center text-muted-foreground">
              이미지 영역 (추후 교체)
            </div>
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
                  <Badge variant="outline" className="mt-1">Web</Badge>
                  <p className="text-sm"><strong>웨이터</strong> - 고객(사용자)의 주문을 받고 음식을 서빙하는 역할</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">WAS</Badge>
                  <p className="text-sm"><strong>주방장</strong> - 실제 요리(비즈니스 로직)를 처리하는 핵심 역할</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">DB</Badge>
                  <p className="text-sm"><strong>창고</strong> - 재료(데이터)를 안전하게 보관하고 관리하는 공간</p>
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
            <Link href="/practice/3tier">
              <Button size="lg" className="gap-2">
                실습 연결하기
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-4">예상 소요 시간: 2-3시간 | 난이도: 중급</p>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

