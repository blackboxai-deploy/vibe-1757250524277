'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { mockDB } from '@/lib/mockDatabase';
import { User } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/layout/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

interface UserWithFollowStatus extends User {
  isFollowing: boolean;
  followersCount: number;
}

function SearchContent() {
  const { user: currentUser } = useAuth();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<UserWithFollowStatus[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (query: string) => {
    if (!query.trim() || !currentUser) return;

    setLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = mockDB.getUsers();
    const filtered = users
      .filter(user => 
        user.id !== currentUser.id && (
          user.username.toLowerCase().includes(query.toLowerCase()) ||
          user.fullName.toLowerCase().includes(query.toLowerCase())
        )
      )
      .map(user => ({
        ...user,
        isFollowing: mockDB.isFollowing(currentUser.id, user.id),
        followersCount: mockDB.getFollowersCount(user.id)
      }))
      .slice(0, 20); // Limit results

    setSearchResults(filtered);
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const handleFollowToggle = (userId: string, isCurrentlyFollowing: boolean) => {
    if (!currentUser) return;

    if (isCurrentlyFollowing) {
      const success = mockDB.unfollowUser(currentUser.id, userId);
      if (success) {
        setSearchResults(prev => 
          prev.map(user => 
            user.id === userId 
              ? { ...user, isFollowing: false, followersCount: user.followersCount - 1 }
              : user
          )
        );
      }
    } else {
      mockDB.followUser(currentUser.id, userId);
      setSearchResults(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, isFollowing: true, followersCount: user.followersCount + 1 }
            : user
        )
      );
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-8">
          {/* Search Form */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="flex space-x-2">
              <Input
                type="text"
                placeholder="Search for users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-white border-gray-300 focus:border-pink-500 focus:ring-pink-500"
              />
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-pink-600"
              >
                {loading ? '...' : 'Search'}
              </Button>
            </form>
          </div>

          {/* Search Results */}
          <div>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                        <div>
                          <div className="w-24 h-4 bg-gray-300 rounded mb-2"></div>
                          <div className="w-32 h-3 bg-gray-300 rounded"></div>
                        </div>
                      </div>
                      <div className="w-20 h-8 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchResults.length === 0 && searchQuery ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
                <p className="text-gray-600">
                  No users found for "{searchQuery}". Try searching for a different name or username.
                </p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Discover People</h3>
                <p className="text-gray-600">
                  Search for users by their name or username to connect with friends and discover new content.
                </p>
                
                {/* Suggested Users */}
                <div className="mt-8">
                  <h4 className="font-semibold text-gray-900 mb-4">Suggested for you</h4>
                  <div className="space-y-3">
                    {mockDB.getUsers()
                      .filter(user => user.id !== currentUser?.id)
                      .slice(0, 3)
                      .map(user => {
                        const isFollowing = currentUser ? mockDB.isFollowing(currentUser.id, user.id) : false;
                        const followersCount = mockDB.getFollowersCount(user.id);
                        
                        return (
                          <div key={user.id} className="bg-white rounded-lg p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                              <Link href={`/profile/${user.username}`} className="flex items-center space-x-3 hover:opacity-80">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src={user.profilePicture} alt={user.fullName} />
                                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                                    {user.fullName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="text-left">
                                  <div className="flex items-center space-x-1">
                                    <p className="font-semibold text-sm">{user.username}</p>
                                    {user.isVerified && (
                                      <span className="text-blue-500" title="Verified">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-gray-600 text-sm">{user.fullName}</p>
                                  <p className="text-gray-500 text-xs">{followersCount} followers</p>
                                </div>
                              </Link>
                              <Button
                                size="sm"
                                variant={isFollowing ? "outline" : "default"}
                                onClick={() => handleFollowToggle(user.id, isFollowing)}
                                className={!isFollowing ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}
                              >
                                {isFollowing ? 'Following' : 'Follow'}
                              </Button>
                            </div>
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
                </h3>
                {searchResults.map((user) => (
                  <div key={user.id} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <Link href={`/profile/${user.username}`} className="flex items-center space-x-3 hover:opacity-80">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.profilePicture} alt={user.fullName} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                            {user.fullName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <div className="flex items-center space-x-1">
                            <p className="font-semibold text-sm">{user.username}</p>
                            {user.isVerified && (
                              <span className="text-blue-500" title="Verified">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm">{user.fullName}</p>
                          <p className="text-gray-500 text-xs">{user.followersCount} followers</p>
                          {user.bio && (
                            <p className="text-gray-600 text-xs mt-1 line-clamp-1">{user.bio}</p>
                          )}
                        </div>
                      </Link>
                      <Button
                        size="sm"
                        variant={user.isFollowing ? "outline" : "default"}
                        onClick={() => handleFollowToggle(user.id, user.isFollowing)}
                        className={!user.isFollowing ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}
                      >
                        {user.isFollowing ? 'Following' : 'Follow'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}