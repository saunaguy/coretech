"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { authenticatedFetch } from "@/lib/auth"
import { useAuth } from "@/components/auth/AuthProvider"

const CATEGORIES = ["server", "network", "others"]

export default function EditQuestionPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const { user } = useAuth()

  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [tags, setTags] = useState("")
  const [category, setCategory] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchQuestion = async () => {
      setIsLoading(true)
      try {
        const data = await authenticatedFetch(`/api/v1/qna/questions/${id}`)
        if (data) {
          // TODO: Add authorization check. Redirect if user is not the author.
          setTitle(data.title)
          setBody(data.body)
          setCategory(data.category)
          setTags((data.tags || []).join(", "))
        }
      } catch (err) {
        setError("질문 정보를 불러오는 데 실패했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestion()
  }, [id])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !body || !category) {
      setError("제목, 내용, 카테고리는 필수 항목입니다.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await authenticatedFetch(`/api/v1/qna/questions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          body,
          category,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      })
      router.push(`/qna/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "질문 수정에 실패했습니다.")
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <main className="max-w-3xl mx-auto px-4 py-12 text-center">로딩 중...</main>
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <form onSubmit={handleUpdate}>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">질문 수정</CardTitle>
            <CardDescription>질문 내용을 수정하고 저장해주세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="font-medium">제목</label>
              <Input
                id="title"
                placeholder="질문의 핵심 내용을 요약해주세요."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="category" className="font-medium">카테고리</label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="질문과 관련된 카테고리를 선택하세요." />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="body" className="font-medium">본문</label>
              <Textarea
                id="body"
                placeholder="궁금한 점에 대해 자세하게 설명해주세요."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                rows={10}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="tags" className="font-medium">태그</label>
              <Input
                id="tags"
                placeholder="쉼표(,)로 구분하여 태그를 입력하세요. (예: React, NextJS, TypeScript)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex gap-2 ml-auto">
              <Button type="button" variant="outline" onClick={() => router.push(`/qna/${id}`)}>
                취소
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "저장 중..." : "저장하기"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </main>
  )
}