import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function NetworkBasicsPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <section className="rounded-2xl border bg-gradient-to-br from-primary/10 to-accent/10 p-8 md:p-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">네트워크 기초</h1>
            <p className="text-muted-foreground max-w-2xl">
              진단/포트/프로토콜 등 네트워킹의 기본 개념을 정리합니다. (콘텐츠 준비중)
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/daily?category=network">데일리 테스트</Link>
            </Button>
          </div>
        </div>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>소개</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">이 페이지는 개요/목차/Hero 레이아웃을 먼저 준비했습니다. 세부 문서는 이후 추가됩니다.</p>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

