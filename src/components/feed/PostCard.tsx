'use client';

import { useState } from 'react';
import { Post, User, Comment } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { mockDB } from '@/lib/mockDatabase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';

interface PostCardProps {
  post: Post;
  postUser: User;
  onUpdate?: () => void;
}

export default function PostCard({ post, postUser, onUpdate }: PostCardProps) {
  const { user: currentUser } = useAuth();
  const [isLiked, setIsLiked] = useState(
    post.likes.includes(currentUser?.id || '')
  );
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    if (!currentUser) return;

    if (isLiked) {
      const success = mockDB.unlikePost(post.id, currentUser.id);
      if (success) {
        setIsLiked(false);
        setLikeCount(prev => prev - 1);
        onUpdate?.();
      }
    } else {
      const success = mockDB.likePost(post.id, currentUser.id);
      if (success) {
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
        onUpdate?.();
      }
    }
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newComment.trim()) return;

    const comment = mockDB.addComment(post.id, currentUser.id, newComment.trim());
    setComments(prev => [...prev, comment]);
    setNewComment('');
    onUpdate?.();
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <Link 
          href={`/profile/${postUser.username}`}
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={postUser.profilePicture} alt={postUser.fullName} />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              {postUser.fullName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{postUser.username}</p>
            {postUser.isVerified && (
              <span className="text-blue-500 text-xs">✓ Verified</span>
            )}
          </div>
        </Link>
        <span className="text-gray-500 text-sm">{formatTimeAgo(post.createdAt)}</span>
      </div>

      {/* Post Image */}
      <div className="relative aspect-square">
        <Image
          src={post.imageUrl}
          alt={post.caption || 'Instagram post'}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 512px"
          onError={(e) => {
            // Fallback for broken images
            e.currentTarget.src = 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/156b4795-8e24-48b6-9dd1-4ce394343555.png';
          }}
        />
      </div>

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`p-0 h-auto hover:bg-transparent ${
                isLiked ? 'text-red-500' : 'text-gray-700 hover:text-red-500'
              }`}
            >
              <svg className="w-6 h-6" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="p-0 h-auto text-gray-700 hover:bg-transparent hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Like Count */}
        {likeCount > 0 && (
          <p className="font-semibold text-sm mb-2">
            {likeCount} {likeCount === 1 ? 'like' : 'likes'}
          </p>
        )}

        {/* Caption */}
        {post.caption && (
          <div className="text-sm mb-2">
            <Link 
              href={`/profile/${postUser.username}`}
              className="font-semibold hover:underline"
            >
              {postUser.username}
            </Link>
            <span className="ml-2">{post.caption}</span>
          </div>
        )}

        {/* Comments */}
        {comments.length > 0 && (
          <div className="mb-3">
            {!showComments ? (
              <button
                onClick={() => setShowComments(true)}
                className="text-gray-500 text-sm hover:underline"
              >
                View all {comments.length} comments
              </button>
            ) : (
              <div className="space-y-2">
                {comments.slice(0, 3).map((comment) => {
                  const commentUser = mockDB.getUserById(comment.userId);
                  return (
                    <div key={comment.id} className="text-sm">
                      <Link 
                        href={`/profile/${commentUser?.username}`}
                        className="font-semibold hover:underline"
                      >
                        {commentUser?.username}
                      </Link>
                      <span className="ml-2">{comment.text}</span>
                    </div>
                  );
                })}
                {comments.length > 3 && (
                  <p className="text-gray-500 text-sm">
                    and {comments.length - 3} more comments...
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Add Comment */}
        <form onSubmit={handleComment} className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-100">
          <Input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="border-none focus:ring-0 text-sm flex-1 p-0"
          />
          {newComment.trim() && (
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="text-blue-500 hover:text-blue-600 p-0 h-auto font-semibold"
            >
              Post
            </Button>
          )}
        </form>
      </div>
    </Card>
  );
}