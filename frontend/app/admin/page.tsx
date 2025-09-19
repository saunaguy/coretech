'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, authenticatedFetch } from '../../lib/auth';

interface PendingUser {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Normalize API base URL to avoid double slashes
  const API = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '');

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }

    const fetchPendingUsers = async () => {
      try {
        // Use relative path so Next.js rewrites proxy to backend
        const users = await authenticatedFetch(`/api/v1/admin/pending-users`);
        setPendingUsers(users);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch users.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingUsers();
  }, [router]);

  const handleApproval = async (userId: number, approve: boolean) => {
    try {
      await authenticatedFetch(`/api/v1/admin/approve-user`, {
        method: 'POST',
        body: JSON.stringify({ user_id: userId, approve }),
      });
      // Remove the user from the list on successful action
      setPendingUsers(currentUsers => currentUsers.filter(user => user.id !== userId));
    } catch (err) {
      alert(`사용자 ${approve ? '허가' : '거부'}에 실패했습니다.`);
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
      <h1 className="text-2xl font-bold mb-4">관리자 대시보드 - 승인 요청</h1>
      {pendingUsers.length === 0 ? (
        <p>승인 요청 들어온 아이디가 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {pendingUsers.map(user => (
            <li key={user.id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold">{user.username}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-xs text-gray-400">Joined: {new Date(user.created_at).toLocaleDateString()}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleApproval(user.id, true)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  허가
                </button>
                <button
                  onClick={() => handleApproval(user.id, false)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  거부
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
