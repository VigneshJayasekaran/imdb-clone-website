
import { useState, useEffect } from 'react';
import { Grid, List } from 'lucide-react';
import { useMovies } from '../contexts/MovieContext';
import MovieCard from '../components/MovieCard';
import FilterChips from '../components/FilterChips';
import { Button } from '@/components/ui/button';

const Movies = () => {
  const { 
    movies, 
    isLoading, 
    fetchMovies, 
    filteredMovies, 
    viewMode, 
    setViewMode 
  } = useMovies();

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Movies</h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <FilterChips showCounts={true} />
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4 mr-1" />
            Grid
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4 mr-1" />
            List
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-pulse">Loading movies...</div>
        </div>
      ) : filteredMovies.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} size="sm" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMovies.map(movie => (
              <div 
                key={movie.id}
                className="flex items-start p-4 rounded-lg hover:bg-accent transition-colors"
              >
                <img 
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : 'https://via.placeholder.com/92x138?text=No+Poster'} 
                  alt={movie.title} 
                  className="w-16 h-24 object-cover rounded mr-4"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{movie.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <span>{movie.release_date?.split('-')[0] || 'Unknown'}</span>
                    <span className="mx-2">•</span>
                    <span>⭐ {movie.vote_average.toFixed(1)}</span>
                  </div>
                  <p className="text-sm line-clamp-2">{movie.overview}</p>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center h-60">
          <p className="text-lg text-muted-foreground mb-4">No movies found matching your filters</p>
          <Button onClick={() => fetchMovies()}>Reset Filters</Button>
        </div>
      )}
    </div>
  );
};

export default Movies;
