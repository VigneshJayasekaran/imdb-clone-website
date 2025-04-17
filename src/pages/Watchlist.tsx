
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMovies } from '../contexts/MovieContext';
import MovieCard from '../components/MovieCard';
import { Button } from '@/components/ui/button';

const Watchlist = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const { getMoviesByIds } = useMovies();
  
  const watchlistMovies = currentUser ? getMoviesByIds(currentUser.watchlist) : [];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Please log in to view your watchlist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Watchlist</h1>
      
      {watchlistMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {watchlistMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} size="sm" />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Your watchlist is empty</p>
          <Button className="mt-4" onClick={() => navigate('/movies')}>
            Discover Movies
          </Button>
        </div>
      )}
    </div>
  );
};

export default Watchlist;
