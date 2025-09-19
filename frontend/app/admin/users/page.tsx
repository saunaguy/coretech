'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { authenticatedFetch } from '@/lib/auth'

interface User {
  id: number
  username: string
  email: string
  created_at: string
}

export default function AdminUsersPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [pendingUsers, setPendingUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    if (user && user.role !== 'admin') {
      router.push('/') // Redirect non-admins
      return
    }

    const fetchPendingUsers = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await authenticatedFetch('/api/v1/admin/pending-users')
        setPendingUsers(data)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch pending users')
      } finally {
        setLoading(false)
      }
    }

    if (user && user.role === 'admin') {
      fetchPendingUsers()
    }
  }, [isAuthenticated, user, router])

  const handleApproveReject = async (userId: number, approve: boolean) => {
    try {
      await authenticatedFetch(
        '/api/v1/admin/approve-user',
        null, // Explicitly pass null for tokenOverride
        {
          method: 'POST',
          body: JSON.stringify({ user_id: userId, approve }),
        }
      )
      // Remove user from pending list after action
      setPendingUsers(prevUsers => prevUsers.filter(u => u.id !== userId))
    } catch (err: any) {
      alert(err.message || 'Failed to perform action')
    }
  }

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>승인 대기 사용자</CardTitle>
      </CardHeader>
      <CardContent>
        {pendingUsers.length === 0 ? (
          <p>현재 승인 대기 중인 사용자가 없습니다.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>아이디</TableHead>
                <TableHead>사용자 이름</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>등록일</TableHead>
                <TableHead>작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleApproveReject(user.id, true)} className="mr-2">승인</Button>
                    <Button onClick={() => handleApproveReject(user.id, false)} variant="destructive">거부</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
