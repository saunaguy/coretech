
"use client"

import { useState, useEffect } from 'react';
import { authenticatedFetch } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Comment {
  id: number;
  content: string;
  user_id: number; // 댓글 작성자 ID
  created_at: string;
  // user: { username: string; } // 백엔드에서 user 정보를 함께 반환한다면 사용
}

interface CommentSectionProps {
  parentId: number;
  parentType: "post" | "question";
}

export default function CommentSection({ parentId, parentType }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${API_BASE_URL}/api/v1/${parentType}s/${parentId}/comments`;
      const response = await authenticatedFetch(url);
      setComments(response);
    } catch (err: any) {
      setError(err.message || '댓글을 불러오는데 실패했습니다.');
      console.error('Failed to fetch comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const url = `${API_BASE_URL}/api/v1/comments`;
      const response = await authenticatedFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parent_id: parentId,
          parent_type: parentType,
          content: newComment,
        }),
      });
      setComments((prev) => [...prev, response]);
      setNewComment('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [parentId, parentType]);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>댓글</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <p>댓글 로딩 중...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="space-y-4">
          {comments.length === 0 && !loading && !error && <p>아직 댓글이 없습니다.</p>}
          {comments.map((comment) => (
            <div key={comment.id} className="border-b pb-2 last:border-b-0">
              <p className="text-sm">{comment.content}</p>
              <p className="text-xs text-muted-foreground mt-1">
                작성자: {comment.user_id} {/* 실제 사용자 이름으로 대체 필요 */}
                <span className="ml-2">{new Date(comment.created_at).toLocaleString()}</span>
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Textarea
            placeholder="댓글을 작성하세요..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <Button onClick={handleSubmitComment} disabled={loading} className="mt-2">
            댓글 작성
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
