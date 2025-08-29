"use client"

import { useState } from "react"
import { Copy, Terminal, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const linuxTopics = {
  왕초보: {
    "기본 개념": [
      {
        id: "what-is-linux",
        name: "리눅스란?",
        title: "리눅스 운영체제 소개",
        description:
          "리눅스는 무료로 사용할 수 있는 오픈소스 운영체제입니다. 서버, 개발, 일반 사용자 모두에게 인기가 높습니다.",
        content: "리눅스의 역사와 특징, 다른 운영체제와의 차이점을 알아봅시다.",
      },
      {
        id: "terminal-basics",
        name: "터미널 기초",
        title: "터미널과 명령어 인터페이스",
        description:
          "터미널은 텍스트 기반으로 컴퓨터와 소통하는 방법입니다. GUI 대신 명령어를 입력해서 작업을 수행합니다.",
        content: "터미널 열기, 기본 사용법, 명령어 입력 방법을 배워봅시다.",
      },
    ],
    "파일 시스템": [
      {
        id: "pwd",
        name: "pwd",
        title: "pwd - 현재 위치 확인",
        description: "현재 작업 중인 디렉토리의 전체 경로를 보여줍니다.",
        options: [
          { flag: "-L", description: "논리적 현재 작업 디렉토리 출력" },
          { flag: "-P", description: "물리적 현재 작업 디렉토리 출력 (심볼릭 링크 해석)" },
        ],
        examples: [
          { command: "pwd", description: "현재 디렉토리 경로 보기" },
          { command: "pwd -P", description: "물리적 경로 보기 (심볼릭 링크 해석)" },
        ],
      },
      {
        id: "ls",
        name: "ls",
        title: "ls - 파일 목록 보기",
        description:
          "현재 디렉토리의 파일과 폴더 목록을 보여줍니다. 리눅스에서 가장 자주 사용하는 명령어 중 하나입니다.",
        options: [
          { flag: "-l", description: "자세한 정보 표시 (권한, 소유자, 크기, 날짜)" },
          { flag: "-a", description: "숨김 파일도 모두 표시 (.으로 시작하는 파일)" },
          { flag: "-h", description: "파일 크기를 읽기 쉽게 표시 (-l과 함께 사용)" },
          { flag: "-t", description: "수정 시간순으로 정렬" },
        ],
        examples: [
          { command: "ls", description: "현재 디렉토리의 파일 목록" },
          { command: "ls -la", description: "숨김 파일 포함 자세한 정보" },
          { command: "ls -lh /home", description: "/home 디렉토리의 파일을 읽기 쉬운 크기로" },
        ],
      },
      {
        id: "cd",
        name: "cd",
        title: "cd - 디렉토리 이동",
        description: "다른 디렉토리로 이동할 때 사용합니다.",
        options: [
          { flag: "~", description: "홈 디렉토리로 이동" },
          { flag: "..", description: "상위 디렉토리로 이동" },
          { flag: "-", description: "이전 디렉토리로 이동" },
        ],
        examples: [
          { command: "cd /home/user", description: "/home/user 디렉토리로 이동" },
          { command: "cd ~", description: "홈 디렉토리로 이동" },
          { command: "cd ..", description: "한 단계 위 디렉토리로 이동" },
        ],
      },
    ],
  },
  초보: {
    "파일 관리": [
      {
        id: "mkdir",
        name: "mkdir",
        title: "mkdir - 디렉토리 생성",
        description: "새로운 디렉토리(폴더)를 만들 때 사용합니다.",
        options: [
          { flag: "-p", description: "필요한 상위 디렉토리도 함께 생성" },
          { flag: "-m", description: "파일 권한 설정" },
          { flag: "-v", description: "생성된 디렉토리마다 메시지 출력" },
        ],
        examples: [
          { command: "mkdir newdir", description: '"newdir"라는 디렉토리 생성' },
          { command: "mkdir -p path/to/newdir", description: "중첩된 디렉토리 생성" },
          { command: "mkdir dir1 dir2 dir3", description: "여러 디렉토리 한번에 생성" },
        ],
      },
      {
        id: "cp",
        name: "cp",
        title: "cp - 파일 복사",
        description: "파일이나 디렉토리를 다른 위치로 복사합니다.",
        options: [
          { flag: "-r", description: "디렉토리를 재귀적으로 복사" },
          { flag: "-i", description: "덮어쓰기 전에 확인" },
          { flag: "-v", description: "복사 과정 상세히 출력" },
          { flag: "-p", description: "파일 속성 유지" },
        ],
        examples: [
          { command: "cp file1.txt file2.txt", description: "file1.txt를 file2.txt로 복사" },
          { command: "cp -r dir1/ dir2/", description: "디렉토리 전체 복사" },
          { command: "cp *.txt backup/", description: "모든 .txt 파일을 backup 디렉토리로 복사" },
        ],
      },
      {
        id: "rm",
        name: "rm",
        title: "rm - 파일 삭제",
        description: "파일이나 디렉토리를 삭제합니다. 주의해서 사용해야 하며, 삭제된 파일은 복구가 어렵습니다.",
        options: [
          { flag: "-r", description: "디렉토리와 내용을 재귀적으로 삭제" },
          { flag: "-f", description: "확인 없이 강제 삭제" },
          { flag: "-i", description: "삭제 전에 매번 확인" },
          { flag: "-v", description: "삭제 과정 설명" },
        ],
        examples: [
          { command: "rm file.txt", description: "단일 파일 삭제" },
          { command: "rm -rf directory/", description: "디렉토리와 모든 내용 삭제" },
          { command: "rm -i *.txt", description: "모든 .txt 파일을 확인 후 삭제" },
        ],
      },
    ],
    "텍스트 처리": [
      {
        id: "cat",
        name: "cat",
        title: "cat - 파일 내용 보기",
        description: "파일의 내용을 터미널에 출력합니다.",
        options: [
          { flag: "-n", description: "줄 번호 표시" },
          { flag: "-b", description: "비어있지 않은 줄에만 번호 표시" },
          { flag: "-s", description: "연속된 빈 줄을 하나로 압축" },
        ],
        examples: [
          { command: "cat file.txt", description: "파일 내용 출력" },
          { command: "cat -n file.txt", description: "줄 번호와 함께 출력" },
          { command: "cat file1.txt file2.txt", description: "여러 파일 내용 연결해서 출력" },
        ],
      },
    ],
  },
  중급: {
    "시스템 관리": [
      {
        id: "ps",
        name: "ps",
        title: "ps - 프로세스 확인",
        description: "현재 실행 중인 프로세스들을 확인합니다.",
        options: [
          { flag: "aux", description: "모든 프로세스를 자세히 표시" },
          { flag: "-ef", description: "모든 프로세스를 전체 형식으로 표시" },
          { flag: "-u", description: "특정 사용자의 프로세스만 표시" },
        ],
        examples: [
          { command: "ps", description: "현재 터미널의 프로세스 표시" },
          { command: "ps aux", description: "모든 프로세스 자세히 보기" },
          { command: "ps -u username", description: "특정 사용자의 프로세스만 보기" },
        ],
      },
    ],
  },
}

export default function LinuxPage() {
  const [activeItem, setActiveItem] = useState(linuxTopics["왕초보"]["기본 개념"][0])
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    왕초보: true,
    "기본 개념": true,
  })

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const toggleSection = (sectionKey: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }))
  }

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
                  AI Lab
                </a>
                <a href="/linux" className="bg-primary/80 px-3 py-2 rounded-md text-sm font-medium">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-80 flex-shrink-0">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="w-5 h-5" />
                  Linux 학습 목차
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {Object.entries(linuxTopics).map(([level, categories]) => (
                    <div key={level}>
                      {/* Level Header */}
                      <button
                        onClick={() => toggleSection(level)}
                        className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-sm bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <span className="text-primary">{level}</span>
                        {expandedSections[level] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>

                      {/* Categories */}
                      {expandedSections[level] && (
                        <div className="space-y-1">
                          {Object.entries(categories).map(([category, items]) => (
                            <div key={category}>
                              {/* Category Header */}
                              <button
                                onClick={() => toggleSection(`${level}-${category}`)}
                                className="w-full flex items-center justify-between px-6 py-2 text-left text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                              >
                                <span>{category}</span>
                                {expandedSections[`${level}-${category}`] ? (
                                  <ChevronDown className="w-3 h-3" />
                                ) : (
                                  <ChevronRight className="w-3 h-3" />
                                )}
                              </button>

                              {/* Items */}
                              {expandedSections[`${level}-${category}`] && (
                                <div className="space-y-1">
                                  {items.map((item) => (
                                    <button
                                      key={item.id}
                                      onClick={() => setActiveItem(item)}
                                      className={`w-full text-left px-8 py-2 text-sm font-mono transition-colors ${
                                        activeItem.id === item.id
                                          ? "bg-primary text-primary-foreground"
                                          : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                                      }`}
                                    >
                                      {item.name}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-mono">{activeItem.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Description */}
                <p className="text-muted-foreground leading-relaxed">{activeItem.description}</p>

                {activeItem.options && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">주요 옵션</h3>
                    <div className="space-y-2">
                      {activeItem.options.map((option, index) => (
                        <div key={index} className="flex gap-4">
                          <code className="bg-muted px-2 py-1 rounded text-sm font-mono min-w-12">{option.flag}</code>
                          <span className="text-sm text-muted-foreground">{option.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeItem.examples && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">사용 예제</h3>
                    <div className="space-y-4">
                      {activeItem.examples.map((example, index) => (
                        <div key={index} className="space-y-2">
                          <p className="text-sm text-muted-foreground">{example.description}</p>
                          <div className="relative">
                            <pre className="bg-slate-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                              <span className="text-slate-400">$ </span>
                              {example.command}
                            </pre>
                            <Button
                              size="sm"
                              variant="outline"
                              className="absolute top-2 right-2 h-8 w-8 p-0 bg-transparent"
                              onClick={() => copyToClipboard(example.command)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeItem.content && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">학습 내용</h3>
                    <p className="text-muted-foreground leading-relaxed">{activeItem.content}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
