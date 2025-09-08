'use client'

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import LinuxSidebar from "@/components/linux/LinuxSidebar"
import { linuxTopics } from "@/lib/linux-data"

const CommandDetailView = ({ command }) => {
  if (!command) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>왼쪽 메뉴에서 학습할 명령어를 선택하세요.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{command.title}</CardTitle>
          <CardDescription className="text-lg">{command.description}</CardDescription>
        </CardHeader>
        {command.content && (
            <CardContent>
                <p className="text-muted-foreground">{command.content}</p>
            </CardContent>
        )}
      </Card>

      {command.options && command.options.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>주요 옵션</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {command.options.map((opt, index) => (
                <li key={index} className="flex items-start gap-4">
                  <Badge variant="secondary" className="text-base font-mono">{opt.flag}</Badge>
                  <span className="text-muted-foreground">{opt.description}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {command.examples && command.examples.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>사용 예시</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {command.examples.map((ex, index) => (
                <div key={index} className="p-4 bg-muted rounded-lg">
                  <p className="font-mono text-sm text-foreground">{ex.command}</p>
                  <p className="text-sm text-muted-foreground mt-1">{ex.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function LinuxPage() {
  const [selectedCommand, setSelectedCommand] = useState(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-row gap-8">
          <aside className="w-1/4 hidden lg:block">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>명령어 목록</CardTitle>
              </CardHeader>
              <CardContent>
                <LinuxSidebar topics={linuxTopics} onCommandSelect={setSelectedCommand} />
              </CardContent>
            </Card>
          </aside>

          <main className="w-full lg:w-3/4">
            <CommandDetailView command={selectedCommand} />
          </main>
        </div>
      </div>
    </div>
  )
}
