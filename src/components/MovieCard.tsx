
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Plus, Bookmark, Play, Info } from 'lucide-react';
import { Movie } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useMovies } from '../contexts/MovieContext';

interface MovieCardProps {
  movie: Movie;
  size?: 'sm' | 'md' | 'lg';
  showControls?: boolean;
}

const MovieCard = ({ movie, size = 'md', showControls = true }: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { currentUser, addToWatchlist, removeFromWatchlist, addToFavorites, removeFromFavorites, rateMovie } = useAuth();
  const { genres } = useMovies();
  
  const isInWatchlist = currentUser?.watchlist.includes(movie.id) || false;
  const isInFavorites = currentUser?.favorites.includes(movie.id) || false;
  const userRating = currentUser?.ratings[movie.id] || 0;
  
  // Get genre names for the movie
  const movieGenres = movie.genre_ids
    .map(id => genres.find(genre => genre.id === id))
    .filter(Boolean)
    .map(genre => genre?.name) as string[];

  // Set poster image
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';
    
  // Get trailer URL for hover effect (using mock data)
  const trailerUrl = 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'; // Example video

  // Handle trailer play/pause on hover
  useEffect(() => {
    if (videoRef.current) {
      if (isHovered) {
        videoRef.current.play().catch(err => {
          console.error("Video play failed:", err);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isHovered]);

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie.id);
    }
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInFavorites) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie.id);
    }
  };

  const movieDetailsPath = `/movie/${movie.id}`;

  // Size classes
  const sizeClasses = {
    sm: 'w-36 h-54',
    md: 'w-48 h-72',
    lg: 'w-64 h-96',
  };

  return (
    <div 
      className={`movie-card movie-card-hover ${sizeClasses[size]} relative overflow-hidden rounded-lg`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={movieDetailsPath} className="block h-full">
        {/* Poster Image or Trailer Video */}
        <div className="relative w-full h-full overflow-hidden">
          {isHovered ? (
            <video 
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              src={trailerUrl}
              muted
              loop
              playsInline
            />
          ) : (
            <img 
              src={posterUrl} 
              alt={movie.title} 
              className="w-full h-full object-cover"
            />
          )}

          {/* Overlay for hover/focused state */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            {/* Movie controls (only visible on hover) */}
            {showControls && currentUser && (
              <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-8 h-8 rounded-full bg-black/50 hover:bg-primary"
                  onClick={handleWatchlistToggle}
                >
                  <Bookmark className={`w-4 h-4 ${isInWatchlist ? 'fill-primary text-primary' : 'text-white'}`} />
                </Button>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-8 h-8 rounded-full bg-black/50 hover:bg-primary"
                  onClick={handleFavoriteToggle}
                >
                  <Heart className={`w-4 h-4 ${isInFavorites ? 'fill-primary text-primary' : 'text-white'}`} />
                </Button>
              </div>
            )}

            {/* Bottom content area */}
            <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-1">
              {/* Genre badges (only show 2 for space) */}
              <div className="flex flex-wrap gap-1 mb-1">
                {movieGenres.slice(0, 2).map((genre, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-black/50 border-none text-white">
                    {genre}
                  </Badge>
                ))}
              </div>

              {/* Title */}
              <h3 className="movie-title text-white text-sm sm:text-base font-semibold line-clamp-2">
                {movie.title}
              </h3>

              {/* Year and Rating */}
              <div className="flex items-center justify-between text-xs text-white/80">
                <span>{movie.release_date?.split('-')[0] || 'Unknown'}</span>
                <div className="flex items-center">
                  <Star className="w-3 h-3 mr-1 rating-star" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
              </div>

              {/* Watch now button (only visible on hover) */}
              {isHovered && (
                <div className="mt-2 flex gap-2">
                  <Button 
                    variant="default"
                    size="sm"
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Details
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
