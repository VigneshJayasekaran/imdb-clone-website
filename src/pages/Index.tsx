
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Film, Grid, List } from 'lucide-react';
import { useMovies } from '../contexts/MovieContext';
import MovieCarousel from '../components/MovieCarousel';
import MovieCard from '../components/MovieCard';
import FilterChips from '../components/FilterChips';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { 
    movies, 
    trendingMovies, 
    isLoading, 
    fetchMovies, 
    filteredMovies, 
    viewMode, 
    setViewMode 
  } = useMovies();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Fetch movies on component mount
    fetchMovies();
  }, [fetchMovies]);

  return (
    <div className="flex flex-col space-y-10 pb-20">
      {/* Hero Section */}
      <section className="relative bg-black h-[60vh] min-h-[400px] flex items-center">
        {/* Background image */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-background z-10"
            aria-hidden="true"
          ></div>
          <img 
            src="https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg" 
            alt="Hero background" 
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        
        {/* Hero content */}
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Discover Amazing Movies</h1>
            <p className="text-xl text-white/80 mb-8">
              Explore thousands of movies, create watchlists, and rate your favorites
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link to="/movies">Browse Movies</Link>
              </Button>
              {!isAuthenticated && (
                <Button variant="outline" size="lg">
                  <Link to="/signup">Create Account</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        {/* Trending Now section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Trending Now</h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-60">
              <div className="animate-pulse">Loading trending movies...</div>
            </div>
          ) : (
            <MovieCarousel 
              movies={trendingMovies} 
              autoplay={true} 
              slidesToShow={5}
            />
          )}
        </section>

        {/* Popular Movies section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Popular Movies</h2>
            <div className="flex items-center space-x-2">
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
          
          <FilterChips showCounts={true} />
          
          {isLoading ? (
            <div className="flex justify-center items-center h-60">
              <div className="animate-pulse">Loading movies...</div>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-6">
              {filteredMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} size="sm" />
              ))}
            </div>
          ) : (
            <div className="space-y-4 mt-6">
              {filteredMovies.map(movie => (
                <Link 
                  to={`/movie/${movie.id}`} 
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
                </Link>
              ))}
            </div>
          )}
          
          <div className="flex justify-center mt-8">
            <Button asChild variant="outline">
              <Link to="/movies">View All Movies</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
