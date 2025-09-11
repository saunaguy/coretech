"use client"

import { useState, useMemo } from "react"
import { ChevronDown, ChevronRight, Search, Terminal, Folder, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const LinuxSidebar = ({ topics, onCommandSelect }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [openCategories, setOpenCategories] = useState(() => {
    const acc = {} as Record<string, boolean>
    Object.values(topics || {}).forEach((categories: any) => {
      Object.keys(categories || {}).forEach((cat) => {
        acc[cat] = false // 기본은 닫힘
      })
    })
    return acc
  })

  const [openLevels, setOpenLevels] = useState(() => {
    const acc = {} as Record<string, boolean>
    Object.keys(topics || {}).forEach((level) => {
      acc[level] = false // 기본은 닫힘
    })
    return acc
  })

  const filteredTopics = useMemo(() => {
    if (!searchTerm) {
      return topics
    }
    const lowercasedFilter = searchTerm.toLowerCase()
    const filtered = {}

    for (const level in topics) {
      const categories = topics[level]
      const filteredCategories = {}
      for (const category in categories) {
        const commands = categories[category]
        const filteredCommands = commands.filter(
          (command) =>
            command.name.toLowerCase().includes(lowercasedFilter) ||
            command.title.toLowerCase().includes(lowercasedFilter) ||
            command.description.toLowerCase().includes(lowercasedFilter),
        )
        if (filteredCommands.length > 0) {
          filteredCategories[category] = filteredCommands
        }
      }
      if (Object.keys(filteredCategories).length > 0) {
        filtered[level] = filteredCategories
      }
    }
    return filtered
  }, [searchTerm, topics])

  const toggleCategory = (category) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const toggleLevel = (level) => {
    setOpenLevels((prev) => ({
      ...prev,
      [level]: !prev[level],
    }))
  }

  return (
    <nav className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="명령어 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-background border-sidebar-border focus:ring-sidebar-ring"
        />
      </div>

      <div className="space-y-3">
        {Object.entries(filteredTopics).map(([level, categories]) => (
          <div key={level} className="space-y-2">
            <button
              onClick={() => toggleLevel(level)}
              className="w-full flex items-center justify-between py-3 px-3 rounded-lg hover:bg-sidebar-accent/10 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-sidebar-primary/10 rounded-lg flex items-center justify-center">
                  <Folder className="w-4 h-4 text-sidebar-primary" />
                </div>
                <span className="font-semibold text-base text-sidebar-foreground group-hover:text-sidebar-primary transition-colors">
                  {level}
                </span>
              </div>
              <div className="text-sidebar-primary">
                {openLevels[level] || searchTerm ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </button>

            {(openLevels[level] || searchTerm) && (
              <div className="ml-4 space-y-2 border-l-2 border-sidebar-border/50 pl-4">
                {Object.entries(categories).map(([category, commands]) => (
                  <div key={category} className="space-y-1">
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full flex items-center justify-between py-2 px-3 rounded-md hover:bg-sidebar-accent/10 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-sidebar-primary/70" />
                        <span className="font-medium text-sm text-sidebar-foreground group-hover:text-sidebar-primary transition-colors">
                          {category}
                        </span>
                        <Badge
                          variant="secondary"
                          className="text-xs bg-sidebar-primary/10 text-sidebar-primary border-sidebar-primary/20"
                        >
                          {commands.length}
                        </Badge>
                      </div>
                      <div className="text-sidebar-primary/70">
                        {openCategories[category] || searchTerm ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                      </div>
                    </button>

                    {(openCategories[category] || searchTerm) && (
                      <div className="ml-6 space-y-1 border-l border-sidebar-border/30 pl-3">
                        {commands.map((command) => (
                          <button
                            key={command.id}
                            onClick={() => onCommandSelect(command)}
                            className="w-full text-left flex items-center gap-2 py-2 px-3 rounded-md text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/10 transition-all duration-200 group"
                          >
                            <Terminal className="w-3 h-3 text-sidebar-primary/60 group-hover:text-sidebar-primary transition-colors" />
                            <span className="text-sm font-mono group-hover:font-medium transition-all">
                              {command.name}
                            </span>
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
      </div>

      {Object.keys(filteredTopics).length === 0 && searchTerm && (
        <div className="text-center py-8 space-y-2">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Search className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">"{searchTerm}"에 대한 검색 결과가 없습니다.</p>
        </div>
      )}
    </nav>
  )
}

export default LinuxSidebar
