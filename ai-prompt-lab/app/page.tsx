import { Sparkles, Bookmark, BookOpen, MessageSquare, Terminal, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export default function HomePage() {
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
                <a href="/" className="bg-primary/80 px-3 py-2 rounded-md text-sm font-medium">
                  AI Lab
                </a>
                <a
                  href="/linux"
                  className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Linux 기초
                </a>
                <a
                  href="/board"
                  className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  게시판
                </a>
                <a
                  href="/qna"
                  className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Q&A
                </a>
                <a
                  href="/about"
                  className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  소개
                </a>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground text-balance">AI와 함께하는 개발 학습 플랫폼</h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
              AI 프롬프트 실험부터 Linux 기초 학습, 개발자 커뮤니티까지 - 모든 개발 학습을 한 곳에서 경험하세요
            </p>
          </div>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto group-hover:bg-blue-200 transition-colors">
                  <Terminal className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Linux 기초</h3>
                  <p className="text-sm text-muted-foreground">기본 명령어부터 차근차근</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto group-hover:bg-green-200 transition-colors">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">자유 게시판</h3>
                  <p className="text-sm text-muted-foreground">개발 이야기를 나누세요</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto group-hover:bg-purple-200 transition-colors">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Q&A</h3>
                  <p className="text-sm text-muted-foreground">궁금한 것을 질문하세요</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto group-hover:bg-orange-200 transition-colors">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">커뮤니티</h3>
                  <p className="text-sm text-muted-foreground">함께 성장하는 개발자들</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Lab Section */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">AI Lab</h2>
              <p className="text-muted-foreground">다양한 AI 모델의 응답을 비교해보세요</p>
            </div>

            {/* Input Section */}
            <div className="space-y-4">
              <Textarea
                placeholder="궁금한 것을 AI에게 물어보세요..."
                className="min-h-32 text-base resize-none border-2 focus:border-primary transition-colors"
              />
              <div className="flex justify-center">
                <Button
                  size="lg"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Response
                </Button>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gemini Response Card */}
              <Card className="shadow-md border-2 hover:shadow-lg transition-shadow">
                <CardHeader className="bg-primary/5 border-b">
                  <CardTitle className="text-primary text-lg font-semibold">Gemini's Response</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <pre className="bg-muted p-4 rounded-lg text-sm font-mono whitespace-pre-wrap overflow-x-auto min-h-32 text-muted-foreground">
                      {/* Response content will appear here */}
                      Waiting for response...
                    </pre>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" className="text-xs bg-transparent">
                        <Bookmark className="w-4 h-4 mr-1" />
                        Save to Library
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* GPT Response Card */}
              <Card className="shadow-md border-2 hover:shadow-lg transition-shadow">
                <CardHeader className="bg-primary/5 border-b">
                  <CardTitle className="text-primary text-lg font-semibold">GPT's Response</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <pre className="bg-muted p-4 rounded-lg text-sm font-mono whitespace-pre-wrap overflow-x-auto min-h-32 text-muted-foreground">
                      {/* Response content will appear here */}
                      Waiting for response...
                    </pre>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" className="text-xs bg-transparent">
                        <Bookmark className="w-4 h-4 mr-1" />
                        Save to Library
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
