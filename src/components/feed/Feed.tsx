'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { mockDB } from '@/lib/mockDatabase';
import { Post } from '@/types';
import PostCard from './PostCard';

interface PostWithUser extends Post {
  user: any;
}

export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFeedPosts = () => {
    if (!user) return;

    const feedPosts = mockDB.getFeedPosts(user.id);
    const postsWithUsers = feedPosts.map(post => ({
      ...post,
      user: mockDB.getUserById(post.userId)
    })).filter(post => post.user);

    setPosts(postsWithUsers);
    setLoading(false);
  };

  useEffect(() => {
    loadFeedPosts();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-full max-w-lg mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
              <div className="flex items-center p-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="ml-3 flex-1">
                  <div className="w-24 h-4 bg-gray-300 rounded"></div>
                </div>
              </div>
              <div className="aspect-square bg-gray-300"></div>
              <div className="p-4">
                <div className="w-16 h-4 bg-gray-300 rounded mb-2"></div>
                <div className="w-full h-4 bg-gray-300 rounded mb-1"></div>
                <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Posts Yet</h3>
        <p className="text-gray-600 mb-4">
          Follow users to see their posts in your feed
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>• Upload your first post</p>
          <p>• Follow other users</p>
          <p>• Discover amazing content</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          postUser={post.user}
          onUpdate={loadFeedPosts}
        />
      ))}
    </div>
  );
}