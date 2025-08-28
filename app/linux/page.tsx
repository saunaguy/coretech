"use client"

import { useState } from "react"
import Link from "next/link"
import { Copy, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const linuxCommands = [
  {
    id: "ls",
    name: "ls",
    title: "ls - list directory contents",
    description:
      "Lists files and directories in the current directory. This is one of the most commonly used commands in Linux.",
    options: [
      { flag: "-l", description: "Use long listing format (shows permissions, owner, size, date)" },
      { flag: "-a", description: "Show all files including hidden files (starting with .)" },
      { flag: "-h", description: "Human readable file sizes (with -l)" },
      { flag: "-t", description: "Sort by modification time" },
    ],
    examples: [
      { command: "ls", description: "List files in current directory" },
      { command: "ls -la", description: "List all files with detailed information" },
      { command: "ls -lh /home", description: "List files in /home with human readable sizes" },
    ],
  },
  {
    id: "cd",
    name: "cd",
    title: "cd - change directory",
    description: "Changes the current working directory to the specified path.",
    options: [
      { flag: "~", description: "Go to home directory" },
      { flag: "..", description: "Go to parent directory" },
      { flag: "-", description: "Go to previous directory" },
    ],
    examples: [
      { command: "cd /home/user", description: "Change to /home/user directory" },
      { command: "cd ~", description: "Change to home directory" },
      { command: "cd ..", description: "Go up one directory level" },
    ],
  },
]

export default function LinuxPage() {
  const [activeCommand, setActiveCommand] = useState(linuxCommands[0])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-background">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Course Groups */}
        <section>
          <h2 className="text-xl font-semibold mb-4">학습 과정</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-md transition">
              <CardContent className="p-6 space-y-3">
                <div className="text-sm text-muted-foreground">Absolute Beginner</div>
                <Link href="/lessons/absolute-beginner" className="block font-semibold underline hover:no-underline">
                  왕초보 과정으로 이동
                </Link>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition">
              <CardContent className="p-6 space-y-3">
                <div className="text-sm text-muted-foreground">Beginner</div>
                <Link href="/lessons/beginner" className="block font-semibold underline hover:no-underline">
                  초급 과정으로 이동
                </Link>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition">
              <CardContent className="p-6 space-y-3">
                <div className="text-sm text-muted-foreground">Intermediate</div>
                <Link href="/lessons/intermediate" className="block font-semibold underline hover:no-underline">
                  중급 과정으로 이동
                </Link>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition">
              <CardContent className="p-6 space-y-3">
                <div className="text-sm text-muted-foreground">Advanced</div>
                <Link href="/lessons/advanced" className="block font-semibold underline hover:no-underline">
                  고급 과정으로 이동
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
        <div className="flex gap-8">
          <div className="w-64 flex-shrink-0">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="w-5 h-5" />
                  Linux Commands
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {linuxCommands.map((command) => (
                    <button
                      key={command.id}
                      onClick={() => setActiveCommand(command)}
                      className={`w-full text-left px-4 py-2 text-sm font-mono transition-colors ${
                        activeCommand.id === command.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                    >
                      {command.name}
                    </button>
                  ))}
                </nav>
                <div className="px-4 py-4 border-t mt-2 space-y-2">
                  <div className="text-xs text-muted-foreground">학습 자료</div>
                  <Button asChild size="sm" className="w-full">
                    <Link href="/lessons">Linux 강의 자료 보기</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/lessons/plan">커리큘럼(Plan) 보기</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-mono">{activeCommand.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">{activeCommand.description}</p>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Common Options</h3>
                  <div className="space-y-2">
                    {activeCommand.options.map((option, index) => (
                      <div key={index} className="flex gap-4">
                        <code className="bg-muted px-2 py-1 rounded text-sm font-mono min-w-12">{option.flag}</code>
                        <span className="text-sm text-muted-foreground">{option.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Usage Examples</h3>
                  <div className="space-y-4">
                    {activeCommand.examples.map((example, index) => (
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
