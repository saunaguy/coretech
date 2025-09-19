
"use client"

import { useState, useEffect } from 'react';
import { authenticatedFetch } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Comment {
  id: number;
  content: string;
  user_id: number; // 댓글 작성자 ID
  created_at: string;
  author: { id: number; username: string; }; // 백엔드에서 user 정보를 함께 반환한다면 사용
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


  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `/api/v1/${parentType}/${parentId}/comments`;
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
      const url = `/api/v1/comments`;
      const response = await authenticatedFetch(url, null, {
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
              <ReactMarkdown
                className="prose prose-sm dark:prose-invert break-words px-4"
                remarkPlugins={[remarkGfm]}
                components={{
                  pre: ({ node, ...props }) => (
                    <pre {...props} className="whitespace-pre-wrap break-words" />
                  ),
                  code: ({ node, ...props }) => (
                    <code {...props} className="break-words" />
                  ),
                }}
              >
                {comment.content}
              </ReactMarkdown>
              <p className="text-xs text-muted-foreground mt-1">
                작성자: {comment.author?.username || '알 수 없는 사용자'}
                <span className="ml-2">
                  {comment.created_at && !isNaN(new Date(comment.created_at).getTime())
                    ? new Date(comment.created_at).toLocaleString()
                    : '날짜 정보 없음'}
                </span>
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
