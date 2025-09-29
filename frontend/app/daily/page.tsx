import Link from "next/link";
import { headers } from "next/headers";
import { format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  BarChart3,
  Calendar,
  Clock,
  Layers,
  Server,
  TerminalSquare,
  Globe2,
  Database,
  Star,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_DAILY_TESTS } from "@/lib/daily-data";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type ApiDailyListItem = {
  id: string | number;

  title?: string;

  category?: string | null;

  createdAt?: string | null;

  difficulty?: string | null;
};

type DailyTest = {
  id: string;

  title: string;

  category: string;

  createdAt?: string;

  difficulty?: string;
};

type RankedDailyTest = DailyTest & {
  order: number;

  solved: boolean;

  favorite: boolean;
};

type UserState = {
  solved?: Array<string | number>;

  favorites?: Array<string | number>;
};

const CATEGORY_TITLE_PREFIX: Record<string, string> = {
  linux: "리눅스 심화",

  network: "네트워크 심화",

  database: "데이터베이스 심화",

  server: "서버 운영 심화",
};

const CATEGORY_META: Record<
  string,
  {
    label: string;

    summary: string;

    icon: LucideIcon;
  }
> = {
  linux: {
    label: "리눅스 기초",

    summary: "셸, 프로세스, 파일 시스템 감각을 다듬어 보세요.",

    icon: TerminalSquare,
  },

  network: {
    label: "네트워킹",

    summary: "OSI 계층, 프로토콜, 트러블슈팅 감을 정리합니다.",

    icon: Globe2,
  },

  database: {
    label: "데이터베이스",

    summary: "SQL 패턴과 정규화, 성능 팁을 복습합니다.",

    icon: Database,
  },

  server: {
    label: "서버 운영",

    summary: "Docker, 웹 서버, 자동화 감각을 유지하세요.",

    icon: Server,
  },
};

const difficultyTone: Record<string, string> = {
  초급: "border-emerald-200 bg-emerald-50 text-emerald-600",

  중급: "border-amber-200 bg-amber-50 text-amber-600",

  고급: "border-rose-200 bg-rose-50 text-rose-600",
};

const API_BASE = (
  process.env.INTERNAL_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8000"
).replace(/\/+$/, "");

type UserStateSets = {
  solved: Set<string>;

  favorites: Set<string>;
};

async function fetchDailyList(category: string): Promise<DailyTest[]> {
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/daily/tests?category=${encodeURIComponent(category)}`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) {
      return [];
    }

    const data = (await res.json()) as ApiDailyListItem[];

    return data

      .filter(
        (item): item is ApiDailyListItem & { id: string | number } =>
          item.id !== undefined && item.id !== null,
      )

      .map((item) => ({
        id: String(item.id),

        title: item.title || "제목 미정",

        category: (item.category || category).toLowerCase(),

        createdAt: item.createdAt ?? undefined,

        difficulty: item.difficulty ?? undefined,
      }));
  } catch {
    return [];
  }
}

async function fetchUserState(): Promise<UserStateSets> {
  try {
    const cookieHeader = headers().get("cookie");

    const res = await fetch(`${API_BASE}/api/v1/daily/user-state`, {
      cache: "no-store",

      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    });

    if (!res.ok) {
      return { solved: new Set(), favorites: new Set() };
    }

    const data = (await res.json()) as UserState;

    return {
      solved: new Set((data.solved ?? []).map((id) => String(id))),

      favorites: new Set((data.favorites ?? []).map((id) => String(id))),
    };
  } catch {
    return { solved: new Set(), favorites: new Set() };
  }
}

function fallbackTestsByCategory(): Record<string, DailyTest[]> {
  const grouped: Record<string, DailyTest[]> = {};

  Object.values(MOCK_DAILY_TESTS).forEach((item) => {
    const cat = (item.category || "").toLowerCase();

    if (!cat) {
      return;
    }

    if (!grouped[cat]) {
      grouped[cat] = [];
    }

    grouped[cat].push({
      id: String(item.id),

      title: item.title,

      category: cat,

      createdAt: item.createdAt,

      difficulty: item.difficulty,
    });
  });

  return grouped;
}

function safeDate(value?: string) {
  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

function formatRelative(value?: string) {
  const date = safeDate(value);

  if (!date) return null;

  try {
    return formatDistanceToNow(date, { addSuffix: true, locale: ko });
  } catch {
    return null;
  }
}

function extractOrder(title: string, fallback: number) {
  const match = title.match(/(\d+)\s*$/);

  if (!match) return fallback;

  const parsed = Number(match[1]);

  return Number.isFinite(parsed) ? parsed : fallback;
}

function rankItems(
  items: DailyTest[],
  solvedSet: Set<string>,
  favoritesSet: Set<string>,
): RankedDailyTest[] {
  return items

    .map((item, idx) => ({
      ...item,

      order: extractOrder(item.title, idx + 1),

      solved: solvedSet.has(item.id),

      favorite: favoritesSet.has(item.id),
    }))

    .sort((a, b) => {
      if (a.solved !== b.solved) {
        return a.solved ? 1 : -1;
      }

      if (a.order !== b.order) {
        return a.order - b.order;
      }

      return a.title.localeCompare(b.title);
    });
}

function normalizeTitle(item: RankedDailyTest, metaLabel?: string) {
  const indexLabel = String(item.order).padStart(2, "0");

  const cleaned = item.title.replace(/\?+/g, "").trim();

  if (cleaned) {
    if (/\d+$/.test(cleaned)) {
      return cleaned.replace(/\d+$/, indexLabel);
    }

    if (cleaned.endsWith("세트")) {
      return `${cleaned} ${indexLabel}`;
    }

    return `${cleaned} 세트 ${indexLabel}`;
  }

  const prefix =
    CATEGORY_TITLE_PREFIX[item.category] ?? metaLabel ?? item.category;

  const base = prefix.endsWith("세트") ? prefix : `${prefix} 세트`;

  return `${base} ${indexLabel}`;
}

function TestItemCard({ item }: { item: RankedDailyTest }) {
  const createdLabel = safeDate(item.createdAt)
    ? format(safeDate(item.createdAt)!, "yyyy.MM.dd HH:mm")
    : null;

  const relativeLabel = formatRelative(item.createdAt);

  const difficultyClass =
    difficultyTone[item.difficulty ?? ""] ??
    "border-slate-200 bg-slate-50 text-slate-600";

  const meta = CATEGORY_META[item.category];

  const indexLabel = String(item.order).padStart(2, "0");

  const displayTitle = normalizeTitle(item, meta?.label);

  const containerClass = cn(
    "group block rounded-xl border border-border/70 bg-background/70 p-4 shadow-sm transition hover:-translate-y-0.5",

    item.solved
      ? "bg-muted text-muted-foreground hover:border-border hover:bg-muted"
      : "hover:border-primary/60 hover:bg-background",
  );

  return (
    <Link href={`/daily/${item.id}`} className={containerClass}>
      <div className="flex items-start gap-4">
        <span
          className={cn(
            "mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold",

            item.solved
              ? "border-border text-muted-foreground"
              : "border-primary/40 text-primary",
          )}
        >
          {indexLabel}
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground">
            {createdLabel && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 opacity-70" />

                {createdLabel}
              </span>
            )}

            {createdLabel && relativeLabel && (
              <span className="text-muted-foreground/70">|</span>
            )}

            {relativeLabel && <span>{relativeLabel}</span>}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary/90">
              {displayTitle}
            </h3>

            {meta && (
              <p className="mt-1 text-sm text-muted-foreground">
                {meta.summary}
              </p>
            )}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={cn("border text-xs font-medium", difficultyClass)}
            >
              {item.difficulty ?? "난이도 미정"}
            </Badge>

            <Badge variant="secondary" className="text-xs font-medium">
              {meta?.label ?? item.category}
            </Badge>

            {item.favorite && (
              <Badge
                variant="outline"
                className="flex items-center gap-1 border-yellow-200 bg-yellow-50 text-[11px] font-medium text-yellow-700"
              >
                <Star
                  className="h-3.5 w-3.5 text-yellow-500"
                  fill="currentColor"
                  aria-hidden
                />
                즐겨찾기
              </Badge>
            )}

            {item.solved && (
              <Badge
                variant="secondary"
                className="text-xs font-medium bg-muted text-muted-foreground"
              >
                풀이 완료
              </Badge>
            )}
          </div>
        </div>

        <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition group-hover:text-primary" />
      </div>
    </Link>
  );
}

export default async function DailyPage() {
  const categories = Object.keys(CATEGORY_META);

  const { solved: solvedSet, favorites: favoritesSet } = await fetchUserState();

  const results = await Promise.all(
    categories.map((key) => fetchDailyList(key)),
  );

  const hasAny = results.some((items) => items.length > 0);

  const fallback = fallbackTestsByCategory();

  const grouped = categories

    .map((category, index) => {
      const source =
        results[index].length > 0 ? results[index] : fallback[category] || [];

      const ranked = rankItems(source, solvedSet, favoritesSet);

      return {
        category,

        meta: CATEGORY_META[category],

        items: ranked,
      };
    })

    .filter((group) => group.items.length > 0);

  const allItems = grouped.flatMap((group) => group.items);

  const latestDate = allItems

    .map((item) => safeDate(item.createdAt))

    .filter((date): date is Date => !!date)

    .sort((a, b) => b.getTime() - a.getTime())[0];

  const stats = {
    total: allItems.length,

    categories: grouped.length,

    lastUpdated: latestDate
      ? formatDistanceToNow(latestDate, { addSuffix: true, locale: ko })
      : "정보 없음",
  };

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl border bg-slate-950 text-white shadow-xl">
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary/20 via-slate-900/60 to-slate-900"
          aria-hidden
        />

        <div
          className="absolute -top-32 right-0 h-64 w-64 rounded-full bg-primary/30 blur-3xl"
          aria-hidden
        />

        <div className="relative flex flex-col gap-8 p-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-widest text-primary/70">
              Daily quiz
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
              Daily quiz
            </h1>

            <p className="mt-4 text-base text-white/80">
              리눅스, 네트워크, 데이터베이스, 서버 운영 영역의 핵심 질문을 하루
              한 번씩 확인하세요. 꾸준한 풀이가 실무 감각을 유지시켜 줍니다.
            </p>
          </div>

          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <dt className="text-xs tracking-wide text-white/70">
                등록된 세트
              </dt>

              <dd className="mt-2 flex items-center gap-2 text-2xl font-semibold">
                <Layers className="h-5 w-5 opacity-80" />

                {stats.total}
              </dd>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <dt className="text-xs tracking-wide text-white/70">
                활성 카테고리
              </dt>

              <dd className="mt-2 flex items-center gap-2 text-2xl font-semibold">
                <BarChart3 className="h-5 w-5 opacity-80" />

                {stats.categories}
              </dd>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <dt className="text-xs tracking-wide text-white/70">
                최근 업데이트
              </dt>

              <dd className="mt-2 flex items-center gap-2 text-lg font-semibold">
                <Clock className="h-5 w-5 opacity-80" />

                {stats.lastUpdated}
              </dd>
            </div>
          </dl>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <Link
              href="/daily/sets"
              className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-white/90"
            >
              전체 세트 보기
            </Link>
            <Link
              href="/daily/sets?favorites=1"
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/40 bg-primary/80 px-6 text-sm font-semibold text-white shadow transition hover:bg-primary"
            >
              즐겨찾기 모아보기
            </Link>
          </div>
        </div>
      </section>

      {grouped.length === 0 ? (
        <section className="mx-auto flex max-w-3xl flex-col items-center justify-center rounded-3xl border bg-muted/40 px-8 py-16 text-center">
          <p className="text-2xl font-semibold text-foreground">
            등록된 문제가 아직 없습니다.
          </p>

          <p className="mt-3 text-sm text-muted-foreground">
            API에서 문제를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        </section>
      ) : (
        <section className="space-y-8">
          {grouped.map((group) => {
            const Icon = group.meta.icon;

            const visibleItems = group.items.slice(0, 4);

            const showMore = group.items.length > 4;

            return (
              <Card
                key={group.category}
                className="overflow-hidden border-border/80 shadow-lg"
              >
                <CardHeader className="flex flex-col gap-4 border-b border-border/60 bg-muted/40 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>

                    <div>
                      <CardTitle className="text-xl">
                        {group.meta.label}
                      </CardTitle>

                      <CardDescription>{group.meta.summary}</CardDescription>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className="w-fit border-border/60 text-xs tracking-wide"
                    >
                      총 {group.items.length}문제
                    </Badge>

                    {showMore && (
                      <Link
                        href={`/daily/sets?category=${group.category}`}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        전체 보기
                      </Link>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {visibleItems.map((item) => (
                      <TestItemCard key={item.id} item={item} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      )}

      {!hasAny && (
        <p className="text-sm text-muted-foreground">
          현재 API 데이터가 없어 임시 목업 데이터를 기준으로 화면을 구성하고
          있습니다.
        </p>
      )}
    </main>
  );
}
