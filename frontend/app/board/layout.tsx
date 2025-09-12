export const dynamic = "force-dynamic"

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default function BoardLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get('token')?.value
  if (!token) {
    redirect('/?denied=1')
  }
  return children
}
