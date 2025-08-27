import React, { useState } from 'react';
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
  {
    id: "mkdir",
    name: "mkdir",
    title: "mkdir - make directories",
    description: "Creates new directories with the specified names.",
    options: [
      { flag: "-p", description: "Create parent directories as needed" },
      { flag: "-m", description: "Set file mode (permissions)" },
      { flag: "-v", description: "Print a message for each created directory" },
    ],
    examples: [
      { command: "mkdir newdir", description: 'Create a directory named "newdir"' },
      { command: "mkdir -p path/to/newdir", description: "Create nested directories" },
      { command: "mkdir dir1 dir2 dir3", description: "Create multiple directories" },
    ],
  },
  {
    id: "pwd",
    name: "pwd",
    title: "pwd - print working directory",
    description: "Displays the full pathname of the current working directory.",
    options: [
      { flag: "-L", description: "Print the logical current working directory" },
      { flag: "-P", description: "Print the physical current working directory" },
    ],
    examples: [
      { command: "pwd", description: "Show current directory path" },
      { command: "pwd -P", description: "Show physical path (resolves symlinks)" },
    ],
  },
  {
    id: "rm",
    name: "rm",
    title: "rm - remove files and directories",
    description: "Removes (deletes) files and directories. Use with caution as this action is irreversible.",
    options: [
      { flag: "-r", description: "Remove directories and their contents recursively" },
      { flag: "-f", description: "Force removal without prompting" },
      { flag: "-i", description: "Prompt before every removal" },
      { flag: "-v", description: "Explain what is being done" },
    ],
    examples: [
      { command: "rm file.txt", description: "Remove a single file" },
      { command: "rm -rf directory/", description: "Remove directory and all contents" },
      { command: "rm -i *.txt", description: "Remove all .txt files with confirmation" },
    ],
  },
  {
    id: "cp",
    name: "cp",
    title: "cp - copy files or directories",
    description: "Copies files or directories from source to destination.",
    options: [
      { flag: "-r", description: "Copy directories recursively" },
      { flag: "-i", description: "Prompt before overwriting" },
      { flag: "-v", description: "Verbose output" },
      { flag: "-p", description: "Preserve file attributes" },
    ],
    examples: [
      { command: "cp file1.txt file2.txt", description: "Copy file1.txt to file2.txt" },
      { command: "cp -r dir1/ dir2/", description: "Copy directory recursively" },
      { command: "cp *.txt backup/", description: "Copy all .txt files to backup directory" },
    ],
  },
]

const LinuxPage = () => {
  const [activeCommand, setActiveCommand] = useState(linuxCommands[0])

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8">
        {/* Sidebar Navigation */}
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
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-mono">{activeCommand.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">{activeCommand.description}</p>

              {/* Common Options */}
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

              {/* Usage Examples */}
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
  );
};

export default LinuxPage;