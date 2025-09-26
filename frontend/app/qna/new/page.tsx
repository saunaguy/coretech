'use client';

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Badge } from "@/components/ui/badge"
// import { X } from "lucide-react"

const CATEGORIES = ["server", "network", "others"]

export default function NewQuestionPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [category, setCategory] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Tag Autocomplete States
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [inputValue, setInputValue] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Fetch available tags from backend
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await authenticatedFetch("/api/v1/qna/tags")
        setAvailableTags(data)
      } catch (e) {
        console.error("Failed to fetch tags:", e)
      }
    }
    fetchTags()
  }, [])

  // Filter suggestions based on input value
  useEffect(() => {
    if (inputValue) {
      const filtered = availableTags.filter(
        (tag) =>
          tag.toLowerCase().includes(inputValue.toLowerCase()) &&
          !selectedTags.includes(tag)
      )
      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [inputValue, availableTags, selectedTags])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag])
      setInputValue("")
      setShowSuggestions(false)
    }
  }

  const handleTagRemove = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !body || !category) {
      setError("제목, 내용, 카테고리는 필수 항목입니다.")
      return
    }
    if (!user) {
      setError("로그인이 필요합니다.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await authenticatedFetch("/api/v1/qna/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          body,
          category,
          tags: selectedTags, // Use selectedTags here
        }),
      })

      if (!response) {
        throw new Error("서버에서 응답을 받지 못했습니다.")
      }
      
      router.push("/qna")

    } catch (err) {
      setError(err instanceof Error ? err.message : "질문 등록에 실패했습니다.")
      setIsSubmitting(false)
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">새 질문 작성</CardTitle>
            <CardDescription>다른 사용자들과 지식을 공유해보세요.</CardDescription>
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
              <Select onValueChange={setCategory} required>
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
            <div className="space-y-2 relative">
              <label htmlFor="tags" className="font-medium">태그</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedTags.map((tag) => (
                  <span key={tag} className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                    {tag}
                    <button type="button" className="ml-1 h-3 w-3 cursor-pointer" onClick={() => handleTagRemove(tag)}>
                      X
                    </button>
                  </span>
                ))}
              </div>
              <Input
                id="tags"
                placeholder="태그를 입력하거나 선택하세요."
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} // Delay to allow click on suggestion
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && inputValue && !selectedTags.includes(inputValue)) {
                    handleTagSelect(inputValue)
                    e.preventDefault()
                  }
                }}
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-popover border rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
                  {suggestions.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className="w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                      onClick={() => handleTagSelect(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex gap-2 ml-auto">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                취소
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "등록 중..." : "질문 등록"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </main>
  )
}