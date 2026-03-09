import React, { useRef, useState } from 'react';
import { Box, Container, Button, Snackbar, Alert } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import StoryCard from './StoryCard.tsx';
import ViewMoreCard from './ViewMoreCard.tsx';
import CarouselNavigation from './CarouselNavigation.tsx';
import DotsIndicator from './DotsIndicator.tsx';
import SectionHeader from './SectionHeader.tsx';
import ShareStoryModal from './ShareStoryModal.tsx';
import { useCarousel } from '../../../hooks/useCarousel.ts';
import type {StoryItem} from "../../../services/storyService.ts";
import {useAuth} from "../../../hooks/useAuth.ts";
import {useNavigate} from "react-router-dom";

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
    setCurrentIndex
  } = useCarousel({ totalItems });
  
  const handleViewMore = () => {
    navigate('/stories');
  };

  const handleStoryClick = (storyId: string) => {
    navigate(`/stories/${storyId}`);
  };

  const handleShareClick = () => {
    if (!requireAuth()) return;
    setShareModalOpen(true);
  };

  const handleShareSuccess = () => {
    setSnackbarMessage('Story submitted successfully! It will appear after admin approval.');
    setSnackbarOpen(true);
    if (onStoriesUpdate) {
      onStoriesUpdate();
    }
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
        py: { xs: 8, md: 6 },
        background: 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradientShift 15s ease infinite',
        position: 'relative',
        overflow: 'hidden',
        '@keyframes gradientShift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        }
      }}
    >
      {/* Animated Background Shapes */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.15,
          pointerEvents: 'none',
          '&::before': {
            content: '""',
            position: 'absolute',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
            top: '-250px',
            left: '-250px',
            animation: 'float 20s ease-in-out infinite',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)',
            bottom: '-200px',
            right: '-200px',
            animation: 'float 15s ease-in-out infinite reverse',
          },
          '@keyframes float': {
            '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
            '33%': { transform: 'translate(30px, -30px) scale(1.1)' },
            '66%': { transform: 'translate(-20px, 20px) scale(0.9)' }
          }
        }}
      />

      {/* Decorative Grid Pattern */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          pointerEvents: 'none',
          opacity: 0.5
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header with Share Button */}
        <Box sx={{ position: 'relative', mb: 4 }}>
          <SectionHeader />
          
          {/* Share Story Button - Positioned absolutely to not affect layout */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              display: { xs: 'none', sm: 'block' }
            }}
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleShareClick}
              sx={{
                bgcolor: 'white',
                color: '#00b4ff',
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                '&:hover': {
                  bgcolor: '#f5f5f5',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Share Story
            </Button>
          </Box>
        </Box>

        {/* Mobile Share Button - Below header */}
        <Box
          sx={{
            display: { xs: 'block', sm: 'none' },
            mb: 3,
            textAlign: 'center'
          }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleShareClick}
            fullWidth
            sx={{
              bgcolor: 'white',
              color: '#00b4ff',
              fontWeight: 600,
              py: 1.5,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              '&:hover': {
                bgcolor: '#f5f5f5',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Share Your Story
          </Button>
        </Box>

        {/* Carousel Container */}
        <Box sx={{ position: 'relative' }}>
          <CarouselNavigation
            currentIndex={currentIndex}
            maxIndex={maxIndex}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />

          {/* Carousel Content */}
          <Box
            ref={scrollContainerRef}
            sx={{
              overflow: 'hidden',
              mx: { xs: 0, sm: 2 },
              px: { xs: 1, sm: 0 }
            }}
          >
            <Box
              sx={{
                display: 'flex',
                transform: `translateX(-${getTransformValue()}%)`,
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                gap: { xs: 2, sm: 2.5, md: 3 }
              }}
            >
              {displayStories.map((story) => (
                <Box
                  key={story.id}
                  sx={{
                    flex: `0 0 calc(${100 / itemsPerView}% - ${((itemsPerView - 1) * (24 / itemsPerView))}px)`,
                    maxWidth: `calc(${100 / itemsPerView}% - ${((itemsPerView - 1) * (24 / itemsPerView))}px)`,
                    minWidth: 0
                  }}
                >
                  <StoryCard
                    story={story}
                    onClick={() => handleStoryClick(story.id)}
                  />
                </Box>
              ))}
              
              {/* "View More" Card */}
              {hasMoreStories && (
                <Box
                  sx={{
                    flex: `0 0 calc(${100 / itemsPerView}% - ${((itemsPerView - 1) * (24 / itemsPerView))}px)`,
                    maxWidth: `calc(${100 / itemsPerView}% - ${((itemsPerView - 1) * (24 / itemsPerView))}px)`,
                    minWidth: 0
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
        </Box>

        <DotsIndicator
          currentIndex={currentIndex}
          maxIndex={maxIndex}
          onDotClick={setCurrentIndex}
        />
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
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StoriesSection;