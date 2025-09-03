import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const savedCommands = [
  {
    id: 1,
    command: "사용자 권한 관리 및 sudo 설정",
    snippet:
      "리눅스에서 사용자 권한을 관리하고 sudo 권한을 부여하는 방법입니다. usermod -aG sudo username 명령어로 사용자를 sudo 그룹에 추가하고...",
    tags: ["Linux", "Security"],
  },
  {
    id: 2,
    command: "Apache 웹서버 설치 및 설정",
    snippet:
      "Ubuntu에서 Apache 웹서버를 설치하고 기본 설정하는 방법입니다. apt update && apt install apache2 명령어로 설치하고, systemctl을 사용해 서비스를 관리합니다...",
    tags: ["Server", "Apache"],
  },
  {
    id: 3,
    command: "MySQL 데이터베이스 백업 스크립트",
    snippet:
      "mysqldump를 사용한 자동 백업 스크립트입니다. cron과 함께 사용하여 정기적으로 데이터베이스를 백업할 수 있습니다. mysqldump -u root -p database_name > backup.sql...",
    tags: ["Database", "MySQL"],
  },
  {
    id: 4,
    command: "네트워크 포트 스캔 및 방화벽 설정",
    snippet:
      "nmap을 사용한 포트 스캔과 ufw를 사용한 방화벽 설정 방법입니다. 보안을 위해 필요한 포트만 열고 불필요한 서비스는 차단하는 방법을 다룹니다...",
    tags: ["Network", "Security"],
  },
  {
    id: 5,
    command: "Docker 컨테이너 관리 명령어",
    snippet:
      "Docker 컨테이너의 생성, 실행, 중지, 삭제 등 기본적인 관리 명령어들입니다. docker run, docker ps, docker stop, docker rm 등의 명령어 사용법을 설명합니다...",
    tags: ["Docker", "Container"],
  },
  {
    id: 6,
    command: "시스템 모니터링 및 로그 분석",
    snippet:
      "top, htop, iostat 등을 사용한 시스템 리소스 모니터링과 /var/log 디렉토리의 로그 파일 분석 방법입니다. 시스템 성능 문제를 진단하고 해결하는 방법을 다룹니다...",
    tags: ["Monitoring", "Linux"],
  },
]

const filterTags = [
  "All",
  "Linux",
  "Server",
  "Network",
  "Security",
  "Docker",
  "Database",
  "Apache",
  "MySQL",
  "Container",
  "Monitoring",
]

export default function LibraryPage() {
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
                <a href="/library" className="bg-primary/80 px-3 py-2 rounded-md text-sm font-medium">
                  라이브러리
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
          {/* Page Title */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-2">저장된 명령어 & 스크립트</h2>
            <p className="text-muted-foreground">저장된 리눅스 명령어와 서버 관리 스크립트를 검색하고 관리하세요</p>
          </div>

          {/* Search and Filter Section */}
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="명령어 및 스크립트 검색..."
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
            {savedCommands.map((item) => (
              <Card
                key={item.id}
                className="shadow-md border-2 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-foreground line-clamp-2 leading-tight">
                    {item.command}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{item.snippet}</p>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
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
