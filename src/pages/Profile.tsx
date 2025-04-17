
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Image, PencilLine, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
// No need for this import
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMovies } from '../contexts/MovieContext';
import MovieCard from '@/components/MovieCard';
import StarRating from '@/components/StarRating';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, updateUser } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { viewMode, setViewMode, getMoviesByIds } = useMovies();
  
  const [username, setUsername] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [watchlistMovies, setWatchlistMovies] = useState<any[]>([]);
  const [favoritesMovies, setFavoritesMovies] = useState<any[]>([]);
  const [ratedMovies, setRatedMovies] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    if (currentUser) {
      setUsername(currentUser.username);
      
      // Get watchlist movies
      setWatchlistMovies(getMoviesByIds(currentUser.watchlist));
      
      // Get favorites movies
      setFavoritesMovies(getMoviesByIds(currentUser.favorites));
      
      // Get rated movies
      const ratedMovieIds = Object.keys(currentUser.ratings).map(Number);
      const movies = getMoviesByIds(ratedMovieIds);
      setRatedMovies(movies);
    }
  }, [currentUser, isAuthenticated, navigate, getMoviesByIds]);

  const handleSaveProfile = () => {
    if (username.trim()) {
      updateUser({ username });
      setIsEditing(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10">
          <div className="w-32 h-32 relative rounded-full overflow-hidden bg-muted">
            {currentUser.profilePicture ? (
              <img 
                src={currentUser.profilePicture} 
                alt={currentUser.username} 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-full h-full p-4 text-muted-foreground" />
            )}
          </div>
          
          <div className="flex-1">
            {isEditing ? (
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="text-2xl font-bold"
                  />
                </div>
                <Button onClick={handleSaveProfile}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">{currentUser.username}</h1>
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                  <PencilLine className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            )}
            
            <p className="text-muted-foreground mt-2">{currentUser.email}</p>
            
            <div className="flex flex-wrap gap-6 mt-6">
              <div>
                <h3 className="text-sm text-muted-foreground">Watchlist</h3>
                <p className="text-lg font-semibold">{currentUser.watchlist.length} movies</p>
              </div>
              <div>
                <h3 className="text-sm text-muted-foreground">Favorites</h3>
                <p className="text-lg font-semibold">{currentUser.favorites.length} movies</p>
              </div>
              <div>
                <h3 className="text-sm text-muted-foreground">Favorite Actors</h3>
                <p className="text-lg font-semibold">{currentUser.favoriteActors.length} actors</p>
              </div>
              <div>
                <h3 className="text-sm text-muted-foreground">Ratings</h3>
                <p className="text-lg font-semibold">{Object.keys(currentUser.ratings).length} ratings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="mb-10 p-6 rounded-lg border bg-card">
          <h2 className="text-xl font-bold mb-4">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Enable dark theme for the application</p>
              </div>
              <Switch 
                id="dark-mode" 
                checked={isDarkMode}
                onCheckedChange={toggleTheme}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="view-mode">Default View Mode</Label>
                <p className="text-sm text-muted-foreground">Choose how movies are displayed</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant={viewMode === 'grid' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => {
                    setViewMode('grid');
                    updateUser({ 
                      preferences: { 
                        ...currentUser.preferences, 
                        viewMode: 'grid' 
                      } 
                    });
                  }}
                >
                  Grid
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => {
                    setViewMode('list');
                    updateUser({ 
                      preferences: { 
                        ...currentUser.preferences, 
                        viewMode: 'list' 
                      } 
                    });
                  }}
                >
                  List
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for Watchlist, Ratings, Reviews */}
        <Tabs defaultValue="watchlist">
          <TabsList className="mb-6">
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="ratings">Ratings</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="watchlist">
            {watchlistMovies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
          </TabsContent>
          
          <TabsContent value="favorites">
            {favoritesMovies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {favoritesMovies.map(movie => (
                  <MovieCard key={movie.id} movie={movie} size="sm" />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">You haven't added any favorites yet</p>
                <Button className="mt-4" onClick={() => navigate('/movies')}>
                  Discover Movies
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="ratings">
            {ratedMovies.length > 0 ? (
              <div className="space-y-4">
                {ratedMovies.map(movie => (
                  <div key={movie.id} className="flex items-start p-4 rounded-lg hover:bg-accent transition-colors">
                    <img 
                      src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : 'https://via.placeholder.com/92x138?text=No+Poster'} 
                      alt={movie.title} 
                      className="w-16 h-24 object-cover rounded mr-4"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">{movie.title}</h3>
                        <StarRating rating={currentUser.ratings[movie.id]} size="sm" />
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {movie.release_date?.split('-')[0] || 'Unknown'}
                      </div>
                      <p className="text-sm line-clamp-2">{movie.overview}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">You haven't rated any movies yet</p>
                <Button className="mt-4" onClick={() => navigate('/movies')}>
                  Discover Movies
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="reviews">
            {currentUser.reviews.length > 0 ? (
              <div className="space-y-6">
                {currentUser.reviews.map(review => {
                  const movie = getMoviesByIds([review.movieId])[0];
                  return (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex items-start">
                        {movie && (
                          <img 
                            src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : 'https://via.placeholder.com/92x138?text=No+Poster'} 
                            alt={movie.title} 
                            className="w-16 h-24 object-cover rounded mr-4"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold">{movie ? movie.title : `Movie ID: ${review.movieId}`}</h3>
                            <StarRating rating={review.rating} size="sm" />
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            Reviewed on {review.date}
                          </div>
                          <p className="text-sm">{review.text}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">You haven't written any reviews yet</p>
                <Button className="mt-4" onClick={() => navigate('/movies')}>
                  Discover Movies
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
