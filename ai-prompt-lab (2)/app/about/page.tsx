import { Github, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  const technologies = [
    { name: "Linux", icon: "🐧" },
    { name: "Docker", icon: "🐳" },
    { name: "Nginx", icon: "🌐" },
    { name: "MySQL", icon: "🗄️" },
  ]

  const teamMembers = [
    {
      name: "Alex Chen",
      role: "Linux System Admin",
      github: "alexchen",
      avatar: "/professional-developer-avatar.png",
    },
    {
      name: "Sarah Kim",
      role: "DevOps Engineer",
      github: "sarahkim",
      avatar: "/ai-engineer-avatar.png",
    },
    {
      name: "Mike Johnson",
      role: "Network Engineer",
      github: "mikejohnson",
      avatar: "/diverse-designer-avatars.png",
    },
    {
      name: "Lisa Wang",
      role: "Server Architect",
      github: "lisawang",
      avatar: "/product-manager-avatar.png",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Linux & Server Lab</h1>
            </div>
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="/" className="hover:bg-primary/80 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  홈
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
                <a href="/about" className="bg-primary/80 px-3 py-2 rounded-md text-sm font-medium">
                  소개
                </a>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-16">
          {/* About Section */}
          <section className="space-y-6">
            <h1 className="text-4xl font-bold text-foreground text-balance">Linux & Server Lab 소개</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed text-pretty">
              Linux & Server Lab은 리눅스 시스템 관리, 서버 운영, 네트워크 구성을 체계적으로 학습할 수 있는 전문
              플랫폼입니다. 초보자부터 전문가까지 단계별 학습 과정을 통해 실무에 필요한 시스템 엔지니어링 역량을 기를 수
              있도록 돕습니다. 실습 중심의 튜토리얼과 활발한 커뮤니티를 통해 현업에서 바로 활용 가능한 지식을
              제공합니다.
            </p>
          </section>

          {/* Technology Stack Section */}
          <section className="space-y-8">
            <h2 className="text-3xl font-semibold text-foreground">주요 기술 스택</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              {technologies.map((tech) => (
                <Card key={tech.name} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-0 space-y-3">
                    <div className="text-4xl">{tech.icon}</div>
                    <h3 className="font-medium text-foreground">{tech.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Team Section */}
          <section className="space-y-8">
            <h2 className="text-3xl font-semibold text-foreground">운영진</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member) => (
                <Card
                  key={member.name}
                  className="p-6 text-center hover:scale-105 transition-transform duration-200 hover:shadow-lg"
                >
                  <CardContent className="p-0 space-y-4">
                    <img
                      src={member.avatar || "/placeholder.svg"}
                      alt={`${member.name} avatar`}
                      className="w-20 h-20 rounded-full mx-auto object-cover"
                    />
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                      <a
                        href={`https://github.com/${member.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <Github className="w-4 h-4" />
                        GitHub
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
