'use client'

import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthProvider'
import { Shield } from 'lucide-react'

export default function AdminFab() {
  const { user } = useAuth();

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <Link href="/admin" passHref>
      <div className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-transform hover:scale-110 cursor-pointer">
        <Shield className="w-7 h-7" />
        <span className="sr-only">Admin Panel</span>
      </div>
    </Link>
  );
}
