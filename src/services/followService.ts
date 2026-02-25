import api from "./api";
import type {ApiResponse} from "../@type/apiResponse.ts";

export type FollowResponse = ApiResponse<null>;
export type IsFollowingResponse = ApiResponse<boolean>;


export const FollowService = {

    async followUser(userId: number): Promise<FollowResponse> {
        try {
            const response = await api.post<FollowResponse>(
                `/users/${userId}/follow`
            );
            return response.data;
        } catch (error: any) {
            console.error("Follow user error:", error);

            return {
                success: false,
                message: error.response?.data?.message || "Failed to follow user",
                data: null,
                status: error.response?.status || 500,
            };
        }
    },


    // Check follow
    async isFollowing(userId: number): Promise<IsFollowingResponse> {
        const response = await api.get<IsFollowingResponse>(
            `/users/${userId}/is-following`
        );
        return response.data;
    },

    // check follow nhau chưa
    async checkMutualFollow(userId: number): Promise<IsFollowingResponse> {
        const response = await api.get<IsFollowingResponse>(
            `/users/${userId}/is-mutual`
        );
        return response.data;
    },

    /**
     * Unfollow người khác
     */
    async unfollowUser(userId: number): Promise<FollowResponse> {
        try {
            const response = await api.delete<FollowResponse>(
                `/users/${userId}/unfollow`
            );
            return response.data;
        } catch (error: any) {
            console.error("Unfollow user error:", error);

            return {
                success: false,
                message: error.response?.data?.message || "Failed to unfollow user",
                data: null,
                status: error.response?.status || 500,
            };
        }
    },
};
