import {type StoryItem, storyService} from "../services/storyService.ts";
import {useEffect, useState} from "react";

interface UseGymStoryReturn {
    storiesData: StoryItem[];
    loading: boolean;
    error: string | null;
}

export const useGymStory = (): UseGymStoryReturn => {
    const [storiesData, setStories] = useState<StoryItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStories = async () => {
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
        };
        fetchStories();
    }, []);

    return {
        storiesData,
        loading,
        error
    };
};