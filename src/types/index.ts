export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  bio?: string;
  profilePicture?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: string;
  userId: string;
  imageUrl: string;
  caption?: string;
  likes: string[]; // Array of user IDs who liked the post
  likeCount: number;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  userId: string;
  postId: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Follow {
  id: string;
  followerId: string; // User who is following
  followingId: string; // User being followed
  createdAt: Date;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: SignupData) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

export interface SignupData {
  email: string;
  password: string;
  username: string;
  fullName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface PostWithUser extends Post {
  user: User;
}

export interface CommentWithUser extends Comment {
  user: User;
}

export interface UserStats {
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export interface UserWithStats extends User {
  stats: UserStats;
  isFollowing?: boolean;
}

export interface CreatePostData {
  image: File;
  caption?: string;
  filter?: string;
}

export interface FilterType {
  name: string;
  displayName: string;
  filter: string;
}

export interface NotificationType {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow';
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// Mock database interface
export interface MockDatabase {
  users: User[];
  posts: Post[];
  follows: Follow[];
  comments: Comment[];
}