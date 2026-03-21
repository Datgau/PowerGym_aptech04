import React, { useRef, useState } from 'react';
import { Box, Container, Button, Snackbar, Alert, Typography } from '@mui/material';
import { Add as AddIcon, AutoStories } from '@mui/icons-material';
import StoryCard from './StoryCard.tsx';
import ViewMoreCard from './ViewMoreCard.tsx';
import CarouselNavigation from './CarouselNavigation.tsx';
import ShareStoryModal from './ShareStoryModal.tsx';
import { useCarousel } from '../../../hooks/useCarousel.ts';
import type { StoryItem } from "../../../services/storyService.ts";
import { useAuth } from "../../../hooks/useAuth.ts";
import { useNavigate } from "react-router-dom";
import EmptyState from "../../../components/Notifications/EmptyState.tsx";

interface StoriesSectionProps {
    readonly stories: readonly StoryItem[];
    readonly onStoryClick: (storyId: string) => void;
    readonly onStoriesUpdate?: () => void;
}

const StoriesSection: React.FC<StoriesSectionProps> = ({ stories, onStoriesUpdate }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const { requireAuth } = useAuth();
    const navigate = useNavigate();
    const maxStories = 5;
    const displayStories = stories.slice(0, maxStories);
    const hasMoreStories = stories.length > maxStories;

    const totalItems = hasMoreStories ? displayStories.length + 1 : displayStories.length;

    const {
        currentIndex,
        itemsPerView,
        maxIndex,
        handlePrevious,
        handleNext,
    } = useCarousel({ totalItems });

    const handleViewMore = () => navigate('/stories');

    const handleStoryClick = (storyId: string) => navigate(`/stories/${storyId}`);

    const handleShareClick = () => {
        if (!requireAuth()) return;
        setShareModalOpen(true);
    };

    const handleShareSuccess = () => {
        setSnackbarMessage('Story submitted successfully! It will appear after admin approval.');
        setSnackbarOpen(true);
        if (onStoriesUpdate) onStoriesUpdate();
    };

    const getTransformValue = () => {
        if (hasMoreStories && currentIndex === maxIndex) {
            const lastSlideStartIndex = Math.max(0, totalItems - itemsPerView);
            return lastSlideStartIndex * (100 / itemsPerView);
        }
        return currentIndex * (100 / itemsPerView);
    };

    return (
            <Box
            component="section"
            sx={{
                py: { xs: 8, md: 12 },
                background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 50%, #f8f9fa 100%)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0, left: 0, right: 0, height: '100%',
                    background: `
            radial-gradient(circle at 80% 20%, rgba(0,180,255,0.06) 0%, transparent 50%),
            radial-gradient(circle at 10% 80%, rgba(0,102,255,0.05) 0%, transparent 50%)
          `,
                    pointerEvents: 'none',
                }
            }}
        >
            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>

                {/* ── Header ── */}
               
                <Box sx={{ mb: { xs: 6, md: 10 }, position: 'relative' }}>
                    {/* Big decorative background text */}
                    <Typography sx={{
                        position: 'absolute',
                        top: { xs: -20, md: -40 },
                        left: -10,
                        fontSize: { xs: '5rem', md: '10rem' },
                        fontWeight: 900,
                        color: 'rgba(0,102,255,0.04)',
                        lineHeight: 1,
                        userSelect: 'none',
                        pointerEvents: 'none',
                        letterSpacing: '-4px',
                        whiteSpace: 'nowrap',
                    }}>
                        STORIES
                    </Typography>

                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        {/* Pill badge */}
                        <Box sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 2.5,
                            px: 2.5, py: 0.8,
                            background: 'linear-gradient(135deg, rgba(0,180,255,0.1), rgba(0,102,255,0.1))',
                            borderRadius: '50px',
                            border: '1px solid rgba(0,180,255,0.2)',
                        }}>
                            <AutoStories sx={{ color: '#00b4ff', fontSize: 18 }} />
                            <Typography variant="overline" sx={{
                                color: '#00b4ff', fontWeight: 700,
                                letterSpacing: '0.12em', fontSize: '0.75rem',
                            }}>
                                MEMBER STORIES
                            </Typography>
                        </Box>

                        {/* Title + right side */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: { xs: 'flex-start', md: 'flex-end' },
                            justifyContent: 'space-between',
                            gap: 3,
                        }}>
                            <Box>
                                <Typography variant="h1" component="h2" sx={{
                                    fontWeight: 800,
                                    fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' },
                                    lineHeight: 1.1,
                                    letterSpacing: '-1px',
                                    background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    mb: 0,
                                }}>
                                    Real People,<br />
                                    <Box component="span" sx={{
                                        background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                    }}>Real Results</Box>
                                </Typography>
                            </Box>

                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: { xs: 'flex-start', md: 'flex-end' },
                                gap: 2,
                                mb: { md: 0.5 },
                            }}>
                                <Box sx={{ maxWidth: 300 }}>
                                    <Box sx={{
                                        width: 48, height: 3,
                                        background: 'linear-gradient(90deg, #00b4ff, #0066ff)',
                                        borderRadius: 2, mb: 1.5,
                                        ml: { xs: 0, md: 'auto' },
                                    }} />
                                    <Typography variant="body1" sx={{
                                        color: '#666', lineHeight: 1.75,
                                        fontSize: { xs: '0.95rem', md: '1rem' },
                                        fontWeight: 400,
                                        textAlign: { xs: 'left', md: 'right' },
                                    }}>
                                        Inspiring journeys from our community of athletes and fitness enthusiasts
                                    </Typography>
                                </Box>

                                {/* Share button — desktop */}
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={handleShareClick}
                                    sx={{
                                        display: { xs: 'none', sm: 'inline-flex' },
                                        background: 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)',
                                        color: '#fff',
                                        fontWeight: 700,
                                        fontSize: '0.85rem',
                                        px: 3, py: 1.2,
                                        borderRadius: '50px',
                                        boxShadow: '0 6px 20px rgba(4,86,104,0.35)',
                                        textTransform: 'none',
                                        letterSpacing: 0,
                                        '&:hover': {
                                            boxShadow: '0 10px 28px rgba(4,86,104,0.45)',
                                            transform: 'translateY(-2px)',
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    Share Your Story
                                </Button>
                            </Box>
                        </Box>

                        {/* Share button — mobile */}
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleShareClick}
                            fullWidth
                            sx={{
                                display: { xs: 'flex', sm: 'none' },
                                mt: 3,
                                background: 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)',
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                py: 1.5,
                                borderRadius: '50px',
                                boxShadow: '0 6px 20px rgba(4,86,104,0.3)',
                                textTransform: 'none',
                                '&:hover': {
                                    boxShadow: '0 10px 28px rgba(4,86,104,0.45)',
                                    transform: 'translateY(-2px)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            Share Your Story
                        </Button>
                    </Box>
                </Box>

                {/* ── Carousel ── */}
                <Box sx={{ position: 'relative' }}>
                    {stories.length === 0 ? (
                        <EmptyState onAction={handleShareClick} />
                    ) : (
                <>
                    <CarouselNavigation
                        currentIndex={currentIndex}
                        maxIndex={maxIndex}
                        onPrevious={handlePrevious}
                        onNext={handleNext}
                    />

                    <Box
                        ref={scrollContainerRef}
                        sx={{
                            overflow: 'hidden',
                            mx: { xs: 0, sm: 2 },
                            px: { xs: 1, sm: 0 },
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                transform: `translateX(-${getTransformValue()}%)`,
                                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                gap: { xs: 2, sm: 2.5, md: 3 },
                            }}
                        >
                            {displayStories.map((story) => (
                                <Box
                                    key={story.id}
                                    sx={{
                                        flex: `0 0 calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * (24 / itemsPerView)}px)`,
                                        maxWidth: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * (24 / itemsPerView)}px)`,
                                        minWidth: 0,
                                        borderRadius: '20px',
                                        overflow: 'hidden',
                                        outline: '1.5px solid #1366ba',
                                        outlineOffset: '-1.5px',
                                        transition: 'transform 0.35s cubic-bezier(.22,.97,.44,1), box-shadow 0.35s ease, outline-color 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 20px 48px rgba(19,102,186,0.22)',
                                            outline: '2px solid #00b4ff',
                                            outlineOffset: '-2px',
                                        },
                                    }}
                                >
                                    <StoryCard
                                        story={story}
                                        onClick={() => handleStoryClick(story.id)}
                                    />
                                </Box>
                            ))}

                            {hasMoreStories && (
                                <Box
                                    sx={{
                                        flex: `0 0 calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * (24 / itemsPerView)}px)`,
                                        maxWidth: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * (24 / itemsPerView)}px)`,
                                        minWidth: 0,
                                        borderRadius: '20px',
                                        overflow: 'hidden',
                                        outline: '1.5px solid #1366ba',
                                        outlineOffset: '-1.5px',
                                        transition: 'transform 0.35s cubic-bezier(.22,.97,.44,1), box-shadow 0.35s ease, outline-color 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 20px 48px rgba(19,102,186,0.22)',
                                            outline: '2px solid #00b4ff',
                                            outlineOffset: '-2px',
                                        },
                                    }}
                                >
                                    <ViewMoreCard
                                        onClick={handleViewMore}
                                        totalStories={stories.length}
                                    />
                                </Box>
                            )}
                        </Box>
                    </Box>
                </>
                )}
                </Box>

            </Container>

            {/* Share Story Modal */}
            <ShareStoryModal
                open={shareModalOpen}
                onClose={() => setShareModalOpen(false)}
                onSuccess={handleShareSuccess}
            />

            {/* Success Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity="success"
                    sx={{ width: '100%', borderRadius: 2 }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default StoriesSection;