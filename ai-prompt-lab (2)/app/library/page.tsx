import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

// Mock data for saved responses
const savedResponses = [
  {
    id: 1,
    prompt: "React에서 useState와 useEffect의 차이점을 설명해주세요",
    snippet:
      "useState는 컴포넌트의 상태를 관리하는 Hook이고, useEffect는 사이드 이펙트를 처리하는 Hook입니다. useState는 상태값과 상태를 업데이트하는 함수를 반환하며...",
    tags: ["React", "JavaScript"],
  },
  {
    id: 2,
    prompt: "Python에서 리스트 컴프리헨션 사용법",
    snippet:
      "리스트 컴프리헨션은 Python에서 리스트를 간결하게 생성하는 방법입니다. 기본 문법은 [expression for item in iterable]이며, 조건문도 추가할 수 있습니다...",
    tags: ["Python", "General"],
  },
  {
    id: 3,
    prompt: "Next.js App Router와 Pages Router의 차이점",
    snippet:
      "App Router는 Next.js 13에서 도입된 새로운 라우팅 시스템으로, React Server Components를 기본으로 지원합니다. Pages Router는 기존의 파일 기반 라우팅 시스템이며...",
    tags: ["React", "Next.js"],
  },
  {
    id: 4,
    prompt: "머신러닝에서 오버피팅을 방지하는 방법",
    snippet:
      "오버피팅은 모델이 훈련 데이터에 과도하게 맞춰져 새로운 데이터에 대한 일반화 성능이 떨어지는 현상입니다. 이를 방지하기 위해서는 정규화, 드롭아웃, 교차 검증 등의 기법을 사용할 수 있습니다...",
    tags: ["Python", "AI"],
  },
  {
    id: 5,
    prompt: "CSS Grid와 Flexbox 언제 사용해야 할까요?",
    snippet:
      "CSS Grid는 2차원 레이아웃(행과 열)을 다룰 때 적합하고, Flexbox는 1차원 레이아웃(행 또는 열)을 다룰 때 적합합니다. Grid는 복잡한 레이아웃 구조를 만들 때...",
    tags: ["CSS", "General"],
  },
  {
    id: 6,
    prompt: "TypeScript 제네릭 사용법과 예제",
    snippet:
      "제네릭은 타입을 매개변수화하여 재사용 가능한 컴포넌트를 만드는 TypeScript의 기능입니다. function identity<T>(arg: T): T { return arg; } 와 같이 사용하며...",
    tags: ["TypeScript", "JavaScript"],
  },
]

const filterTags = ["All", "Python", "React", "General", "JavaScript", "CSS", "AI", "Next.js", "TypeScript"]

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">AI Prompt Lab</h1>
            </div>
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="/" className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Home
                </a>
                <a href="/library" className="bg-primary/80 px-3 py-2 rounded-md text-sm font-medium">
                  Library
                </a>
                <a href="#" className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  About
                </a>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Page Title */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-2">Saved AI Responses</h2>
            <p className="text-muted-foreground">Browse and search your saved prompts and responses</p>
          </div>

          {/* Search and Filter Section */}
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search saved prompts..."
                className="pl-10 border-2 focus:border-primary transition-colors"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-2">
              {filterTags.map((tag) => (
                <Button key={tag} variant={tag === "All" ? "default" : "outline"} size="sm" className="text-xs">
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedResponses.map((response) => (
              <Card
                key={response.id}
                className="shadow-md border-2 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-foreground line-clamp-2 leading-tight">
                    {response.prompt}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{response.snippet}</p>
                  <div className="flex flex-wrap gap-1">
                    {response.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
