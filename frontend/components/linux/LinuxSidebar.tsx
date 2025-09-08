'use client'

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"

const LinuxSidebar = ({ topics }) => {
  const [openCategories, setOpenCategories] = useState(
    Object.keys(topics['왕초보'] || {}).reduce((acc, category) => {
      acc[category] = true;
      return acc;
    }, {})
  );

  const toggleCategory = (category) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <nav className="space-y-2 text-sm">
      {Object.entries(topics).map(([level, categories]) => (
        <div key={level} className="space-y-1">
          <h3 className="font-semibold text-lg mb-2 px-2">{level}</h3>
          {Object.entries(categories).map(([category, commands]) => (
            <div key={category}>
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between py-1 px-2 rounded-md hover:bg-accent transition-colors"
              >
                <span className="font-medium text-base">{category}</span>
                {openCategories[category] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              {openCategories[category] && (
                <ul className="pl-4 pt-1 pb-2 space-y-1 border-l border-dashed ml-2">
                  {commands.map(command => (
                    <li key={command.id}>
                      <a href={`#${command.id}`} className="block py-1 px-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors">
                        {command.name}
                      </a>
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
