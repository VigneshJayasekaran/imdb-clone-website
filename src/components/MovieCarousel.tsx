
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../lib/api';
import { Button } from './ui/button';
import MovieCard from './MovieCard';

interface MovieCarouselProps {
  title?: string;
  movies: Movie[];
  autoplay?: boolean;
  autoplaySpeed?: number;
  slidesToShow?: number;
}

const MovieCarousel = ({
  title,
  movies,
  autoplay = true,
  autoplaySpeed = 5000,
  slidesToShow = 5,
}: MovieCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Responsive slidesToShow
  const getResponsiveSlidesToShow = () => {
    if (typeof window === 'undefined') return slidesToShow;
    
    const width = window.innerWidth;
    if (width < 640) return 2; // Mobile
    if (width < 768) return 3; // Small tablets
    if (width < 1024) return 4; // Tablets/small laptops
    return slidesToShow; // Default
  };

  const [responsiveSlidesToShow, setResponsiveSlidesToShow] = useState(getResponsiveSlidesToShow());

  // Update responsiveSlidesToShow on window resize
  useEffect(() => {
    const handleResize = () => {
      setResponsiveSlidesToShow(getResponsiveSlidesToShow());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [slidesToShow]);

  // Calculate the max index
  const maxIndex = Math.max(0, movies.length - responsiveSlidesToShow);

  // Handle autoplay
  useEffect(() => {
    if (autoplay && !isPaused) {
      autoplayTimerRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => 
          prevIndex < maxIndex ? prevIndex + 1 : 0
        );
      }, autoplaySpeed);
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [autoplay, autoplaySpeed, maxIndex, isPaused, responsiveSlidesToShow]);

  // Handle dragging
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    setIsPaused(true); // Pause autoplay while dragging
    
    // Get X position for mouse or touch
    const clientX = 'touches' in e 
      ? e.touches[0].clientX
      : e.clientX;
    
    setDragStartX(clientX);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    
    // Get X position for mouse or touch
    const clientX = 'touches' in e 
      ? e.touches[0].clientX
      : e.clientX;
    
    const offset = clientX - dragStartX;
    setDragOffset(offset);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    
    const threshold = 100; // Minimum drag distance to trigger slide change
    
    if (dragOffset < -threshold && currentIndex < maxIndex) {
      // Dragged left - go next
      setCurrentIndex(prevIndex => prevIndex + 1);
    } else if (dragOffset > threshold && currentIndex > 0) {
      // Dragged right - go previous
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
    
    setIsDragging(false);
    setDragOffset(0);
    setIsPaused(false); // Resume autoplay after drag ends
  };

  // Navigation functions
  const goToPrevious = () => {
    setCurrentIndex(prevIndex => Math.max(0, prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prevIndex => Math.min(maxIndex, prevIndex + 1));
  };

  // Calculate transform style based on current index and drag offset
  const getTransformStyle = () => {
    const baseTransform = `translateX(-${currentIndex * (100 / responsiveSlidesToShow)}%)`;
    
    if (isDragging) {
      // Add drag offset to the base transform
      const dragPercent = (dragOffset / (carouselRef.current?.offsetWidth || 1)) * 100;
      return `${baseTransform} translateX(${dragPercent}%)`;
    }
    
    return baseTransform;
  };

  // Sizes for different screens
  const cardSize = ((): 'sm' | 'md' | 'lg' => {
    if (responsiveSlidesToShow <= 3) return 'md';
    return 'sm';
  })();

  return (
    <div 
      className="relative w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Title */}
      {title && (
        <h2 className="text-xl font-bold mb-4">{title}</h2>
      )}
      
      {/* Carousel Container */}
      <div className="relative overflow-hidden">
        {/* Previous Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-1 top-1/2 transform -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full h-10 w-10"
          onClick={goToPrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        {/* Next Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full h-10 w-10"
          onClick={goToNext}
          disabled={currentIndex >= maxIndex}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* Movies track */}
        <div 
          ref={carouselRef}
          className="flex transition-transform duration-500 ease-out"
          style={{ 
            transform: getTransformStyle(),
            width: `${(movies.length * 100) / responsiveSlidesToShow}%` 
          }}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          {movies.map(movie => (
            <div 
              key={movie.id} 
              className="px-2" 
              style={{ width: `${100 / movies.length}%` }}
            >
              <MovieCard movie={movie} size={cardSize} />
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center mt-4 gap-1">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === currentIndex ? 'w-6 bg-primary' : 'w-1.5 bg-gray-300 dark:bg-gray-600'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default MovieCarousel;
