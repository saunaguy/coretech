'use client'

import Link from "next/link";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowUpRight, Star } from "lucide-react";

type UserState = { solved?: Array<string | number>; favorites?: Array<string | number> };
type RawTestItem = {
  id: string;
  title?: string;
  createdAt?: string;
  category?: string | null;
  difficulty?: string | null;
};
type RankedTestItem = RawTestItem & {
  order: number;
  solved: boolean;
  displayTitle: string;
};

type CategoryKey = "linux" | "network" | "database" | "server";

const CATEGORY_KEYS: CategoryKey[] = ["linux", "network", "database", "server"];
const CATEGORY_TITLE_PREFIX: Record<CategoryKey, string> = {
  linux: "리눅스 심화",
  network: "네트워크 심화",
  database: "데이터베이스 심화",
  server: "서버 운영 심화",
};
const CATEGORY_LABEL: Record<CategoryKey, string> = {
  linux: "리눅스",
  network: "네트워크",
  database: "데이터베이스",
  server: "서버 운영",
};
const CATEGORY_SUMMARY: Record<CategoryKey, string> = {
  linux: "핵심 명령, 서비스, 트러블슈팅을 빠르게 복습하세요.",
  network: "프로토콜 흐름과 진단 감각을 유지할 수 있도록 정리했습니다.",
  database: "SQL과 데이터 모델링 감각을 다듬을 수 있는 문항 모음입니다.",
  server: "서비스 운영, 자동화, 보안 관점의 심화 문제들입니다.",
};

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
const api = (path: string) => `${API_BASE}${path}`;

function extractOrder(title?: string, fallback = 0) {
  if (!title) return fallback;
  const match = title.match(/(\d+)\s*$/);
  if (!match) return fallback;
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function buildDisplayTitle(category: string, order: number, title?: string) {
  const idx = String(order).padStart(2, "0");
  const cleaned = title?.replace(/\?+/g, "").trim() ?? "";
  const prefix = CATEGORY_TITLE_PREFIX[category as CategoryKey] ?? CATEGORY_LABEL[category as CategoryKey] ?? category;
  if (!cleaned) {
    return `${prefix} 세트 ${idx}`;
  }
  if (/\d+$/.test(cleaned)) {
    return cleaned.replace(/\d+$/, idx);
  }
  if (cleaned.endsWith("세트")) {
    return `${cleaned} ${idx}`;
  }
  return `${cleaned} 세트 ${idx}`;
}

function TestItemCard({
  item,
  favorite,
  onToggleFavorite,
}: {
  item: RankedTestItem;
  favorite: boolean;
  onToggleFavorite: (id: string, next: boolean) => void;
}) {
  const createdLabel = item.createdAt ? format(new Date(item.createdAt), "yyyy-MM-dd HH:mm") : null;
  const indexLabel = String(item.order).padStart(2, "0");

  return (
    <Link
      href={`/daily/${item.id}`}
      className={cn(
        "group block rounded-xl border border-border/70 bg-background/70 p-4 shadow-sm transition",
        item.solved ? "bg-muted text-muted-foreground hover:border-border" : "hover:-translate-y-0.5 hover:border-primary/60"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold",
                item.solved ? "border-border text-muted-foreground" : "border-primary/40 text-primary"
              )}
            >
              {indexLabel}
            </span>
            {createdLabel && <span>{createdLabel}</span>}
            {item.difficulty && <Badge variant="outline" className="text-[10px] font-medium">{item.difficulty}</Badge>}
            {item.solved && <Badge variant="secondary" className="text-[10px] font-medium bg-muted text-muted-foreground">풀이 완료</Badge>}
          </div>
          <h3 className={cn("text-base font-semibold text-foreground", item.solved && "line-through")}>{item.displayTitle}</h3>
        </div>
        <button
          type="button"
          onClick={(evt) => {
            evt.preventDefault();
            onToggleFavorite(item.id, !favorite);
          }}
          aria-label="즐겨찾기 토글"
          className={cn(
            "rounded p-1 transition",
            favorite ? "text-yellow-500" : "text-muted-foreground hover:bg-muted/50"
          )}
        >
          <Star className={cn("h-5 w-5", favorite && "fill-yellow-500")}></Star>
        </button>
      </div>
      <ArrowUpRight className="mt-4 h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
    </Link>
  );
}

export default function DailySetsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = (searchParams.get("category") || "").toLowerCase() as CategoryKey | "";

  const [itemsByCat, setItemsByCat] = useState<Record<string, RawTestItem[]>>({});
  const [userState, setUserState] = useState<UserState>({ solved: [], favorites: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(api("/api/v1/daily/user-state"), { credentials: "include" });
        if (res.ok) {
          const data = (await res.json()) as UserState;
          setUserState({
            solved: (data.solved || []).map((id) => String(id)),
            favorites: (data.favorites || []).map((id) => String(id)),
          });
        }
      } catch {
        // ignore user-state errors
      }

      const results: Record<string, RawTestItem[]> = {};
      await Promise.all(
        CATEGORY_KEYS.map(async (cat) => {
          try {
            const res = await fetch(api(`/api/v1/daily/tests?category=${encodeURIComponent(cat)}`), { cache: "no-store" });
            if (res.ok) {
              const arr = (await res.json()) as RawTestItem[];
              results[cat] = (arr || []).map((item) => ({
                id: String(item.id),
                title: item.title,
                createdAt: item.createdAt,
                category: item.category ?? cat,
                difficulty: item.difficulty ?? undefined,
              }));
            } else {
              results[cat] = [];
            }
          } catch {
            results[cat] = [];
          }
        })
      );
      setItemsByCat(results);
      setLoading(false);
    };

    load();
  }, []);

  const solvedSet = useMemo(() => new Set((userState.solved || []).map((id) => String(id))), [userState.solved]);

  const normalizedByCat = useMemo(() => {
    const mapped: Record<string, RankedTestItem[]> = {};
    for (const cat of CATEGORY_KEYS) {
      const rawItems = itemsByCat[cat] || [];
      const ranked = rawItems
        .map((item, index) => {
          const order = extractOrder(item.title, index + 1);
          const categoryKey = (item.category || cat).toLowerCase() as CategoryKey;
          return {
            ...item,
            category: categoryKey,
            order,
            solved: solvedSet.has(item.id),
            displayTitle: buildDisplayTitle(categoryKey, order, item.title),
          };
        })
        .sort((a, b) => {
          if (a.solved !== b.solved) {
            return a.solved ? 1 : -1;
          }
          if (a.order !== b.order) {
            return a.order - b.order;
          }
          return a.displayTitle.localeCompare(b.displayTitle);
        });
      mapped[cat] = ranked;
    }
    return mapped;
  }, [itemsByCat, solvedSet]);

  const favoritesSet = useMemo(() => new Set((userState.favorites || []).map((id) => String(id))), [userState.favorites]);

  const handleToggleFavorite = async (id: string, next: boolean) => {
    const target = String(id);
    try {
      const res = await fetch(api(`/api/v1/daily/tests/${target}/favorite`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ favorite: next }),
      });
      if (!res.ok) {
        return;
      }
      setUserState((prev) => ({
        ...prev,
        favorites: next
          ? Array.from(new Set([...(prev.favorites || []).map(String), target]))
          : (prev.favorites || []).map(String).filter((fav) => fav !== target),
      }));
    } catch {
      // ignore network errors
    }
  };

  const activeCategories: CategoryKey[] = selectedCategory && CATEGORY_KEYS.includes(selectedCategory as CategoryKey)
    ? [selectedCategory as CategoryKey]
    : CATEGORY_KEYS;
  const visibleGroups = activeCategories
    .map((cat) => ({
      category: cat,
      items: normalizedByCat[cat] || [],
    }))
    .filter((group) => group.items.length > 0);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl border bg-slate-950 text-white shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-slate-900/60 to-slate-900" aria-hidden />
        <div className="relative flex flex-col gap-8 p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold tracking-widest text-primary/70">Daily quiz archive</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">카테고리별 문제 전체 보기</h1>
              <p className="mt-4 text-base text-white/80">
                카테고리를 바꿔가며 전체 세트를 확인하고, 오늘 풀이한 항목은 회색으로 표시됩니다. 즐겨찾기를 사용하면 자주 보는 문제만 모아둘 수 있어요.
              </p>
            </div>
            <Button variant="secondary" onClick={() => router.push("/daily")}>목록으로 돌아가기</Button>
          </div>
          {selectedCategory && (
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Button variant="ghost" size="sm" className="text-white" onClick={() => router.push("/daily/sets")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> 전체 카테고리 보기
              </Button>
              <span>현재 선택: {CATEGORY_LABEL[selectedCategory as CategoryKey] ?? selectedCategory}</span>
            </div>
          )}
        </div>
      </section>

      {loading ? (
        <p className="text-sm text-muted-foreground">문제 세트를 불러오는 중입니다...</p>
      ) : visibleGroups.length === 0 ? (
        <section className="mx-auto flex max-w-3xl flex-col items-center justify-center rounded-3xl border bg-muted/40 px-8 py-16 text-center">
          <p className="text-2xl font-semibold text-foreground">등록된 문제가 아직 없습니다.</p>
          <p className="mt-3 text-sm text-muted-foreground">문제가 준비되면 이곳에 자동으로 표시됩니다.</p>
        </section>
      ) : (
        <section className="space-y-8">
          {visibleGroups.map((group) => {
            const items = group.items;
            return (
              <Card key={group.category} className="overflow-hidden border-border/80 shadow-lg">
                <CardHeader className="flex flex-col gap-4 border-b border-border/60 bg-muted/40 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-xl">{CATEGORY_LABEL[group.category] ?? group.category}</CardTitle>
                    <CardDescription>{CATEGORY_SUMMARY[group.category]}</CardDescription>
                  </div>
                  <Badge variant="outline" className="w-fit border-border/60 text-xs tracking-wide">
                    총 {items.length}문제
                  </Badge>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    {items.map((item) => (
                      <TestItemCard
                        key={item.id}
                        item={item}
                        favorite={favoritesSet.has(item.id)}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      )}
    </main>
  );
}
