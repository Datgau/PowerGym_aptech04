// câu chuyện hội viên
import type {ApiResponse} from "../@type/apiResponse.ts";
import {publicClient} from "./api.ts";

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

}

export const storyService = {
    /**
     * Fetch stories from the API
     */
    fetchStories: async (): Promise<ApiResponse<StoryItem[]>> => {
        const response = await publicClient.get<ApiResponse<StoryItem[]>>('/gym/stories/active');
        return response.data;
    }
}