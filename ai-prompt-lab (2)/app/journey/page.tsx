import { Trophy, Star, Lock, CheckCircle, Circle, Target, Zap, Code, Database, Globe } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function JourneyPage() {
  const journeySteps = [
    {
      id: 1,
      title: "웹 개발 입문",
      level: "Lv.1",
      status: "completed",
      progress: 100,
      skills: ["HTML", "CSS", "JavaScript 기초"],
      description: "웹 개발의 기초를 다지는 첫 걸음",
      icon: Globe,
      color: "bg-green-500",
      xp: 500,
    },
    {
      id: 2,
      title: "프론트엔드 마스터",
      level: "Lv.2",
      status: "in-progress",
      progress: 65,
      skills: ["React", "TypeScript", "Tailwind CSS"],
      description: "사용자 인터페이스 구축의 달인이 되어보세요",
      icon: Code,
      color: "bg-blue-500",
      xp: 750,
    },
    {
      id: 3,
      title: "백엔드 개발자",
      level: "Lv.3",
      status: "locked",
      progress: 0,
      skills: ["Node.js", "Express", "API 설계"],
      description: "서버 사이드 로직을 구현하는 전문가",
      icon: Database,
      color: "bg-purple-500",
      xp: 1000,
    },
    {
      id: 4,
      title: "풀스택 엔지니어",
      level: "Lv.4",
      status: "locked",
      progress: 0,
      skills: ["Next.js", "PostgreSQL", "배포"],
      description: "프론트엔드와 백엔드를 모두 다루는 올라운더",
      icon: Zap,
      color: "bg-orange-500",
      xp: 1500,
    },
    {
      id: 5,
      title: "시니어 개발자",
      level: "Lv.5",
      status: "locked",
      progress: 0,
      skills: ["아키텍처 설계", "팀 리딩", "멘토링"],
      description: "기술적 리더십을 발휘하는 최고 레벨",
      icon: Trophy,
      color: "bg-yellow-500",
      xp: 2000,
    },
  ]

  const totalXP = journeySteps.reduce(
    (sum, step) =>
      sum +
      (step.status === "completed"
        ? step.xp
        : step.status === "in-progress"
          ? Math.floor((step.xp * step.progress) / 100)
          : 0),
    0,
  )
  const maxXP = journeySteps.reduce((sum, step) => sum + step.xp, 0)

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
                <a href="/journey" className="bg-primary/80 px-3 py-2 rounded-md text-sm font-medium">
                  개발자 여정
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground text-balance">개발자 성장 여정</h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
              게임처럼 재미있게! 단계별로 성장하는 개발자가 되어보세요
            </p>
          </div>

          {/* Progress Overview */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">전체 진행률</h3>
                    <p className="text-sm text-muted-foreground">현재 레벨: 프론트엔드 마스터</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{totalXP} XP</div>
                  <div className="text-sm text-muted-foreground">/ {maxXP} XP</div>
                </div>
              </div>
              <Progress value={(totalXP / maxXP) * 100} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>시작</span>
                <span>{Math.round((totalXP / maxXP) * 100)}% 완료</span>
                <span>시니어 개발자</span>
              </div>
            </CardContent>
          </Card>

          {/* Journey Steps */}
          <div className="space-y-6">
            {journeySteps.map((step, index) => {
              const Icon = step.icon
              const isLocked = step.status === "locked"
              const isCompleted = step.status === "completed"
              const isInProgress = step.status === "in-progress"

              return (
                <div key={step.id} className="relative">
                  {/* Connection Line */}
                  {index < journeySteps.length - 1 && (
                    <div className="absolute left-6 top-20 w-0.5 h-16 bg-border z-0" />
                  )}

                  <Card
                    className={`relative z-10 transition-all duration-300 ${
                      isLocked ? "opacity-60 grayscale" : "hover:shadow-lg hover:scale-[1.02]"
                    } ${isInProgress ? "ring-2 ring-blue-500 ring-opacity-50" : ""}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Level Icon */}
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            isLocked ? "bg-gray-300" : step.color
                          } relative`}
                        >
                          {isLocked ? (
                            <Lock className="w-6 h-6 text-white" />
                          ) : isCompleted ? (
                            <CheckCircle className="w-6 h-6 text-white" />
                          ) : (
                            <Icon className="w-6 h-6 text-white" />
                          )}

                          {/* Level Badge */}
                          <Badge variant="secondary" className="absolute -top-2 -right-2 text-xs px-1.5 py-0.5">
                            {step.level}
                          </Badge>
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm font-medium">{step.xp} XP</span>
                            </div>
                          </div>

                          <p className="text-muted-foreground">{step.description}</p>

                          {/* Skills */}
                          <div className="flex flex-wrap gap-2">
                            {step.skills.map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>

                          {/* Progress Bar */}
                          {!isLocked && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">진행률</span>
                                <span className="font-medium">{step.progress}%</span>
                              </div>
                              <Progress value={step.progress} className="h-2" />
                            </div>
                          )}

                          {/* Status */}
                          <div className="flex items-center gap-2 pt-2">
                            {isCompleted && (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">완료</Badge>
                            )}
                            {isInProgress && (
                              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">진행 중</Badge>
                            )}
                            {isLocked && <Badge variant="secondary">잠금</Badge>}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>

          {/* Achievement Section */}
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                달성한 업적
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">첫 걸음</div>
                    <div className="text-sm text-muted-foreground">웹 개발 입문 완료</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white rounded-lg opacity-60">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Circle className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <div className="font-medium">코드 마스터</div>
                    <div className="text-sm text-muted-foreground">100개 문제 해결</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white rounded-lg opacity-60">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Circle className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <div className="font-medium">멘토</div>
                    <div className="text-sm text-muted-foreground">10명 도움</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
