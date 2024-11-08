import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProject } from '../hooks/useProject';
import type { Comment } from '../types/project';

interface CommentSectionProps {
  fileSetId: string;
  comments: Comment[];
}

export function CommentSection({ fileSetId, comments }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { profile } = useAuth();
  const { addComment } = useProject();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await addComment(fileSetId, newComment.trim());
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4 bg-gray-50 rounded-lg p-4">
      <h4 className="text-lg font-medium mb-4">Comments</h4>

      <div className="space-y-4 mb-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <span className="font-medium text-gray-900">
                {comment.userId === profile?.email ? 'You' : comment.userId}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="mt-1 text-gray-700">{comment.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          disabled={submitting}
        />
        <button
          type="submit"
          disabled={submitting || !newComment.trim()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {submitting ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}