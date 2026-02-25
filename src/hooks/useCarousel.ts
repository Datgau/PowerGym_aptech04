import { useState, useCallback } from 'react';

interface UseCarouselProps {
  totalItems: number;
}

interface UseCarouselReturn {
  currentIndex: number;
  itemsPerView: number;
  maxIndex: number;
  handlePrevious: () => void;
  handleNext: () => void;
  setCurrentIndex: (index: number) => void;
}

export const useCarousel = ({ 
  totalItems
}: UseCarouselProps): UseCarouselReturn => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Calculate items per view based on screen size
  const getItemsPerView = useCallback(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1200) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    }
    return 3;
  }, []);

  const itemsPerView = getItemsPerView();
  const totalSlides = Math.ceil(totalItems / itemsPerView);
  const maxIndex = Math.max(0, totalSlides - 1);

  const handlePrevious = useCallback(() => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  }, [maxIndex]);

  return {
    currentIndex,
    itemsPerView,
    maxIndex,
    handlePrevious,
    handleNext,
    setCurrentIndex
  };
};