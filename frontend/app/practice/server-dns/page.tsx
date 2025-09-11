import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Server, Database, Globe, Layers, Monitor } from "lucide-react"
import Link from "next/link"
// SVG는 public 경로를 사용하여 정적 제공

export default function Linux3TierPage() {
  return (
    <main className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="flex items-center justify-center gap-2">
          <Layers className="h-8 w-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Server 실습 교육</h1>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-balance text-foreground">DNS 아키텍처 이해하기</h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
          DNS를 통해 인터넷 서비스가 동작하게 하는 (이름 → IP 주소 해석) 과정을 알아보세요
        </p>
      </section>

      {/* Architecture Diagram (placeholder area) */}
      <section className="space-y-8">
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-4">시스템 아키텍처</h3>
          <div className="bg-card rounded-lg p-4 md:p-8 border">
            <div className="w-full max-w-4xl mx-auto rounded-lg shadow-lg overflow-hidden">
              <img
                src="/practice/server-dns/asset/dns.svg"
                alt="DNS Architecture Diagram"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Architecture Explanation */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                비유로 이해하는 DNS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                DNS를 <strong className="text-foreground">네이버지도앱</strong>에 비유해보면:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">DNS</Badge>
                  <p className="text-sm"><strong>네이버지도앱</strong> - 목적지를 입력하면 해당 좌표를 찾아 경로를 안내</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">pc</Badge>
                  <p className="text-sm"><strong>사용자</strong> - 목적지 이름만 알고 입력하는 사람(예:버거킹)</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">HOST</Badge>
                  <p className="text-sm"><strong>목적지 건물</strong> - 지도가 알려준 위치에 있는 장소</p>
                </div>
              </div>
            </CardContent>
          </Card>

         <Card className="border-l-4 border-l-accent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-accent" />
              기술적 구조 (DNS)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">DNS 서버</p>
                  <p className="text-sm text-muted-foreground">
                    사용자가 입력한 도메인 이름을 실제 IP 주소로 변환하여 응답
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Monitor className="h-5 w-5 text-accent mt-1" />
                <div>
                  <p className="font-medium">클라이언트(사용자 PC)</p>
                  <p className="text-sm text-muted-foreground">
                    도메인 이름을 요청하고, 반환된 IP 주소로 접속 시도
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Database className="h-5 w-5 text-chart-2 mt-1" />
                <div>
                  <p className="font-medium">호스트 서버</p>
                  <p className="text-sm text-muted-foreground">
                    DNS 서버가 알려준 IP 주소에 실제로 존재하는 서비스(웹/메일 등)
                  </p>
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
          <p className="text-muted-foreground">단계별 실습을 통해 리눅스 환경에서 DNS서비스를 구축해보세요</p>
        </div>

        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">🚀 실습 시작하기</CardTitle>
            <CardDescription>
              리눅스 환경에서 DNS서버 구축과 zone파일 설정, 3tier까지 활용하는 실습입니다
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/practice/dns">
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
