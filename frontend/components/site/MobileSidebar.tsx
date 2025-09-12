'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import LinuxSidebar from '@/components/linux/LinuxSidebar'

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
  topics: any[] // Assuming topics type
  onCommandSelect: (command: any) => void // Assuming command type
}

export default function MobileSidebar({ isOpen, onClose, topics, onCommandSelect }: MobileSidebarProps) {
  return (
    <div
      className={`fixed inset-0 z-50 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out md:hidden`}
    >
      <div className="absolute inset-y-0 left-0 w-64 bg-background shadow-lg p-4">
        <div className="flex justify-end">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
            <span className="sr-only">메뉴 닫기</span>
          </Button>
        </div>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>명령어 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <LinuxSidebar topics={topics} onCommandSelect={onCommandSelect} />
          </CardContent>
        </Card>
      </div>
      <div className="absolute inset-0 left-64 bg-black/50" onClick={onClose} />
    </div>
  )
}