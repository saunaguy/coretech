
"use client"

import { useState, useEffect } from 'react';
import { authenticatedFetch } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react'; // 아이콘 사용을 위해 lucide-react 설치 필요

interface LikeButtonProps {
  parentId: number;
  parentType: "post" | "question";
  initialLikes: number;
  token: string | null; // Pass the actual token string
}

export default function LikeButton({ parentId, parentType, initialLikes, token }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false); // 현재 사용자가 추천했는지 여부
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

  const checkLikeStatus = async () => {
    if (!token) return;
    try {
      const url = `${API_BASE_URL}/api/v1/likes/status?parent_id=${parentId}&parent_type=${parentType}`;
      const response = await authenticatedFetch(url);
      if (response && response.is_liked) {
        setIsLiked(true);
      }
    } catch (err) {
      console.error('Failed to check like status:', err);
    }
  };

  const handleLike = async () => {
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (isLiked) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const url = `${API_BASE_URL}/api/v1/likes`;
      await authenticatedFetch(url, token, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parent_id: parentId,
          parent_type: parentType,
        }),
      });

      // Optimistically update UI
      setIsLiked(true);
      setLikes((prev) => prev + 1);

    } catch (err: any) {
      setError(err.message || '추천에 실패했습니다.');
      console.error('Failed to add like:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 컴포넌트 마운트 시 초기 추천 상태 확인
    checkLikeStatus();
  }, [token, parentId, parentType]);

  return (
    <Button
      onClick={handleLike}
      disabled={loading || isLiked} // 추천했으면 비활성화
      variant={isLiked ? "default" : "outline"}
      size="sm"
      className="flex items-center gap-1"
    >
      <ThumbsUp size={16} />
      <span>{likes}</span>
    </Button>
  );
}
