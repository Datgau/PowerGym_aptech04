import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Alert,
  Skeleton,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import NewsCard from './NewsCard';
import type { NewsArticle } from '../../services/newsService';

interface NewsGridProps {
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  title?: string;
}

const NewsGrid: React.FC<NewsGridProps> = ({
  articles,
  loading,
  error,
  onRefresh,
  title = 'Tin tức Gym & Fitness Quốc tế',
}) => {
  const renderSkeleton = () => (
    <Grid container spacing={3}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
          <Box>
            <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 1 }} />
            <Skeleton variant="text" height={32} sx={{ mt: 1 }} />
            <Skeleton variant="text" height={20} />
            <Skeleton variant="text" height={20} width="60%" />
          </Box>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 700,
            color: '#1a1a1a',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: 0,
              width: 60,
              height: 4,
              background: 'linear-gradient(90deg, #00b4ff, #0066ff)',
              borderRadius: 2,
            },
          }}
        >
          {title}
        </Typography>

        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={onRefresh}
          disabled={loading}
          sx={{
            borderColor: '#00b4ff',
            color: '#00b4ff',
            '&:hover': {
              borderColor: '#0066ff',
              background: 'rgba(0, 180, 255, 0.1)',
            },
          }}
        >
          Làm mới
        </Button>
      </Box>

      {/* Error State */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={onRefresh}>
              Thử lại
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {loading && articles.length === 0 ? (
        renderSkeleton()
      ) : (
        <>
          <Grid container spacing={3}
          sx={{ mb: 10 }}>
            {articles.map((article, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={article.id}>
                <NewsCard
                  article={article}
                  variant={index === 0 ? 'featured' : 'default'}
                />
              </Grid>
            ))}
          </Grid>

          {articles.length === 0 && !loading && (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                background: 'linear-gradient(135deg, #f8f9ff, #e3f2fd)',
                borderRadius: 3,
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Chưa có tin tức nào
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Hiện tại chưa có tin tức về gym. Vui lòng thử lại sau.
              </Typography>
              <Button
                variant="contained"
                onClick={onRefresh}
                sx={{
                  background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
                }}
              >
                Tải lại
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default NewsGrid;