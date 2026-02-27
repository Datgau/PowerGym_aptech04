import {type StoryItem, storyService} from "../services/storyService.ts";
import {useEffect, useState, useCallback} from "react";

interface UseGymStoryReturn {
    storiesData: StoryItem[];
    loading: boolean;
    error: string | null;
    refetchStories: () => Promise<void>;
}

export const useGymStory = (): UseGymStoryReturn => {
    const [storiesData, setStories] = useState<StoryItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await storyService.fetchStories();
            if (response.success && response.data) {
                setStories(response.data);
            } else {
                setError('Failed to fetch stories');
            }
        } catch (err) {
            setError('An error occurred while fetching stories');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStories();
    }, [fetchStories]);

    return {
        storiesData,
        loading,
        error,
        refetchStories: fetchStories
    };
};