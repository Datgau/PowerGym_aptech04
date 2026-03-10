import React from 'react';
import {
    Box,
    Grid,
    Typography,
    Button,
    Alert,
    Skeleton,
    Chip,
} from '@mui/material';
import { Refresh, AutoAwesome } from '@mui/icons-material';
import NewsCard from './NewsCard';
import type { NewsArticle } from '../../services/newsService';

interface NewsGridProps {
    articles: NewsArticle[];
    loading: boolean;
    error: string | null;
    onRefresh: () => void;
    title?: string;
}

const BRAND_GRADIENT = 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)';
const BRAND_BORDER = '#1366ba';

const NewsGrid: React.FC<NewsGridProps> = ({
                                               articles,
                                               loading,
                                               error,
                                               onRefresh,
                                               title = 'News Gym & Fitness of the world',
                                           }) => {
    const renderSkeleton = () => (
        <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                    <Box
                        sx={{
                            borderRadius: 3,
                            overflow: 'hidden',
                            background: '#fff',
                            border: `1.5px solid ${BRAND_BORDER}`,
                            height: '100%',
                        }}
                    >
                        <Skeleton variant="rectangular" height={180} sx={{ transform: 'none' }} />
                        <Box sx={{ p: 2.5 }}>
                            <Skeleton variant="text" height={28} sx={{ mb: 1 }} />
                            <Skeleton variant="text" height={18} />
                            <Skeleton variant="text" height={18} width="70%" />
                        </Box>
                    </Box>
                </Grid>
            ))}
        </Grid>
    );

    return (
        <Box>
            {/* ── Header ── */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 5,
                    pb: 4,
                    borderBottom: '1px solid rgba(0,0,0,0.07)',
                }}
            >
                <Box>
                    <Chip
                        icon={<AutoAwesome sx={{ fontSize: '14px !important' }} />}
                        label="Latest News"
                        size="small"
                        sx={{
                            background: 'rgba(0,180,255,0.1)',
                            color: '#045668',
                            fontWeight: 700,
                            fontSize: '0.68rem',
                            letterSpacing: 1,
                            textTransform: 'uppercase',
                            border: '1px solid rgba(0,180,255,0.25)',
                            mb: 1.5,
                            '& .MuiChip-icon': { color: '#00b4ff' },
                        }}
                    />
                    <Typography
                        variant="h4"
                        component="h2"
                        sx={{
                            fontWeight: 800,
                            color: '#0d1b2a',
                            fontSize: { xs: '1.5rem', md: '2rem' },
                            lineHeight: 1.2,
                            letterSpacing: '-0.3px',
                            maxWidth: 520,
                        }}
                    >
                        {title}
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={onRefresh}
                    disabled={loading}
                    sx={{
                        mt: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        borderColor: 'rgba(0,0,0,0.15)',
                        color: '#444',
                        whiteSpace: 'nowrap',
                        '&:hover': {
                            borderColor: '#00b4ff',
                            color: '#045668',
                            background: 'rgba(0,180,255,0.06)',
                        },
                    }}
                >
                    Refresh
                </Button>
            </Box>

            {/* ── Error ── */}
            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3, borderRadius: 2 }}
                    action={
                        <Button color="inherit" size="small" onClick={onRefresh}>
                            Try Again
                        </Button>
                    }
                >
                    {error}
                </Alert>
            )}

            {/* ── Content ── */}
            {loading && articles.length === 0 ? (
                renderSkeleton()
            ) : (
                <>
                    <Grid container spacing={3} alignItems="stretch" sx={{ mb: 10 }}>
                        {articles.map((article, index) => (
                            <Grid
                                size={{ xs: 12, sm: 6, md: 4 }}
                                key={article.id}
                                sx={{ display: 'flex' }}
                            >
                                <Box
                                    sx={{
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        animationName: 'newsCardIn',
                                        animationDuration: '0.45s',
                                        animationFillMode: 'both',
                                        animationDelay: `${index * 0.06}s`,
                                        '@keyframes newsCardIn': {
                                            from: { opacity: 0, transform: 'translateY(20px)' },
                                            to: { opacity: 1, transform: 'translateY(0)' },
                                        },
                                        borderRadius: '12px',
                                        // outline stays outside the content, never clipped
                                        outline: `1.5px solid transparent`,
                                        outlineOffset: '-1.5px',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease, outline-color 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 16px 40px rgba(19,102,186,0.25)',
                                            outlineOffset: '-2px',
                                        },
                                        // clip children without clipping the outline
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            inset: 0,
                                            borderRadius: '12px',
                                            pointerEvents: 'none',
                                        },
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '& > *': { flex: 1, display: 'flex', flexDirection: 'column' },
                                    }}
                                >
                                    <NewsCard
                                        article={article}
                                        variant={index === 0 ? 'featured' : 'default'}
                                    />
                                </Box>
                            </Grid>
                        ))}
                    </Grid>

                    {articles.length === 0 && !loading && (
                        <Box
                            sx={{
                                textAlign: 'center',
                                py: 10,
                                borderRadius: 4,
                                background: '#f4f6f9',
                                border: `1.5px dashed ${BRAND_BORDER}`,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 64, height: 64, borderRadius: '50%',
                                    background: BRAND_GRADIENT,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    mx: 'auto', mb: 2.5,
                                    boxShadow: '0 8px 24px rgba(4,86,104,0.25)',
                                }}
                            >
                                <Refresh sx={{ color: '#fff', fontSize: 28 }} />
                            </Box>
                            <Typography variant="h6" fontWeight={700} color="text.primary" gutterBottom>
                                No News Available
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 320, mx: 'auto' }}>
                                There are no gym news articles available at the moment. Please try again later.
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={onRefresh}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    px: 4,
                                    background: BRAND_GRADIENT,
                                    boxShadow: '0 4px 16px rgba(4,86,104,0.3)',
                                    '&:hover': { boxShadow: '0 8px 24px rgba(4,86,104,0.4)', background: BRAND_GRADIENT },
                                }}
                            >
                                Reload
                            </Button>
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};

export default NewsGrid;