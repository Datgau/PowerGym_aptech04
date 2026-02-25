import React, { useRef } from 'react';
import { Box, Container } from '@mui/material';
import StoryCard from './StoryCard';
import ViewMoreCard from './ViewMoreCard';
import CarouselNavigation from './CarouselNavigation';
import DotsIndicator from './DotsIndicator';
import SectionHeader from './SectionHeader';
import { useCarousel } from '../../../hooks/useCarousel.ts';
import type {StoryItem} from "../../../services/storyService.ts";

interface StoriesSectionProps {
  readonly stories: readonly StoryItem[];
  readonly onStoryClick: (storyId: string) => void;
}

const StoriesSection: React.FC<StoriesSectionProps> = ({ stories, onStoryClick }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
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
        <SectionHeader />

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
    </Box>
  );
};

export default StoriesSection;