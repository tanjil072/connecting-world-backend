export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
  likesCount?: number;
  commentsCount?: number;
  isLiked?: boolean;
}

export interface Like {
  id: string;
  postId: string;
  userId: string;
  username: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
}

export interface AuthPayload {
  userId: string;
  username: string;
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
