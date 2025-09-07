'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { mockDB } from '@/lib/mockDatabase';
import { User, Post } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function ProfilePage() {
  const { user: currentUser } = useAuth();
  const params = useParams();
  const username = params.username as string;

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (username) {
      loadProfile();
    }
  }, [username, currentUser]);

  const loadProfile = () => {
    const user = mockDB.getUserByUsername(username);
    if (user) {
      setProfileUser(user);
      const userPosts = mockDB.getPostsByUserId(user.id);
      setPosts(userPosts);
      
      if (currentUser) {
        setIsFollowing(mockDB.isFollowing(currentUser.id, user.id));
      }
      
      setFollowerCount(mockDB.getFollowersCount(user.id));
      setFollowingCount(mockDB.getFollowingCount(user.id));
    }
    setLoading(false);
  };

  const handleFollowToggle = () => {
    if (!currentUser || !profileUser) return;

    if (isFollowing) {
      const success = mockDB.unfollowUser(currentUser.id, profileUser.id);
      if (success) {
        setIsFollowing(false);
        setFollowerCount(prev => prev - 1);
      }
    } else {
      mockDB.followUser(currentUser.id, profileUser.id);
      setIsFollowing(true);
      setFollowerCount(prev => prev + 1);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-4xl mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className="flex items-center space-x-6 mb-8">
                <div className="w-32 h-32 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="w-48 h-8 bg-gray-300 rounded mb-4"></div>
                  <div className="w-64 h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="w-32 h-6 bg-gray-300 rounded"></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-300"></div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  if (!profileUser) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h1>
              <p className="text-gray-600">The user @{username} doesn't exist.</p>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  const isOwnProfile = currentUser?.id === profileUser.id;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Profile Header */}
          <div className="bg-white rounded-lg p-8 mb-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Profile Picture */}
              <Avatar className="h-32 w-32 md:h-40 md:w-40">
                <AvatarImage src={profileUser.profilePicture} alt={profileUser.fullName} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-4xl">
                  {profileUser.fullName.charAt(0)}
                </AvatarFallback>
              </Avatar>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                  <div>
                    <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                      <h1 className="text-2xl font-light">{profileUser.username}</h1>
                      {profileUser.isVerified && (
                        <span className="text-blue-500" title="Verified">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </div>
                    {!isOwnProfile && (
                      <Button
                        onClick={handleFollowToggle}
                        variant={isFollowing ? "outline" : "default"}
                        className={`mb-4 ${
                          !isFollowing 
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                            : 'border-gray-300'
                        }`}
                      >
                        {isFollowing ? 'Following' : 'Follow'}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex justify-center md:justify-start space-x-8 mb-4">
                  <div className="text-center">
                    <div className="font-semibold text-lg">{posts.length}</div>
                    <div className="text-gray-600 text-sm">posts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-lg">{followerCount}</div>
                    <div className="text-gray-600 text-sm">followers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-lg">{followingCount}</div>
                    <div className="text-gray-600 text-sm">following</div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <h2 className="font-semibold mb-1">{profileUser.fullName}</h2>
                  {profileUser.bio && (
                    <p className="text-gray-700 whitespace-pre-wrap">{profileUser.bio}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Posts Grid */}
          <div>
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Posts Yet</h3>
                <p className="text-gray-600">
                  {isOwnProfile 
                    ? "When you share photos, they'll appear on your profile."
                    : `@${profileUser.username} hasn't shared any photos yet.`
                  }
                </p>
                {isOwnProfile && (
                  <Link href="/upload">
                    <Button className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600">
                      Share your first photo
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1 md:gap-4">
                {posts.map((post) => (
                  <Card key={post.id} className="aspect-square relative overflow-hidden cursor-pointer group">
                    <Image
                      src={post.imageUrl}
                      alt={post.caption || 'Instagram post'}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 768px) 33vw, 25vw"
                      onError={(e) => {
                        e.currentTarget.src = 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b8daa8cb-518e-4423-8afb-87017568725a.png';
                      }}
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex items-center space-x-6 text-white">
                        <div className="flex items-center space-x-1">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                          <span className="font-semibold">{post.likeCount}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                          </svg>
                          <span className="font-semibold">{post.comments.length}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}