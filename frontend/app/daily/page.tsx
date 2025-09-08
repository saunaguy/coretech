import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MOCK_DAILY_TESTS } from "@/lib/daily-data"

export const dynamic = "force-dynamic"

async function getDaily(category?: string) {
  // API 호출 로직을 완전히 제거하고, 오직 목 데이터만 사용합니다.
  const mockCategoryData = Object.values(MOCK_DAILY_TESTS).filter(test => test.category === category);
  return mockCategoryData;
}

const TestItemCard = ({ item }) => (
    <Link href={`/daily/${item.id}`} className="block p-4 rounded-lg border bg-card text-card-foreground hover:bg-muted/50 transition-colors">
        <div className="flex justify-between items-start">
            <h3 className="font-semibold flex-1 pr-2">{item.title}</h3>
            <Badge variant={item.difficulty === '초급' ? 'default' : item.difficulty === '중급' ? 'destructive' : 'outline'} className="shrink-0">{item.difficulty}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
            {new Date(item.createdAt).toLocaleDateString()} 생성
        </p>
    </Link>
);

export default async function DailyPage() {
  const categories = ["Linux", "Network", "Database", "Server"];
  const testsByCategory = await Promise.all(
      categories.map(cat => getDaily(cat))
  );

  const allTests = categories.map((category, index) => ({
      category,
      items: testsByCategory[index]
  })).filter(group => group.items.length > 0);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">데일리 테스트</h1>
        <p className="mt-2 text-lg text-muted-foreground">매일 새로운 문제로 주요 개념을 복습하고 실력을 점검하세요.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {allTests.map(group => (
            <Card key={group.category} className="h-full">
                <CardHeader>
                    <CardTitle>{group.category}</CardTitle>
                    <CardDescription>{group.category} 관련 문제 목록입니다.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {group.items.map(item => (
                            <TestItemCard key={item.id} item={item} />
                        ))}
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </main>
  )
}