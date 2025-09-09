'use client'

import { useState, useMemo } from "react"
import Link from "next/link"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"

const LinuxSidebar = ({ topics, onCommandSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openCategories, setOpenCategories] = useState(() => {
    const acc = {} as Record<string, boolean>;
    Object.values(topics || {}).forEach((categories: any) => {
      Object.keys(categories || {}).forEach((cat) => {
        acc[cat] = true;
      });
    });
    return acc;
  });

  const [openLevels, setOpenLevels] = useState(() => {
    const acc = {} as Record<string, boolean>;
    Object.keys(topics || {}).forEach((level) => {
      acc[level] = true;
    });
    return acc;
  });

  const filteredTopics = useMemo(() => {
    if (!searchTerm) {
      return topics;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = {};

    for (const level in topics) {
      const categories = topics[level];
      const filteredCategories = {};
      for (const category in categories) {
        const commands = categories[category];
        const filteredCommands = commands.filter(
          (command) =>
            command.name.toLowerCase().includes(lowercasedFilter) ||
            command.title.toLowerCase().includes(lowercasedFilter) ||
            command.description.toLowerCase().includes(lowercasedFilter)
        );
        if (filteredCommands.length > 0) {
          filteredCategories[category] = filteredCommands;
        }
      }
      if (Object.keys(filteredCategories).length > 0) {
        filtered[level] = filteredCategories;
      }
    }
    return filtered;
  }, [searchTerm, topics]);

  const toggleCategory = (category) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleLevel = (level) => {
    setOpenLevels(prev => ({
      ...prev,
      [level]: !prev[level]
    }));
  }

  return (
    <nav className="space-y-4 text-sm">
        <div className="px-2">
            <Input
                placeholder="명령어 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      {Object.entries(filteredTopics).map(([level, categories]) => (
        <div key={level} className="space-y-1">
          <button
            onClick={() => toggleLevel(level)}
            className="w-full flex items-center justify-between py-2 px-2 rounded-md hover:bg-accent transition-colors"
          >
            <span className="font-semibold text-base">{level}</span>
            {openLevels[level] || searchTerm ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          {(openLevels[level] || searchTerm) && Object.entries(categories).map(([category, commands]) => (
            <div key={category}>
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between py-1 pl-4 pr-2 rounded-md hover:bg-accent transition-colors"
              >
                <span className="font-medium text-sm">{category}</span>
                {openCategories[category] || searchTerm ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              {(openCategories[category] || searchTerm) && (
                <ul className="pl-4 pt-1 pb-2 space-y-1 border-l border-dashed ml-2">
                  {commands.map(command => (
                    <li key={command.id}>
                      <button 
                        onClick={() => onCommandSelect(command)}
                        className="w-full text-left block py-1 px-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors">
                        {command.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ))}
    </nav>
  );
};

export default LinuxSidebar;
