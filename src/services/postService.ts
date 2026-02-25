import api from "./api";
import type { Post } from "../@type/post";

export interface CreatePostData {
  content: string;
  imageUrls?: string[];
}

export interface UploadImagesResponse {
  success: boolean;
  message?: string;
  data?: {
    imageUrls: string[];
  };
}

export interface PostResponse {
  success: boolean;
  message?: string;
  data?: Post;
}

export interface PostsResponse {
  success: boolean;
  message?: string;
  data?: Post[];
}

export const PostService = {
  /**
   * Upload ảnh lên server
   */
  async uploadImages(images: File[]): Promise<UploadImagesResponse> {
    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append("images", image);
      });
      formData.append("folder", "posts");

      const response = await api.post("/upload/images", formData);
      return response.data;
    } catch (error: any) {
      console.error("Upload images error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to upload images",
      };
    }
  },

  /**
   * Lấy feed posts
   */
  async getFeed(page: number = 0, size: number = 20): Promise<PostsResponse> {
    try {
      const response = await api.get(`/posts/feed?page=${page}&size=${size}`);
      return response.data;
    } catch (error: any) {
      console.error("Get feed error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to load feed",
      };
    }
  },

  /**
   * Tạo post mới với content và imageUrls
   */
  async createPost(data: CreatePostData): Promise<PostResponse> {
    try {
      const response = await api.post("/posts", {
        content: data.content || null,
        imageUrls: data.imageUrls || [],
      });
      
      return response.data;
    } catch (error: any) {
      console.error("Create post error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create post",
      };
    }
  },

  /**
   * Lấy chi tiết post
   */
  async getPost(postId: string): Promise<PostResponse> {
    try {
      const response = await api.get(`/posts/${postId}`);
      return response.data;
    } catch (error: any) {
      console.error("Get post error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to load post",
      };
    }
  },

  /**
   * Cập nhật nội dung post
   */
  async updatePost(postId: string, content: string): Promise<PostResponse> {
    try {
      const formData = new FormData();
      formData.append("content", content);

      const response = await api.put(`/posts/${postId}`, formData);
      return response.data;
    } catch (error: any) {
      console.error("Update post error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update post",
      };
    }
  },

  /**
   * Xóa post
   */
  async deletePost(postId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await api.delete(`/posts/${postId}`);
      return response.data;
    } catch (error: any) {
      console.error("Delete post error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete post",
      };
    }
  },

  /**
   * Thêm ảnh vào post
   */
  async addImages(postId: string, images: File[]): Promise<PostResponse> {
    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append("images", image);
      });

      // Không cần set Content-Type, browser sẽ tự động set với boundary
      const response = await api.post(`/posts/${postId}/images`, formData);
      
      return response.data;
    } catch (error: any) {
      console.error("Add images error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to add images",
      };
    }
  },

  /**
   * Xóa ảnh khỏi post
   */
  async removeImage(postId: string, imageUrl: string): Promise<PostResponse> {
    try {
      const response = await api.delete(`/posts/${postId}/images`, {
        params: { imageUrl },
      });
      return response.data;
    } catch (error: any) {
      console.error("Remove image error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to remove image",
      };
    }
  },

  /**
   * Lấy posts của user
   */
  async getUserPosts(userId: string): Promise<PostsResponse> {
    try {
      const response = await api.get(`/posts/user/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error("Get user posts error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to load user posts",
      };
    }
  },

  /**
   * Toggle like on a post
   */
  async toggleLike(postId: number): Promise<{ success: boolean; isLiked: boolean; likeCount: number; message?: string }> {
    try {
      const response = await api.post(`/posts/${postId}/like`);
      return response.data;
    } catch (error: any) {
      console.error("Toggle like error:", error);
      return {
        success: false,
        isLiked: false,
        likeCount: 0,
        message: error.response?.data?.message || "Failed to toggle like",
      };
    }
  },

  /**
   * Get like count for a post
   */
  async getLikes(postId: number): Promise<{ success: boolean; likeCount: number; message?: string }> {
    try {
      const response = await api.get(`/posts/${postId}/likes`);
      return response.data;
    } catch (error: any) {
      console.error("Get likes error:", error);
      return {
        success: false,
        likeCount: 0,
        message: error.response?.data?.message || "Failed to get likes",
      };
    }
  },

  /**
   * Add comment to a post
   */
  async addComment(postId: number, content: string): Promise<{ success: boolean; comment?: any; message?: string }> {
    try {
      const response = await api.post(`/posts/${postId}/comments`, { content });
      const data = response.data;
      
      // Transform flat CommentDTO to nested Comment structure
      if (data.success && data.comment) {
        data.comment = {
          id: data.comment.id,
          postId: data.comment.postId,
          content: data.comment.content,
          createdAt: data.comment.createdAt,
          user: {
            id: data.comment.userId,
            email: data.comment.email,
            fullName: data.comment.fullName,
            avatar: data.comment.avatar,
          },
        };
      }
      
      return data;
    } catch (error: any) {
      console.error("Add comment error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to add comment",
      };
    }
  },

  /**
   * Get comments for a post
   */
  async getComments(postId: number): Promise<{ success: boolean; comments?: any[]; message?: string }> {
    try {
      const response = await api.get(`/posts/${postId}/comments`);
      const data = response.data;
      
      // Transform flat CommentDTO to nested Comment structure
      if (data.success && data.comments) {
        data.comments = data.comments.map((comment: any) => ({
          id: comment.id,
          postId: comment.postId,
          content: comment.content,
          createdAt: comment.createdAt,
          user: {
            id: comment.userId,
            email: comment.email,
            fullName: comment.fullName,
            avatar: comment.avatar,
          },
        }));
      }
      
      return data;
    } catch (error: any) {
      console.error("Get comments error:", error);
      return {
        success: false,
        comments: [],
        message: error.response?.data?.message || "Failed to get comments",
      };
    }
  },

  /**
   * Delete a comment
   */
  async deleteComment(commentId: number): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await api.delete(`/posts/comments/${commentId}`);
      return response.data;
    } catch (error: any) {
      console.error("Delete comment error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete comment",
      };
    }
  },
};

