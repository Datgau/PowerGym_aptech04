import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  OpenInNew,
  Schedule,
  Person,
} from '@mui/icons-material';
import type { NewsArticle } from '../../services/newsService';

interface NewsCardProps {
  article: NewsArticle;
  variant?: 'default' | 'featured' | 'compact';
}

const NewsCard: React.FC<NewsCardProps> = ({ article, variant = 'default' }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const handleCardClick = () => {
    window.open(article.url, '_blank', 'noopener,noreferrer');
  };

  const cardHeight = variant === 'featured' ? 400 : variant === 'compact' ? 300 : 350;
  const imageHeight = variant === 'featured' ? 200 : variant === 'compact' ? 120 : 160;

  return (
    <Card
      sx={{
        height: cardHeight,
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        },
        '&:active': {
          transform: 'translateY(-4px)',
        },
      }}
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height={imageHeight}
          image={article.urlToImage}
          alt={article.title}
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
          onError={(e) => {
            e.currentTarget.src = '/images/default-news.jpg';
          }}
        />
        
        {/* Source Badge */}
        <Chip
          label={article.source.name}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        />

        {/* External Link Icon */}
        <Tooltip title="Đọc bài viết gốc">
          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#00b4ff',
              width: 32,
              height: 32,
              '&:hover': {
                background: 'white',
                transform: 'scale(1.1)',
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            <OpenInNew fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Content Section */}
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
        {/* Title */}
        <Typography
          variant={variant === 'featured' ? 'h6' : 'subtitle1'}
          component="h3"
          sx={{
            fontWeight: 700,
            lineHeight: 1.3,
            mb: 1,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: variant === 'compact' ? 2 : 3,
            WebkitBoxOrient: 'vertical',
            color: '#1a1a1a',
          }}
        >
          {article.title}
        </Typography>

        {/* Description */}
        {article.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              flex: 1,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: variant === 'compact' ? 2 : 3,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.5,
              mb: 2,
            }}
          >
            {article.description}
          </Typography>
        )}

        {/* Footer */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 'auto',
            pt: 1,
            borderTop: '1px solid #f0f0f0',
          }}
        >
          {/* Date */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Schedule sx={{ fontSize: 16, color: '#666' }} />
            <Typography variant="caption" color="text.secondary">
              {formatDate(article.publishedAt)}
            </Typography>
          </Box>

          {/* Author */}
          {article.author && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Person sx={{ fontSize: 16, color: '#666' }} />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  maxWidth: 100,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {article.author}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default NewsCard;