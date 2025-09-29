import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DailyTestInteractiveWithSolve from "@/components/dailytest/DailyTestInteractiveWithSolve";
import { MOCK_DAILY_TESTS } from "@/lib/daily-data";

const API_BASE = (process.env.INTERNAL_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000").replace(/\/+$/, "");

type ApiDailyQuestion = {
  id?: string;
  question?: string;
  options?: string[];
  answer?: number;
  explanation?: string | null;
};

type ApiDailyDetail = {
  id: number;
  title?: string;
  category?: string | null;
  createdAt?: string | null;
  questions?: ApiDailyQuestion[];
};

type DailyTestItem = {
  id: string;
  title?: string;
  category?: string;
  difficulty?: string;
  createdAt?: string;
  question?: string;
  options?: string[];
  answer?: number | string;
  explanation?: string;
};

async function fetchDailyTestFromApi(id: string): Promise<DailyTestItem | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/daily/tests/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return null;
    }
    const data = (await res.json()) as ApiDailyDetail;
    const [firstQuestion] = data.questions || [];
    if (!firstQuestion) {
      return null;
    }
    return {
      id: String(data.id),
      title: data.title ?? "제목 미정",
      category: data.category ?? undefined,
      createdAt: data.createdAt ?? undefined,
      question: firstQuestion.question ?? "문항 정보를 불러오지 못했습니다.",
      options: firstQuestion.options ?? [],
      answer: firstQuestion.answer ?? undefined,
      explanation: firstQuestion.explanation ?? undefined,
    };
  } catch {
    return null;
  }
}

function fallbackDailyTest(id: string): DailyTestItem | null {
  const item = MOCK_DAILY_TESTS[id];
  if (!item) {
    return null;
  }
  return {
    id: String(item.id ?? id),
    title: item.title,
    category: item.category,
    difficulty: item.difficulty,
    createdAt: item.createdAt,
    question: item.question,
    options: item.options,
    answer: item.answer,
    explanation: item.explanation,
  };
}

export default async function DailyTestPage({ params }: { params: { id: string } }) {
  const fromApi = await fetchDailyTestFromApi(params.id);
  const item = fromApi ?? fallbackDailyTest(params.id);

  if (!item) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">데일리 테스트</h1>
        <Button variant="outline" asChild>
          <Link href="/daily">목록으로</Link>
        </Button>
      </div>
      <DailyTestInteractiveWithSolve item={item} />
    </main>
  );
}
