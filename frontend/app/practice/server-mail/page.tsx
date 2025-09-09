import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Mail, Server, Database, Globe, Layers, Monitor } from "lucide-react"
import Link from "next/link"

export default function MailServerOverviewPage() {
  return (
    <main className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="flex items-center justify-center gap-2">
          <Layers className="h-8 w-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Server 실습 교육</h1>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-balance text-foreground">메일 서버 아키텍처 이해하기</h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
          Postfix와 Dovecot을 통해 이메일 송수신 과정을 직접 구성하고 이해해보세요.
        </p>
      </section>

      {/* Architecture Diagram (placeholder area) */}
      <section className="space-y-8">
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-4">시스템 아키텍처</h3>
          <div className="bg-card rounded-lg p-4 md:p-8 border">
            <div className="w-full max-w-4xl mx-auto rounded-lg shadow-lg overflow-hidden">
              <img
                src="/practice/server-mail/asset/mail-server.svg" // Placeholder for mail server diagram
                alt="Mail Server Architecture Diagram"
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
                비유로 이해하는 메일 서버
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                메일 서버를 <strong className="text-foreground">우체국 시스템</strong>에 비유해보면:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">MTA</Badge>
                  <p className="text-sm"><strong>우체부</strong> - 편지(이메일)를 수거하고 배달하는 역할</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">MDA</Badge>
                  <p className="text-sm"><strong>우편함</strong> - 배달된 편지를 사용자별로 분류하고 보관하는 역할</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">MUA</Badge>
                  <p className="text-sm"><strong>편지 쓰는 사람</strong> - 편지를 작성하고 읽는 사용자</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-accent" />
                기술적 구조 (메일 서버)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">SMTP (Simple Mail Transfer Protocol)</p>
                    <p className="text-sm text-muted-foreground">메일 전송 프로토콜 (주로 Postfix 사용)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Monitor className="h-5 w-5 text-accent mt-1" />
                  <div>
                    <p className="font-medium">IMAP/POP3</p>
                    <p className="text-sm text-muted-foreground">메일 수신 프로토콜 (주로 Dovecot 사용)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Database className="h-5 w-5 text-chart-2 mt-1" />
                  <div>
                    <p className="font-medium">DNS (MX Record)</p>
                    <p className="text-sm text-muted-foreground">메일 서버 위치를 알려주는 DNS 레코드</p>
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
          <p className="text-muted-foreground">단계별 실습을 통해 리눅스 환경에서 메일 서버를 구축해보세요</p>
        </div>

        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">🚀 실습 시작하기</CardTitle>
            <CardDescription>
              리눅스 환경에서 Postfix와 Dovecot을 이용한 메일 서버를 직접 구축하고 설정해보는 실습입니다
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/practice/mail-server">
              <Button size="lg" className="gap-2">
                실습 연결하기
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-4">예상 소요 시간: 1-2시간 | 난이도: 고급</p>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
