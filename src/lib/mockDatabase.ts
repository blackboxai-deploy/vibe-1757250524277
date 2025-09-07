import { User, Post, Follow, Comment, MockDatabase } from '@/types';

// Simple UUID generator for MVP purposes
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Sample users
const sampleUsers: User[] = [
  {
    id: 'user1',
    username: 'johndoe',
    email: 'john@example.com',
    fullName: 'John Doe',
    bio: 'Photography enthusiast 📸 | Travel lover ✈️',
    profilePicture: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3b2e76f2-14d9-43b1-aae8-6ac30acb43dc.png',
    isVerified: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'user2',
    username: 'janesmith',
    email: 'jane@example.com',
    fullName: 'Jane Smith',
    bio: 'Artist & Designer 🎨 | Coffee addict ☕',
    profilePicture: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/68a56ce1-423d-4f47-8884-f35667cad10d.png',
    isVerified: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: 'user3',
    username: 'mikejohnson',
    email: 'mike@example.com',
    fullName: 'Mike Johnson',
    bio: 'Fitness coach 💪 | Nutrition expert',
    profilePicture: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e408f2b0-823b-4bcf-98de-2bec1b6f7bd1.png',
    isVerified: false,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'user4',
    username: 'sarahwilson',
    email: 'sarah@example.com',
    fullName: 'Sarah Wilson',
    bio: 'Food blogger 🍜 | Recipe creator',
    profilePicture: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e4496c66-64f7-4eff-bc70-a05fc7808546.png',
    isVerified: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  }
];

// Sample posts
const samplePosts: Post[] = [
  {
    id: 'post1',
    userId: 'user1',
    imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c5973868-675b-42b1-836a-739c4e7cd403.png',
    caption: 'Amazing sunset at the mountains! Nature never fails to amaze me 🌅 #photography #nature',
    likes: ['user2', 'user3'],
    likeCount: 2,
    comments: [],
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: 'post2',
    userId: 'user2',
    imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/06492e0f-40aa-4920-896c-6342e7a758e4.png',
    caption: 'Working on my latest painting. What do you think? 🎨',
    likes: ['user1', 'user4'],
    likeCount: 2,
    comments: [],
    createdAt: new Date('2024-01-24'),
    updatedAt: new Date('2024-01-24'),
  },
  {
    id: 'post3',
    userId: 'user3',
    imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d69b1dc4-a844-4cc2-a283-dd9791e8f50b.png',
    caption: 'Morning workout complete! 💪 Remember, consistency is key! #fitness #motivation',
    likes: ['user1'],
    likeCount: 1,
    comments: [],
    createdAt: new Date('2024-01-23'),
    updatedAt: new Date('2024-01-23'),
  },
  {
    id: 'post4',
    userId: 'user4',
    imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/abd6357a-2345-4b51-b745-cf23f8fe8d86.png',
    caption: 'Homemade pasta with fresh basil from my garden 🍝 Recipe coming soon!',
    likes: ['user2', 'user3'],
    likeCount: 2,
    comments: [],
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
  },
  {
    id: 'post5',
    userId: 'user1',
    imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3c65742f-bcbf-4a40-a9a3-ccd7b512c3b1.png',
    caption: 'Street photography in the city. Love the architectural details! 🏢',
    likes: ['user4'],
    likeCount: 1,
    comments: [],
    createdAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-21'),
  }
];

// Sample follows
const sampleFollows: Follow[] = [
  {
    id: 'follow1',
    followerId: 'user1',
    followingId: 'user2',
    createdAt: new Date('2024-01-16'),
  },
  {
    id: 'follow2',
    followerId: 'user1',
    followingId: 'user4',
    createdAt: new Date('2024-01-17'),
  },
  {
    id: 'follow3',
    followerId: 'user2',
    followingId: 'user1',
    createdAt: new Date('2024-01-18'),
  },
  {
    id: 'follow4',
    followerId: 'user3',
    followingId: 'user1',
    createdAt: new Date('2024-01-19'),
  }
];

// Sample comments
const sampleComments: Comment[] = [
  {
    id: 'comment1',
    userId: 'user2',
    postId: 'post1',
    text: 'Absolutely stunning! 😍',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: 'comment2',
    userId: 'user3',
    postId: 'post1',
    text: 'This makes me want to go hiking!',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: 'comment3',
    userId: 'user1',
    postId: 'post2',
    text: 'Love the colors! Very inspiring 🎨',
    createdAt: new Date('2024-01-24'),
    updatedAt: new Date('2024-01-24'),
  }
];

// Update posts with comments
samplePosts[0].comments = [sampleComments[0], sampleComments[1]];
samplePosts[1].comments = [sampleComments[2]];

class MockDB {
  private data: MockDatabase;

  constructor() {
    // Load data from localStorage or use default sample data
    const savedData = typeof window !== 'undefined' ? localStorage.getItem('instagramMVP') : null;
    
    if (savedData) {
      this.data = JSON.parse(savedData);
      // Convert string dates back to Date objects
      this.data.users = this.data.users.map(user => ({
        ...user,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt)
      }));
      this.data.posts = this.data.posts.map(post => ({
        ...post,
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt),
        comments: post.comments.map(comment => ({
          ...comment,
          createdAt: new Date(comment.createdAt),
          updatedAt: new Date(comment.updatedAt)
        }))
      }));
      this.data.follows = this.data.follows.map(follow => ({
        ...follow,
        createdAt: new Date(follow.createdAt)
      }));
      this.data.comments = this.data.comments.map(comment => ({
        ...comment,
        createdAt: new Date(comment.createdAt),
        updatedAt: new Date(comment.updatedAt)
      }));
    } else {
      this.data = {
        users: sampleUsers,
        posts: samplePosts,
        follows: sampleFollows,
        comments: sampleComments
      };
      this.save();
    }
  }

  private save() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('instagramMVP', JSON.stringify(this.data));
    }
  }

  // User methods
  getUsers(): User[] {
    return this.data.users;
  }

  getUserById(id: string): User | undefined {
    return this.data.users.find(user => user.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.data.users.find(user => user.email === email);
  }

  getUserByUsername(username: string): User | undefined {
    return this.data.users.find(user => user.username === username);
  }

  createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const newUser: User = {
      id: generateUUID(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const userIndex = this.data.users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      this.data.users[userIndex] = {
        ...this.data.users[userIndex],
        ...updates,
        updatedAt: new Date()
      };
      this.save();
      return this.data.users[userIndex];
    }
    return undefined;
  }

  // Post methods
  getPosts(): Post[] {
    return this.data.posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getPostById(id: string): Post | undefined {
    return this.data.posts.find(post => post.id === id);
  }

  getPostsByUserId(userId: string): Post[] {
    return this.data.posts
      .filter(post => post.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  createPost(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'likeCount' | 'likes' | 'comments'>): Post {
    const newPost: Post = {
      id: generateUUID(),
      ...postData,
      likes: [],
      likeCount: 0,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.data.posts.push(newPost);
    this.save();
    return newPost;
  }

  // Follow methods
  getFollows(): Follow[] {
    return this.data.follows;
  }

  getFollowersCount(userId: string): number {
    return this.data.follows.filter(follow => follow.followingId === userId).length;
  }

  getFollowingCount(userId: string): number {
    return this.data.follows.filter(follow => follow.followerId === userId).length;
  }

  isFollowing(followerId: string, followingId: string): boolean {
    return this.data.follows.some(
      follow => follow.followerId === followerId && follow.followingId === followingId
    );
  }

  followUser(followerId: string, followingId: string): Follow {
    const newFollow: Follow = {
      id: generateUUID(),
      followerId,
      followingId,
      createdAt: new Date()
    };
    this.data.follows.push(newFollow);
    this.save();
    return newFollow;
  }

  unfollowUser(followerId: string, followingId: string): boolean {
    const followIndex = this.data.follows.findIndex(
      follow => follow.followerId === followerId && follow.followingId === followingId
    );
    if (followIndex !== -1) {
      this.data.follows.splice(followIndex, 1);
      this.save();
      return true;
    }
    return false;
  }

  // Like methods
  likePost(postId: string, userId: string): boolean {
    const post = this.getPostById(postId);
    if (post && !post.likes.includes(userId)) {
      post.likes.push(userId);
      post.likeCount++;
      this.save();
      return true;
    }
    return false;
  }

  unlikePost(postId: string, userId: string): boolean {
    const post = this.getPostById(postId);
    if (post && post.likes.includes(userId)) {
      post.likes = post.likes.filter(id => id !== userId);
      post.likeCount--;
      this.save();
      return true;
    }
    return false;
  }

  // Comment methods
  addComment(postId: string, userId: string, text: string): Comment {
    const newComment: Comment = {
      id: generateUUID(),
      userId,
      postId,
      text,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.data.comments.push(newComment);

    // Add comment to post
    const post = this.getPostById(postId);
    if (post) {
      post.comments.push(newComment);
    }

    this.save();
    return newComment;
  }

  // Feed methods
  getFeedPosts(userId: string): Post[] {
    const following = this.data.follows
      .filter(follow => follow.followerId === userId)
      .map(follow => follow.followingId);
    
    // Include user's own posts
    following.push(userId);

    return this.data.posts
      .filter(post => following.includes(post.userId))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export const mockDB = new MockDB();