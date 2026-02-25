// Types cho Post, Comment, Story
export interface User {
  id: number;
  email: string;
  fullName: string;
  avatar: string;
}

export interface Comment {
  id: number;
  postId: number;
  user: User;
  content: string;
  createdAt: string;
}

export interface Post {
  id: number;
  user: User;
  content: string | null;
  images: string[];
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  likedByCurrentUser: boolean;
}

export interface Story {
  id: number;
  user: User;
  image: string;
  createdAt: string;
  viewed: boolean;
}
