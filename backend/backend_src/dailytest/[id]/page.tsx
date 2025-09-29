"use client"
// @ts-nocheck

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

type Question = { id: string; question: string; options: string[] }

export default function DailyDetailPage() {
  const params = useParams()
  const [title, setTitle] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [result, setResult] = useState<{ total: number; correct: number } | null>(null)
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000").replace(/\/+$/, "")
  const api = (p: string) => `${base}${p}`

  useEffect(() => {
    const load = async () => {
      const r = await fetch(api(`/api/v1/daily/tests/${params.id}`), { credentials: 'include' })
      if (r.ok) {
        const data = await r.json()
        setTitle(data.title)
        setQuestions(data.questions)
      }
    }
    load()
  }, [params.id])

  const submit = async () => {
    const r = await fetch(api(`/api/v1/daily/tests/${params.id}/submit`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
      credentials: 'include',
    })
    if (r.ok) {
      setResult(await r.json())
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">{title || "데일리 테스트"}</h1>
        <Link href="/dailytest" className="inline-flex h-9 items-center rounded-md border px-3 text-sm">목록으로</Link>
      </div>
      <div className="space-y-6">
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
        <button onClick={submit} className="inline-flex h-9 items-center rounded-md border px-3 text-sm">제출</button>
        {result && (
          <div className="text-sm text-muted-foreground">점수: {result.correct} / {result.total}</div>
        )}
      </div>
    </main>
  )
}
