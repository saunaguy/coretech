import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import DailyTestInteractive from "@/components/daily/DailyTestInteractive"
import { MOCK_DAILY_TESTS } from "@/lib/daily-data"

// 모든 복잡성을 제거하고 오직 목 데이터에서만 값을 찾도록 함수를 단순화합니다.
async function getDailyTest(id: string) {
  return MOCK_DAILY_TESTS[id] || null;
}

export default async function DailyTestPage({ params }: { params: { id: string } }) {
  const item = await getDailyTest(params.id);
  if (!item) {
    notFound();
  }

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">데일리 테스트</h1>
        <Button variant="outline" asChild>
          <Link href="/daily">목록으로</Link>
        </Button>
      </div>
      <DailyTestInteractive item={item} />
    </main>
  );
}