import React from 'react';
import {
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

const BRAND_BORDER = '#1366ba';

const NewsCard: React.FC<NewsCardProps> = ({ article, variant = 'default' }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const handleCardClick = () => {
        window.open(article.url, '_blank', 'noopener,noreferrer');
    };

    const imageHeight = variant === 'featured' ? 200 : variant === 'compact' ? 120 : 160;

    return (
        <Box
            onClick={handleCardClick}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                borderRadius: '12px',
                overflow: 'hidden',
                background: '#fff',
                // Border using outline so it's never clipped by overflow:hidden
                outline: `1.5px solid ${BRAND_BORDER}`,
                outlineOffset: '-1.5px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease, outline-color 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 16px 40px rgba(19,102,186,0.25)',
                    outline: `2px solid #00b4ff`,
                    outlineOffset: '-2px',
                },
                '&:active': {
                    transform: 'translateY(-2px)',
                },
            }}
        >
            {/* ── Image ── */}
            <Box sx={{ position: 'relative', flexShrink: 0 }}>
                <CardMedia
                    component="img"
                    height={imageHeight}
                    image={article.urlToImage}
                    alt={article.title}
                    sx={{
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.4s ease',
                        '&:hover': { transform: 'scale(1.04)' },
                    }}
                    onError={(e) => {
                        e.currentTarget.src = '/images/default-news.jpg';
                    }}
                />

                {/* Gradient overlay */}
                <Box sx={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.35) 100%)',
                    pointerEvents: 'none',
                }} />

                {/* Source badge */}
                <Chip
                    label={article.source.name}
                    size="small"
                    sx={{
                        position: 'absolute', top: 12, left: 12,
                        background: 'rgba(0,0,0,0.72)',
                        backdropFilter: 'blur(6px)',
                        color: '#fff',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        border: '1px solid rgba(255,255,255,0.15)',
                        letterSpacing: 0.5,
                    }}
                />

                {/* Open link button */}
                <Tooltip title="Read original article">
                    <IconButton
                        size="small"
                        sx={{
                            position: 'absolute', top: 8, right: 8,
                            background: 'rgba(255,255,255,0.92)',
                            backdropFilter: 'blur(4px)',
                            color: BRAND_BORDER,
                            width: 30, height: 30,
                            transition: 'background 0.2s, transform 0.2s',
                            '&:hover': {
                                background: '#fff',
                                transform: 'scale(1.12)',
                                color: '#00b4ff',
                            },
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick();
                        }}
                    >
                        <OpenInNew sx={{ fontSize: 15 }} />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* ── Content ── */}
            <CardContent
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    p: '16px !important',
                }}
            >
                {/* Title */}
                <Typography
                    variant={variant === 'featured' ? 'h6' : 'subtitle1'}
                    component="h3"
                    sx={{
                        fontWeight: 700,
                        lineHeight: 1.35,
                        mb: 1,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: variant === 'compact' ? 2 : 3,
                        WebkitBoxOrient: 'vertical',
                        color: '#0d1b2a',
                        fontSize: variant === 'featured' ? '1.05rem' : '0.95rem',
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
                            lineHeight: 1.6,
                            mb: 1.5,
                            fontSize: '0.82rem',
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
                        pt: 1.5,
                        borderTop: `1px solid rgba(19,102,186,0.12)`,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Schedule sx={{ fontSize: 14, color: '#1366ba' }} />
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                            {formatDate(article.publishedAt)}
                        </Typography>
                    </Box>

                    {article.author && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Person sx={{ fontSize: 14, color: '#1366ba' }} />
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                fontWeight={500}
                                sx={{
                                    maxWidth: 110,
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
        </Box>
    );
};

export default NewsCard;