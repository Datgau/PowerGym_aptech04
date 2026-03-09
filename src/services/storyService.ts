// câu chuyện hội viên
import type {ApiResponse, PageResponse} from "../@type/apiResponse.ts";
import {publicClient} from "./api.ts";
import privateClient from "./api.ts";

export interface StoryItem {
    readonly id: string;
    readonly userId: string;
    readonly title: string;
    readonly content: string;
    readonly imageUrl: string;
    readonly userName: string;
    readonly userAvatar: string;
    readonly createdAt: string;
    readonly expiresAt?: string;
    readonly tag?:  string;
    readonly readTime?: string;
    readonly status?: string; // PENDING, APPROVED, REJECTED
    readonly timeAgo?: string;
    readonly likeCount?: number;
    readonly commentCount?: number;
    readonly shareCount?: number; // New field for share count
    readonly isLikedByCurrentUser?: boolean;
}

export interface StoryComment {
    readonly id: string;
    readonly user: {
        readonly id: string;
        readonly fullName: string;
        readonly email: string;
        readonly avatar?: string;
    };
    readonly content: string;
    readonly createdAt: string;
    readonly updatedAt?: string;
    readonly timeAgo?: string;
}

export interface CreateStoryRequest {
    image: File;
    title?: string;
    content?: string;
    tag?: string;
}

export const storyService = {
    /**
     * Fetch approved stories from the API (public) with pagination
     */
    fetchStories: async (
        page: number = 0,
        size: number = 10
    ): Promise<ApiResponse<PageResponse<StoryItem>>> => {
        const response = await publicClient.get<ApiResponse<PageResponse<StoryItem>>>('/stories/paginated', {
            params: { page, size }
        });
        return response.data;
    },

    /**
     * Fetch approved stories from the API (public) - without pagination (legacy)
     */
    fetchStoriesLegacy: async (): Promise<ApiResponse<StoryItem[]>> => {
        const response = await publicClient.get<ApiResponse<StoryItem[]>>('/stories');
        return response.data;
    },

    /**
     * Get a single story by ID (public)
     */
    getStoryById: async (storyId: string): Promise<ApiResponse<StoryItem>> => {
        const response = await publicClient.get<ApiResponse<StoryItem>>(`/stories/${storyId}`);
        return response.data;
    },

    /**
     * Create a new story (requires authentication)
     */
    createStory: async (data: CreateStoryRequest): Promise<ApiResponse<StoryItem>> => {
        const formData = new FormData();
        formData.append('image', data.image);
        if (data.title) formData.append('title', data.title);
        if (data.content) formData.append('content', data.content);
        if (data.tag) formData.append('tag', data.tag);

        const response = await privateClient.post<ApiResponse<StoryItem>>('/stories', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    /**
     * Update an existing story (requires authentication)
     */
    updateStory: async (storyId: string, data: CreateStoryRequest): Promise<ApiResponse<StoryItem>> => {
        const formData = new FormData();
        if (data.image) formData.append('image', data.image);
        if (data.title) formData.append('title', data.title);
        if (data.content) formData.append('content', data.content);
        if (data.tag) formData.append('tag', data.tag);

        const response = await privateClient.put<ApiResponse<StoryItem>>(`/stories/${storyId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    /**
     * Get my stories (requires authentication) with pagination
     */
    getMyStories: async (
        page: number = 0,
        size: number = 10
    ): Promise<ApiResponse<PageResponse<StoryItem>>> => {
        const response = await privateClient.get<ApiResponse<PageResponse<StoryItem>>>('/stories/my-stories/paginated', {
            params: { page, size }
        });
        return response.data;
    },

    /**
     * Get my stories (requires authentication) - without pagination (legacy)
     */
    getMyStoriesLegacy: async (): Promise<ApiResponse<StoryItem[]>> => {
        const response = await privateClient.get<ApiResponse<StoryItem[]>>('/stories/my-stories');
        return response.data;
    },

    /**
     * Delete a story (requires authentication)
     */
    deleteStory: async (storyId: string): Promise<ApiResponse<void>> => {
        const response = await privateClient.delete<ApiResponse<void>>(`/stories/${storyId}`);
        return response.data;
    },

    // ==================== LIKE METHODS ====================

    /**
     * Like a story (requires authentication)
     */
    likeStory: async (storyId: string): Promise<ApiResponse<void>> => {
        const response = await privateClient.post<ApiResponse<void>>(`/stories/${storyId}/like`);
        return response.data;
    },

    /**
     * Unlike a story (requires authentication)
     */
    unlikeStory: async (storyId: string): Promise<ApiResponse<void>> => {
        const response = await privateClient.delete<ApiResponse<void>>(`/stories/${storyId}/like`);
        return response.data;
    },

    // ==================== COMMENT METHODS ====================

    /**
     * Get comments for a story with pagination
     */
    getStoryComments: async (
        storyId: string,
        page: number = 0,
        size: number = 10
    ): Promise<ApiResponse<PageResponse<StoryComment>>> => {
        const response = await publicClient.get<ApiResponse<PageResponse<StoryComment>>>(`/stories/${storyId}/comments/paginated`, {
            params: { page, size }
        });
        return response.data;
    },

    /**
     * Get comments for a story without pagination
     */
    getStoryCommentsLegacy: async (storyId: string): Promise<ApiResponse<StoryComment[]>> => {
        const response = await publicClient.get<ApiResponse<StoryComment[]>>(`/stories/${storyId}/comments`);
        return response.data;
    },

    /**
     * Add a comment to a story (requires authentication)
     */
    addComment: async (storyId: string, content: string): Promise<ApiResponse<StoryComment>> => {
        const response = await privateClient.post<ApiResponse<StoryComment>>(`/stories/${storyId}/comments`, {
            content
        });
        return response.data;
    },

    /**
     * Delete a comment (requires authentication)
     */
    deleteComment: async (commentId: string): Promise<ApiResponse<void>> => {
        const response = await privateClient.delete<ApiResponse<void>>(`/stories/comments/${commentId}`);
        return response.data;
    },

    // ==================== ADMIN METHODS ====================

    /**
     * Get pending stories (admin only) with pagination
     */
    getPendingStories: async (
        page: number = 0,
        size: number = 10
    ): Promise<ApiResponse<PageResponse<StoryItem>>> => {
        const response = await privateClient.get<ApiResponse<PageResponse<StoryItem>>>('/stories/admin/pending/paginated', {
            params: { page, size }
        });
        return response.data;
    },

    /**
     * Get pending stories (admin only) - without pagination (legacy)
     */
    getPendingStoriesLegacy: async (): Promise<ApiResponse<StoryItem[]>> => {
        const response = await privateClient.get<ApiResponse<StoryItem[]>>('/stories/admin/pending');
        return response.data;
    },

    /**
     * Approve a story (admin only)
     */
    approveStory: async (storyId: string): Promise<ApiResponse<StoryItem>> => {
        const response = await privateClient.put<ApiResponse<StoryItem>>(
            `/stories/admin/${storyId}/approve`,
            {}
        );
        return response.data;
    },

    /**
     * Reject a story (admin only)
     */
    rejectStory: async (storyId: string): Promise<ApiResponse<void>> => {
        const response = await privateClient.put<ApiResponse<void>>(
            `/stories/admin/${storyId}/reject`,
            {}
        );
        return response.data;
    },

    /**
     * Count pending stories (admin only)
     */
    countPendingStories: async (): Promise<ApiResponse<number>> => {
        const response = await privateClient.get<ApiResponse<number>>('/stories/admin/pending/count');
        return response.data;
    },

    /**
     * Count approved stories (admin only)
     */
    countApprovedStories: async (): Promise<ApiResponse<number>> => {
        const response = await privateClient.get<ApiResponse<number>>('/stories/admin/approved/count');
        return response.data;
    },

    /**
     * Count rejected stories (admin only)
     */
    countRejectedStories: async (): Promise<ApiResponse<number>> => {
        const response = await privateClient.get<ApiResponse<number>>('/stories/admin/rejected/count');
        return response.data;
    },

    /**
     * Get all stories for admin (all statuses) with pagination
     */
    getAllStoriesForAdmin: async (
        page: number = 0,
        size: number = 10
    ): Promise<ApiResponse<PageResponse<StoryItem>>> => {
        const response = await privateClient.get<ApiResponse<PageResponse<StoryItem>>>('/stories/admin/all/paginated', {
            params: { page, size }
        });
        return response.data;
    },

    /**
     * Get all stories for admin (all statuses) - without pagination (legacy)
     */
    getAllStoriesForAdminLegacy: async (): Promise<ApiResponse<StoryItem[]>> => {
        const response = await privateClient.get<ApiResponse<StoryItem[]>>('/stories/admin/all');
        return response.data;
    },

    /**
     * Get stories by status with pagination
     */
    getStoriesByStatus: async (
        status: 'PENDING' | 'APPROVED' | 'REJECTED',
        page: number = 0,
        size: number = 10
    ): Promise<ApiResponse<PageResponse<StoryItem>>> => {
        const response = await privateClient.get<ApiResponse<PageResponse<StoryItem>>>(`/stories/admin/status/${status}/paginated`, {
            params: { page, size }
        });
        return response.data;
    },

    /**
     * Get stories by status - without pagination (legacy)
     */
    getStoriesByStatusLegacy: async (
        status: 'PENDING' | 'APPROVED' | 'REJECTED'
    ): Promise<ApiResponse<StoryItem[]>> => {
        const response = await privateClient.get<ApiResponse<StoryItem[]>>(`/stories/admin/status/${status}`);
        return response.data;
    },

    /**
     * Update story status (admin only)
     */
    updateStoryStatus: async (
        storyId: string,
        status: 'PENDING' | 'APPROVED' | 'REJECTED'
    ): Promise<ApiResponse<StoryItem>> => {
        const response = await privateClient.put<ApiResponse<StoryItem>>(
            `/stories/admin/${storyId}/status`,
            null,
            { params: { status } }
        );
        return response.data;
    }
}
