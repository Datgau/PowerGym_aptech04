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
    }
}
