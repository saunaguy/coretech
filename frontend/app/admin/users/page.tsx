'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, authenticatedFetch } from '../../../lib/auth';
import { format } from 'date-fns';

import { Toaster, toast } from 'sonner';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }

    const fetchAllUsers = async () => {
      try {
        const allUsers = await authenticatedFetch(`/api/v1/admin/users`);
        setUsers(allUsers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch all users.');
      } finally {
        setIsLoading(false);
      }
    };

    if (typeof window !== 'undefined') {
      fetchAllUsers();
    }
  }, [router]);

  const handleChangeRole = async (userId: number, newRole: string) => {
    try {
      await authenticatedFetch(`/api/v1/admin/users/${userId}/role`, {
        method: 'POST',
        body: JSON.stringify({ role: newRole }),
      });
      setUsers(currentUsers =>
        currentUsers.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      toast.success(`사용자 ${userId}의 역할이 ${newRole}으로 변경되었습니다.`);
    } catch (err) {
      toast.error(`역할 변경에 실패했습니다: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      return;
    }
    try {
      await authenticatedFetch(`/api/v1/admin/users/${userId}`, {
        method: 'DELETE',
      });
      setUsers(currentUsers => currentUsers.filter(user => user.id !== userId));
      toast.success(`사용자 ${userId}가 삭제되었습니다.`);
    } catch (err) {
      toast.error(`사용자 삭제에 실패했습니다: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Toaster richColors position="top-right" />
      <h1 className="text-2xl font-bold mb-4">관리자 대시보드 - 전체 사용자 관리</h1>
      {users.length === 0 ? (
        <p>등록된 사용자가 없습니다.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">사용자 이름</th>
              <th className="py-2 px-4 border-b">이메일</th>
              <th className="py-2 px-4 border-b">역할</th>
              <th className="py-2 px-4 border-b">가입일</th>
              <th className="py-2 px-4 border-b">액션</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className="py-2 px-4 border-b">{user.id}</td>
                <td className="py-2 px-4 border-b">{user.username}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.role}</td>
                <td className="py-2 px-4 border-b">{format(new Date(user.created_at), 'yyyy-MM-dd HH:mm')}</td>
                <td className="py-2 px-4 border-b space-x-2">
                  <button
                    onClick={() => handleChangeRole(user.id, user.role === 'admin' ? 'user' : 'admin')}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  >
                    역할 변경
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}