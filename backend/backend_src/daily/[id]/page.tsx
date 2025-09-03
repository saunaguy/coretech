"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Question = { id: string; question: string; options: string[] }

export default function DailyDetailPage() {
  const params = useParams() as { id: string }
  const [title, setTitle] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [result, setResult] = useState<{ total: number; correct: number } | null>(null)
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

  useEffect(() => {
    const load = async () => {
      const r = await fetch(`${base}/api/v1/daily/tests/${params.id}`)
      if (r.ok) {
        const data = await r.json()
        setTitle(data.title)
        setQuestions(data.questions)
      }
    }
    load()
  }, [params.id])

  const submit = async () => {
    const r = await fetch(`${base}/api/v1/daily/tests/${params.id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    })
    if (r.ok) {
      setResult(await r.json())
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{title || "데일리 테스트"}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {questions.map((q) => (
            <div key={q.id} className="space-y-2">
              <div className="font-medium">{q.question}</div>
              <div className="space-y-1">
                {q.options.map((opt, idx) => (
                  <label key={idx} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name={q.id}
                      value={idx}
                      onChange={() => setAnswers((s) => ({ ...s, [q.id]: idx }))}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <Button onClick={submit}>제출</Button>
          {result && (
            <div className="text-sm text-muted-foreground">점수: {result.correct} / {result.total}</div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
