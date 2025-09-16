
"use client"

import { useState, useEffect } from 'react';
import { authenticatedFetch } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react'; // 아이콘 사용을 위해 lucide-react 설치 필요

interface LikeButtonProps {
  parentId: number;
  parentType: "post" | "question";
  initialLikes: number;
  currentUserId: string | null; // 현재 로그인한 사용자 ID
}

export default function LikeButton({ parentId, parentType, initialLikes, currentUserId }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false); // 현재 사용자가 추천했는지 여부
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

  // 현재 사용자의 추천 상태를 확인하는 함수 (백엔드 API가 필요)
  const checkLikeStatus = async () => {
    if (!currentUserId) return; // 로그인하지 않았으면 상태 확인할 필요 없음
    try {
      // TODO: 백엔드에 특정 사용자가 특정 게시글/질문을 추천했는지 확인하는 API 엔드포인트가 필요합니다.
      // 현재는 해당 API가 없으므로, 임시로 항상 false로 설정합니다.
      // 예시: const response = await authenticatedFetch(`${API_BASE_URL}/api/v1/likes/status?parent_id=${parentId}&parent_type=${parentType}&user_id=${currentUserId}`);
      // setIsLiked(response.is_liked);
    } catch (err) {
      console.error('Failed to check like status:', err);
    }
  };

  const handleToggleLike = async () => {
    if (!currentUserId) {
      alert('로그인이 필요합니다.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const url = `${API_BASE_URL}/api/v1/likes`;
      const response = await authenticatedFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parent_id: parentId,
          parent_type: parentType,
          user_id: currentUserId, // 백엔드에서 current_user.id를 사용하므로, 이 필드는 무시될 수 있습니다.
        }),
      });

      if (response && response.detail === "Like removed") {
        setIsLiked(false);
        setLikes((prev) => Math.max(0, prev - 1));
      } else {
        setIsLiked(true);
        setLikes((prev) => prev + 1);
      }
    } catch (err: any) {
      setError(err.message || '추천 상태 변경에 실패했습니다.');
      console.error('Failed to toggle like:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 컴포넌트 마운트 시 초기 추천 상태 확인
    checkLikeStatus();
  }, [currentUserId, parentId, parentType]);

  return (
    <Button
      onClick={handleToggleLike}
      disabled={loading}
      variant={isLiked ? "default" : "outline"}
      size="sm"
      className="flex items-center gap-1"
    >
      {isLiked ? <ThumbsDown size={16} /> : <ThumbsUp size={16} />}
      <span>{likes}</span>
    </Button>
  );
}
