
import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating?: number;
  maxRating?: number;
  precision?: 0.5 | 1;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (newRating: number) => void;
  className?: string;
}

const StarRating = ({
  rating = 0,
  maxRating = 5,
  precision = 0.5,
  size = 'md',
  interactive = false,
  onChange,
  className = '',
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Size mapping
  const sizeMap = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  // Container and spacing classes
  const containerClass = `flex items-center gap-1 ${className}`;
  
  // Handle mouse move over the stars (for hover effect)
  const handleMouseMove = (event: React.MouseEvent, index: number) => {
    if (!interactive) return;
    
    const star = event.currentTarget;
    const rect = star.getBoundingClientRect();
    const width = rect.width;
    const x = event.clientX - rect.left;
    
    // Calculate the percentage of the star that was hovered
    const percent = x / width;
    
    // Calculate the value based on precision
    let value = index + 1;
    if (precision === 0.5 && percent < 0.5) {
      value -= 0.5;
    }
    
    setHoverRating(value);
    
    if (isDragging) {
      onChange?.(value);
    }
  };

  // Handle mouse leave (exit hover state)
  const handleMouseLeave = () => {
    if (!interactive) return;
    setHoverRating(0);
    setIsDragging(false);
  };

  // Handle click on a star
  const handleClick = (rating: number) => {
    if (!interactive) return;
    onChange?.(rating);
  };

  // Handle mouse down (start dragging)
  const handleMouseDown = () => {
    if (!interactive) return;
    setIsDragging(true);
  };

  // Handle mouse up (end dragging)
  const handleMouseUp = () => {
    if (!interactive) return;
    setIsDragging(false);
  };

  // Calculate the display value (hoverRating takes precedence if present)
  const displayValue = hoverRating > 0 ? hoverRating : rating;

  return (
    <div 
      className={containerClass}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
    >
      {Array.from({ length: maxRating }, (_, i) => {
        // Calculate if this star should be filled, half-filled, or empty
        let fillPercentage = 0;
        
        if (displayValue >= i + 1) {
          // Full star
          fillPercentage = 100;
        } else if (displayValue > i) {
          // Partial star
          const partial = displayValue - i;
          fillPercentage = partial * 100;
        }
        
        // Determine whether to use half-star precision or not
        const isFilled = precision === 0.5
          ? fillPercentage >= 75
          : fillPercentage >= 50;
          
        const isHalfFilled = precision === 0.5
          ? fillPercentage >= 25 && fillPercentage < 75
          : false;
          
        return (
          <span
            key={i}
            className={`relative cursor-${interactive ? 'pointer' : 'default'}`}
            onMouseMove={(e) => handleMouseMove(e, i)}
            onClick={() => handleClick(i + 1)}
            onMouseDown={handleMouseDown}
          >
            {/* Background star (always rendered) */}
            <Star 
              className={`${sizeMap[size]} text-gray-300 dark:text-gray-600`} 
            />
            
            {/* Filled star (rendered based on rating) */}
            {(isFilled || isHalfFilled) && (
              <span 
                className="absolute inset-0 overflow-hidden" 
                style={{ width: isHalfFilled ? '50%' : '100%' }}
              >
                <Star 
                  className={`${sizeMap[size]} rating-star`} 
                />
              </span>
            )}
          </span>
        );
      })}
      
      {/* Optionally show numeric rating */}
      {interactive && (
        <span className="ml-2 text-sm font-medium">
          {hoverRating > 0 ? hoverRating : rating || '0'}
        </span>
      )}
    </div>
  );
};

export default StarRating;
