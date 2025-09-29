'use client'

import { useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, HelpCircle, RefreshCcw, Clock } from "lucide-react";

type DailyTestItem = {
  id: string;
  title?: string;
  category?: string;
  difficulty?: string;
  createdAt?: string;
  question?: string;
  options?: Array<string>;
  answer?: string | number;
  explanation?: string;
};

const difficultyTone: Record<string, string> = {
  "초급": "border-emerald-200 bg-emerald-50 text-emerald-600",
  "중급": "border-amber-200 bg-amber-50 text-amber-600",
  "고급": "border-rose-200 bg-rose-50 text-rose-600",
};

const CATEGORY_LABELS: Record<string, string> = {
  linux: "리눅스",
  network: "네트워크",
  database: "데이터베이스",
  server: "서버",
};

function safeDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export default function DailyTestInteractiveWithSolve({ item }: { item: DailyTestItem }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [marking, setMarking] = useState(false);

  const {
    id,
    title = "제목 미정",
    category = "분류 미정",
    difficulty = "난이도 미정",
    createdAt: createdAtRaw,
    question = "문항 정보를 불러오지 못했습니다.",
    options = [],
    answer,
    explanation,
  } = item;

  const createdAt = safeDate(createdAtRaw) ?? new Date();
  const createdLabel = format(createdAt, "yyyy.MM.dd HH:mm");
  const relativeLabel = formatDistanceToNow(createdAt, { addSuffix: true, locale: ko });
  const displayCategory = CATEGORY_LABELS[(category || "").toLowerCase()] ?? category;
  const difficultyClass = difficultyTone[difficulty ?? ""] ?? "border-slate-200 bg-slate-50 text-slate-600";

  const resolvedAnswerIndex = typeof answer === "number" ? answer : options.findIndex((opt) => opt === answer);
  const resolvedAnswerLabel =
    resolvedAnswerIndex >= 0 && resolvedAnswerIndex < options.length ? options[resolvedAnswerIndex] : undefined;
  const hasScoring = resolvedAnswerIndex >= 0;

  const isCorrectSelection = isSubmitted && hasScoring && selectedIndex !== null && selectedIndex === resolvedAnswerIndex;

  const handleSubmit = async () => {
    if (selectedIndex === null || isSubmitted) return;
    setIsSubmitted(true);
    try {
      setMarking(true);
      await fetch(`/api/v1/daily/tests/${id}/solved`, { method: "POST", credentials: "include" });
    } catch {
      // 서버 반영은 실패하더라도 무시합니다.
    } finally {
      setMarking(false);
    }
  };

  const handleReset = () => {
    setSelectedIndex(null);
    setIsSubmitted(false);
  };

  const renderOptionState = (index: number) => {
    if (!isSubmitted) {
      return {
        icon: <HelpCircle className="h-5 w-5 text-muted-foreground/70" />,
        className:
          selectedIndex === index
            ? "border-primary bg-primary/10 shadow-sm"
            : "border-border hover:border-primary/50 hover:bg-primary/5",
      };
    }

    if (!hasScoring) {
      return {
        icon: <HelpCircle className="h-5 w-5 text-muted-foreground/50" />,
        className: "border-border text-muted-foreground",
      };
    }

    if (index === resolvedAnswerIndex) {
      return {
        icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
        className: "border-emerald-300 bg-emerald-50 text-emerald-700 shadow-sm",
      };
    }

    if (selectedIndex === index && index !== resolvedAnswerIndex) {
      return {
        icon: <XCircle className="h-5 w-5 text-rose-500" />,
        className: "border-rose-300 bg-rose-50 text-rose-700",
      };
    }

    return {
      icon: <HelpCircle className="h-5 w-5 text-muted-foreground/50" />,
      className: "border-border text-muted-foreground",
    };
  };

  const resultIcon = !hasScoring ? (
    <HelpCircle className="h-5 w-5" />
  ) : isCorrectSelection ? (
    <CheckCircle className="h-5 w-5" />
  ) : (
    <XCircle className="h-5 w-5" />
  );

  const resultMessage = !hasScoring
    ? "정답 정보가 없어 자동 채점이 지원되지 않습니다."
    : isCorrectSelection
    ? "정답입니다! 잘하셨어요."
    : "아쉽지만 다음에 다시 도전해 보세요.";

  return (
    <Card className="overflow-hidden border border-border/80 shadow-xl">
      <CardHeader className="gap-5 border-b border-border/60 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
            <CardDescription className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {createdLabel}
              </span>
              <span className="text-muted-foreground/70">|</span>
              <span>{relativeLabel}</span>
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="text-xs tracking-wide">
              {displayCategory}
            </Badge>
            <Badge variant="outline" className={cn("text-xs font-semibold", difficultyClass)}>
              {difficulty}
            </Badge>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          보기 중 하나를 선택한 뒤 제출 버튼을 눌러 정답을 확인하세요.
        </p>
      </CardHeader>

      <CardContent className="space-y-8 p-6">
        <p className="text-lg font-medium leading-relaxed text-foreground">{question}</p>

        {options.length > 0 ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold tracking-wide text-muted-foreground">보기</h3>
            <div className="space-y-2">
              {options.map((option, index) => {
                const state = renderOptionState(index);
                return (
                  <button
                    key={`option-${index}`}
                    type="button"
                    onClick={() => !isSubmitted && setSelectedIndex(index)}
                    disabled={isSubmitted}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      state.className
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold",
                        selectedIndex === index ? "border-primary text-primary" : "border-border text-muted-foreground"
                      )}
                    >
                      {index + 1}
                    </span>
                    {state.icon}
                    <span className="text-sm leading-relaxed">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/70 bg-muted/60 p-6 text-center text-sm text-muted-foreground">
            보기 정보는 문제가 완성되면 표시됩니다.
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {!isSubmitted ? (
            <Button
              onClick={handleSubmit}
              disabled={selectedIndex === null || marking}
              className="w-full sm:w-auto"
            >
              {marking ? "저장 중..." : "답안 제출"}
            </Button>
          ) : (
            <>
              <Button variant="secondary" disabled className="w-full sm:w-auto">
                제출 완료
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                className="w-full sm:w-auto"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                다시 풀기
              </Button>
            </>
          )}
        </div>

        {isSubmitted && (
          <div className="space-y-4">
            <div
              className={cn(
                "rounded-2xl border p-4",
                !hasScoring
                  ? "border-border bg-muted text-muted-foreground"
                  : isCorrectSelection
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-rose-200 bg-rose-50 text-rose-700"
              )}
            >
              <div className="flex items-center gap-2 text-sm font-semibold">
                {resultIcon}
                {resultMessage}
              </div>
              {hasScoring && !isCorrectSelection && resolvedAnswerLabel && (
                <p className="mt-1 text-sm text-foreground/80">정답: {resolvedAnswerLabel}</p>
              )}
            </div>

            {explanation && (
              <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4">
                <h4 className="text-sm font-semibold text-primary">해설</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{explanation}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
