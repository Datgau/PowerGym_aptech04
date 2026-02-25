import { useState, useEffect, useCallback } from 'react';
import { newsService, type NewsArticle, type NewsResponse } from '../services/newsService';

interface UseNewsReturn {
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  searchNews: (query: string) => Promise<void>;
}

export const useNews = (): UseNewsReturn => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response: NewsResponse = await newsService.getNews();
      
      if (response.status === 'ok') {
        setArticles(response.articles);
      } else {
        throw new Error('Failed to fetch news');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải tin tức';
      setError(errorMessage);
      console.error('Error fetching news:', err);
      
      // Try to load fallback data
      try {
        const fallbackResponse = await newsService.getNews();
        setArticles(fallbackResponse.articles);
      } catch (fallbackErr) {
        console.error('Fallback also failed:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchNews();
  }, [fetchNews]);

  const searchNews = useCallback(async (query: string) => {
    // For now, just refresh the news since we're focusing on Vietnamese gym news
    // In a real implementation, you could filter the existing articles by the query
    console.log('Searching for:', query);
    await refresh();
  }, [refresh]);

  // Initial load
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return {
    articles,
    loading,
    error,
    refresh,
    searchNews,
  };
};

// Hook for trending news (simplified - uses same data as main news)
export const useTrendingNews = () => {
  const { articles, loading, error } = useNews();

  return {
    trendingArticles: articles,
    loading,
    error,
  };
};