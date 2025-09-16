"use client"

import { useState, useMemo, useEffect } from "react"
import { ChevronDown, ChevronRight, Search, Terminal, Folder, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { loadLinuxContent } from "@/content/linux/loader"

const LinuxSidebar = ({ topics, onCommandSelect }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [rawTerm, setRawTerm] = useState("")
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

  // build optional content index once when enabled
  const [includeContent, setIncludeContent] = useState(false)
  const [buildingIndex, setBuildingIndex] = useState(false)
  const [contentIndex, setContentIndex] = useState<Record<string, string>>({})

  useEffect(() => {
    const build = async () => {
      if (!includeContent || buildingIndex) return
      setBuildingIndex(true)
      try {
        const flatten: any[] = []
        for (const level in topics) {
          const cats = topics[level] || {}
          for (const category in cats) {
            const cmds = cats[category] || []
            for (const cmd of cmds) flatten.push(cmd)
          }
        }
        const entries = await Promise.all(flatten.map(async (cmd) => {
          try {
            const key = cmd.loaderKey
            if (!key) return [cmd.id, ''] as const
            const mod = await loadLinuxContent(String(key))
            const blocks = (mod as any).default || []
            const text = blocks.map((b: any) => {
              if (!b) return ''
              if (typeof b === 'string') return b
              if (b.type === 'heading' || b.type === 'paragraph' || b.type === 'quote' || b.type === 'aside' || b.type === 'callout') return b.text || ''
              if (b.type === 'list') return (b.items || []).join(' ')
              if (b.type === 'code') return b.text || ''
              return ''
            }).join(' ')
            return [cmd.id, String(text).toLowerCase()] as const
          } catch {
            return [cmd.id, ''] as const
          }
        }))
        const idx: Record<string, string> = {}
        for (const [id, text] of entries) idx[String(id)] = text
        setContentIndex(idx)
      } finally {
        setBuildingIndex(false)
      }
    }
    build()
  }, [includeContent, topics])

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
        const filteredCommands = commands.filter((command) => {
          const baseMatch =
            (command.name || '').toLowerCase().includes(lowercasedFilter) ||
            (command.title || '').toLowerCase().includes(lowercasedFilter) ||
            (command.description || '').toLowerCase().includes(lowercasedFilter)
          if (baseMatch) return true
          if (includeContent && contentIndex && contentIndex[command.id]) {
            return contentIndex[command.id].includes(lowercasedFilter)
          }
          return false
        })
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

  // Debounce search input updates for smoother UX
  useEffect(() => {
    const id = setTimeout(() => setSearchTerm(rawTerm), 250)
    return () => clearTimeout(id)
  }, [rawTerm])

  return (
    <nav className="space-y-6">
      <div className="relative group">
        <span className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center">
          <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-sidebar-primary/80 transition-colors" />
        </span>
        <Input
          placeholder="명령어 검색..."
          aria-label="명령어 검색"
          value={rawTerm}
          onChange={(e) => setRawTerm(e.target.value)}
          className="pl-9 bg-background border-sidebar-border focus:ring-sidebar-ring"
        />
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="h-3.5 w-3.5 rounded border-sidebar-border"
              checked={includeContent}
              onChange={(e) => setIncludeContent(e.target.checked)}
            />
            <span>내용 포함 검색 {includeContent && buildingIndex ? '(인덱싱 중...)' : ''}</span>
          </label>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(filteredTopics).map(([level, categories]) => (
          <div key={level} className="space-y-2">
            <button
              onClick={() => toggleLevel(level)}
              className="w-full flex items-center justify-between py-3 px-3 rounded-lg hover:bg-sidebar-accent/10 transition-all duration-200 group min-w-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 bg-sidebar-primary/10 rounded-lg flex items-center justify-center">
                  <Folder className="w-4 h-4 text-sidebar-primary" />
                </div>
                <span className="font-semibold text-base text-sidebar-foreground group-hover:text-sidebar-primary transition-colors truncate">
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
              <div className="ml-3 space-y-2 border-l-2 border-sidebar-border/50 pl-3">
                {Object.entries(categories).map(([category, commands]) => (
                  <div key={category} className="space-y-1">
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full flex items-center justify-between py-2 px-3 rounded-md hover:bg-sidebar-accent/10 transition-all duration-200 group min-w-0"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-sidebar-primary/70 shrink-0" />
                        <span className="font-medium text-sm text-sidebar-foreground group-hover:text-sidebar-primary transition-colors truncate">
                          {category}
                        </span>
                        <Badge
                          variant="secondary"
                          className="text-xs bg-sidebar-primary/10 text-sidebar-primary border-sidebar-primary/20 shrink-0"
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
                      <div className="ml-4 space-y-1 border-l border-sidebar-border/30 pl-2">
                        {commands.map((command, index) => (
                          <button
                            key={command.id}
                            onClick={() => onCommandSelect(command)}
                            className="w-full text-left flex items-center gap-2 py-2 px-3 rounded-md text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/10 transition-all duration-200 group min-w-0"
                          >
                            <Terminal className="w-3 h-3 text-sidebar-primary/60 group-hover:text-sidebar-primary transition-colors shrink-0" />
                            <span
                              className="text-sm font-mono group-hover:font-medium transition-all truncate"
                              title={command.title || command.name}
                            >
                              {`${index + 1}. ${(command.title || command.name || '')
                                // Remove leading codes like "1-1 "
                                .replace(/^\s*\d+(?:-\d+)?\s*/, '')
                                // Remove bullet separators like "· " or "- " or ": " immediately after
                                .replace(/^[·•\-:\|]\s*/, '')
                                // Remove an extra leading enumerator like "1. "
                                .replace(/^\d+\.\s*/, '')
                                .trim()
                              }`}
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
