import React, { useRef, useState } from 'react';
import { Box, Container, Button, Snackbar, Alert } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import StoryCard from './StoryCard';
import ViewMoreCard from './ViewMoreCard';
import CarouselNavigation from './CarouselNavigation';
import DotsIndicator from './DotsIndicator';
import SectionHeader from './SectionHeader';
import ShareStoryModal from './ShareStoryModal';
import { useCarousel } from '../../../hooks/useCarousel.ts';
import type {StoryItem} from "../../../services/storyService.ts";
import { getAccessToken } from '../../../services/authStorage';

interface StoriesSectionProps {
  readonly stories: readonly StoryItem[];
  readonly onStoryClick: (storyId: string) => void;
  readonly onStoriesUpdate?: () => void;
}

const StoriesSection: React.FC<StoriesSectionProps> = ({ stories, onStoryClick, onStoriesUpdate }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
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
    window.location.href = '/stories';
  };

  const handleShareClick = () => {
    const token = getAccessToken();
    if (!token) {
      // Redirect to login
      window.location.href = '/login';
      return;
    }
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
        py: { xs: 6, md: 8 },
        background: '#00b4ff',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 0%, transparent 50%)',
          pointerEvents: 'none'
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
              mx: 2
            }}
          >
            <Box
              sx={{
                display: 'flex',
                transform: `translateX(-${getTransformValue()}%)`,
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                gap: 3
              }}
            >
              {displayStories.map((story) => (
                <Box
                  key={story.id}
                  sx={{
                    flex: `0 0 ${100 / itemsPerView}%`,
                    maxWidth: `${100 / itemsPerView}%`
                  }}
                >
                  <StoryCard
                    story={story}
                    onClick={() => onStoryClick(story.id)}
                  />
                </Box>
              ))}
              
              {/* "View More" Card */}
              {hasMoreStories && (
                <Box
                  sx={{
                    flex: `0 0 ${100 / itemsPerView}%`,
                    maxWidth: `${100 / itemsPerView}%`
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