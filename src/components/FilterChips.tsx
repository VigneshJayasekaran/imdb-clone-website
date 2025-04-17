
import { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Sliders } from 'lucide-react';
import { useMovies } from '../contexts/MovieContext';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';

interface FilterChipsProps {
  showCounts?: boolean;
}

const FilterChips = ({ showCounts = true }: FilterChipsProps) => {
  const { 
    genres, 
    activeGenreFilters, 
    toggleGenreFilter, 
    clearGenreFilters,
    yearRange,
    setYearRange,
    ratingRange,
    setRatingRange,
    filteredMovies,
    movies
  } = useMovies();
  
  const currentYear = new Date().getFullYear();
  const minYear = 1900;
  const [tempYearRange, setTempYearRange] = useState<[number, number]>(yearRange);
  const [tempRatingRange, setTempRatingRange] = useState<[number, number]>(ratingRange);
  const hasActiveFilters = activeGenreFilters.length > 0 || 
    yearRange[0] !== minYear || yearRange[1] !== currentYear ||
    ratingRange[0] !== 0 || ratingRange[1] !== 10;

  // Function to count movies that would match each genre
  const countMoviesByGenre = (genreId: number) => {
    // If the genre is already active, we remove it from the filter to get the count
    if (activeGenreFilters.includes(genreId)) {
      return movies.filter(movie => 
        movie.genre_ids.includes(genreId) && 
        !movie.genre_ids.some(id => activeGenreFilters.includes(id) && id !== genreId)
      ).length;
    }
    // If not active, we add it to get the count
    else {
      return movies.filter(movie => 
        movie.genre_ids.includes(genreId) && 
        (activeGenreFilters.length === 0 || movie.genre_ids.some(id => activeGenreFilters.includes(id)))
      ).length;
    }
  };

  const handleApplyYearFilter = () => {
    setYearRange(tempYearRange);
  };

  const handleApplyRatingFilter = () => {
    setRatingRange(tempRatingRange);
  };

  const handleClearAllFilters = () => {
    clearGenreFilters();
    setYearRange([minYear, currentYear]);
    setRatingRange([0, 10]);
    setTempYearRange([minYear, currentYear]);
    setTempRatingRange([0, 10]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {/* Genre filter chips */}
        <div className="flex flex-wrap gap-2">
          {genres.slice(0, 12).map((genre) => {
            const isActive = activeGenreFilters.includes(genre.id);
            const count = showCounts ? countMoviesByGenre(genre.id) : null;
            
            return (
              <Badge
                key={genre.id}
                variant={isActive ? "default" : "outline"}
                className={`filter-chip cursor-pointer ${isActive ? 'bg-primary text-white' : 'hover:bg-muted'}`}
                onClick={() => toggleGenreFilter(genre.id)}
              >
                {genre.name}
                {showCounts && count !== null && (
                  <span className="ml-1 text-xs opacity-70">({count})</span>
                )}
              </Badge>
            );
          })}
          
          {/* Genre dropdown for remaining genres */}
          {genres.length > 12 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 gap-1">
                  More <ChevronDown className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2">
                <div className="grid grid-cols-2 gap-1">
                  {genres.slice(12).map((genre) => {
                    const isActive = activeGenreFilters.includes(genre.id);
                    return (
                      <Badge
                        key={genre.id}
                        variant={isActive ? "default" : "outline"}
                        className={`filter-chip cursor-pointer ${isActive ? 'bg-primary text-white' : 'hover:bg-muted'}`}
                        onClick={() => toggleGenreFilter(genre.id)}
                      >
                        {genre.name}
                      </Badge>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Year Range Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 gap-1">
              Year {yearRange[0] !== minYear || yearRange[1] !== currentYear ? 
                `(${yearRange[0]}-${yearRange[1]})` : ''}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-4">
              <h4 className="font-medium">Release Year</h4>
              <div className="flex justify-between text-sm">
                <span>{tempYearRange[0]}</span>
                <span>{tempYearRange[1]}</span>
              </div>
              <Slider
                defaultValue={tempYearRange}
                min={minYear}
                max={currentYear}
                step={1}
                value={tempYearRange}
                onValueChange={(value) => setTempYearRange(value as [number, number])}
                className="mt-6"
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setTempYearRange([minYear, currentYear]);
                  }}
                >
                  Reset
                </Button>
                <Button 
                  size="sm"
                  onClick={handleApplyYearFilter}
                >
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Rating Range Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 gap-1">
              Rating {ratingRange[0] !== 0 || ratingRange[1] !== 10 ? 
                `(${ratingRange[0]}-${ratingRange[1]})` : ''}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-4">
              <h4 className="font-medium">Rating</h4>
              <div className="flex justify-between text-sm">
                <span>{tempRatingRange[0]}</span>
                <span>{tempRatingRange[1]}</span>
              </div>
              <Slider
                defaultValue={tempRatingRange}
                min={0}
                max={10}
                step={0.5}
                value={tempRatingRange}
                onValueChange={(value) => setTempRatingRange(value as [number, number])}
                className="mt-6"
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setTempRatingRange([0, 10]);
                  }}
                >
                  Reset
                </Button>
                <Button 
                  size="sm"
                  onClick={handleApplyRatingFilter}
                >
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear all filters button - only show if filters are active */}
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-muted-foreground hover:text-foreground"
            onClick={handleClearAllFilters}
          >
            <X className="h-3 w-3 mr-1" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Results count when filtering */}
      {hasActiveFilters && (
        <div className="text-sm text-muted-foreground">
          Showing {filteredMovies.length} results
        </div>
      )}
    </div>
  );
};

export default FilterChips;
