
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails, MovieDetails as MovieDetailsType } from '../lib/api';
import { Bookmark, Heart, Star, Calendar, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import StarRating from '@/components/StarRating';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, addToWatchlist, removeFromWatchlist, addToFavorites, removeFromFavorites, rateMovie } = useAuth();
  
  const isInWatchlist = currentUser?.watchlist.includes(Number(id)) || false;
  const isInFavorites = currentUser?.favorites.includes(Number(id)) || false;
  const userRating = currentUser?.ratings[Number(id)] || 0;

  useEffect(() => {
    const loadMovie = async () => {
      try {
        setIsLoading(true);
        const data = await getMovieDetails(Number(id));
        setMovie(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMovie();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-pulse">Loading movie details...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Movie not found</h1>
          <p className="mt-4">The movie you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;
  
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  const handleWatchlistToggle = () => {
    if (isInWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie.id);
    }
  };

  const handleFavoriteToggle = () => {
    if (isInFavorites) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie.id);
    }
  };

  const handleRating = (rating: number) => {
    rateMovie(movie.id, rating);
  };

  return (
    <div className="min-h-screen">
      {/* Backdrop */}
      {backdropUrl && (
        <div className="relative h-[50vh] w-full">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30"></div>
          <img 
            src={backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 w-full md:w-1/3 lg:w-1/4">
            <img 
              src={posterUrl} 
              alt={movie.title} 
              className="w-full rounded-lg shadow-lg object-cover"
            />
          </div>

          {/* Movie Info */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold">{movie.title}</h1>
            
            {movie.tagline && (
              <p className="text-lg italic text-muted-foreground mt-2">{movie.tagline}</p>
            )}
            
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="flex items-center">
                <Star className="w-5 h-5 mr-1 text-yellow-500" />
                <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
                <span className="text-muted-foreground ml-1">({movie.vote_count} votes)</span>
              </div>
              
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-1 text-blue-500" />
                <span>{movie.release_date.split('-')[0]}</span>
              </div>
              
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-1 text-green-500" />
                <span>{movie.runtime} min</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {movie.genres.map(genre => (
                <span 
                  key={genre.id}
                  className="px-3 py-1 rounded-full text-xs bg-secondary text-secondary-foreground"
                >
                  {genre.name}
                </span>
              ))}
            </div>
            
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p className="text-base">{movie.overview}</p>
            </div>
            
            {currentUser && (
              <div className="flex flex-wrap gap-3 mt-6">
                <Button
                  variant={isInWatchlist ? "default" : "outline"}
                  onClick={handleWatchlistToggle}
                >
                  <Bookmark className="w-4 h-4 mr-2" />
                  {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                </Button>
                
                <Button
                  variant={isInFavorites ? "default" : "outline"}
                  onClick={handleFavoriteToggle}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isInFavorites ? 'fill-current' : ''}`} />
                  {isInFavorites ? 'In Favorites' : 'Add to Favorites'}
                </Button>
              </div>
            )}
            
            {currentUser && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Rate This Movie</h2>
                <div className="flex items-center">
                  <StarRating 
                    rating={userRating} 
                    maxRating={10} 
                    onChange={handleRating} 
                    size="lg"
                    interactive 
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
