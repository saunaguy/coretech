import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DailyList from "@/components/site/DailyList"
import MarkdownArticle from "@/components/lesson/MarkdownArticle"
import { renderMarkdownWithToc, type TocItem } from "@/lib/markdown"
import { Button } from "@/components/ui/button"
import { promises as fs } from "fs"
import path from "path"
import LinuxSidebar from "@/components/linux/LinuxSidebar"

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
        description: "터미널은 텍스트 기반으로 컴퓨터와 소통하는 방법입니다. GUI 대신 명령어를 입력해서 작업을 수행합니다.",
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
          { command: "mkdir newdir", description: "'newdir'라는 디렉토리 생성" },
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

async function fetchDaily(): Promise<any[]> {
  const base = process.env.INTERNAL_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
  try {
    const r = await fetch(`${base}/api/v1/daily/tests`, { next: { revalidate: 30 } })
    if (!r.ok) return []
    return r.json()
  } catch {
    return []
  }
}

async function loadIntro(): Promise<{ html: string; toc: TocItem[] }> {
  const base = path.join(process.cwd(), "content", "lessons", "linux")
  const candidates = [
    path.join(base, "absolute-beginner"),
    path.join(base, "beginner"),
    base,
  ]
  for (const dir of candidates) {
    try {
      const list = (await fs.readdir(dir)).filter((f) => f.toLowerCase().endsWith(".md")).sort()
      if (list.length > 0) {
        const md = await fs.readFile(path.join(dir, list[0]), "utf-8")
        const { html, toc } = await renderMarkdownWithToc(md)
        return { html, toc }
      }
    } catch {}
  }
  return { html: "", toc: [] }
}

type LinuxGroup = { slug: string; title: string; path?: string }
async function loadLinuxGroups(): Promise<LinuxGroup[]> {
  try {
    const p = path.join(process.cwd(), "content", "lessons", "linux", "index.json")
    const raw = await fs.readFile(p, "utf-8")
    const j = JSON.parse(raw)
    return (j.groups || []) as LinuxGroup[]
  } catch {
    return [
      { slug: "absolute-beginner", title: "왕초보" },
      { slug: "beginner", title: "초급" },
      { slug: "intermediate", title: "중급" },
      { slug: "advanced", title: "고급" },
    ]
  }
}

function resolveGroupDir(g: LinuxGroup) {
  const raw = g.path || path.join("content", "lessons", g.slug)
  const trimmed = raw.replace(/^\/+/, "")
  return path.join(process.cwd(), trimmed)
}

async function countGroupLessons(g: LinuxGroup): Promise<number> {
  const dir = resolveGroupDir(g)
  try {
    const items = await fs.readdir(dir)
    return items.filter((f) => f.toLowerCase().endsWith(".md")).length
  } catch {
    return 0
  }
}

export default async function LinuxPage() {
  const [daily, intro, groups] = await Promise.all([fetchDaily(), loadIntro(), loadLinuxGroups()])
  const counts = await Promise.all(groups.map((g) => countGroupLessons(g)))
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <section className="rounded-2xl border bg-gradient-to-br from-primary/10 to-accent/10 p-8 md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold">Linux 기초</h1>
              <p className="text-muted-foreground max-w-2xl">
                기본 개념부터 파일/권한/프로세스/서비스까지. 실습과 데일리 테스트로 차근차근 익혀보세요.
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild size="sm">
                <Link href="/lessons">강의자료</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/daily?category=linux">데일리 테스트</Link>
              </Button>
            </div>
          </div>
        </section>

        <div className="flex flex-row gap-8">
          <aside className="w-1/4 hidden lg:block">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>명령어 목록</CardTitle>
              </CardHeader>
              <CardContent>
                <LinuxSidebar topics={linuxTopics} />
              </CardContent>
            </Card>
          </aside>

          <main className="w-full lg:w-3/4 space-y-10">
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-12 space-y-6">
                {intro.html && (
                  <Card>
                    <CardHeader>
                      <CardTitle>리눅스 기초 — 소개</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <MarkdownArticle html={intro.html} />
                    </CardContent>
                  </Card>
                )}
                <Card>
                  <CardHeader>
                    <CardTitle>데일리 테스트 미리보기</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DailyList items={daily} />
                  </CardContent>
                </Card>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}
