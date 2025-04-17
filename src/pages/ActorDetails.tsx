
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getActor } from '../lib/api';
import { Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import MovieCard from '@/components/MovieCard';

const ActorDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [actor, setActor] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, addToFavoriteActors, removeFromFavoriteActors } = useAuth();
  
  const isInFavorites = currentUser?.favoriteActors.includes(Number(id)) || false;

  useEffect(() => {
    const loadActor = async () => {
      try {
        setIsLoading(true);
        const data = await getActor(Number(id));
        setActor(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadActor();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-pulse">Loading actor details...</div>
      </div>
    );
  }

  if (!actor) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Actor not found</h1>
          <p className="mt-4">The actor you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const profileUrl = actor.profile_path
    ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  const handleFavoriteToggle = () => {
    if (isInFavorites) {
      removeFromFavoriteActors(actor.id);
    } else {
      addToFavoriteActors(actor.id);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Image */}
        <div className="flex-shrink-0 w-full md:w-1/3 lg:w-1/4">
          <img 
            src={profileUrl} 
            alt={actor.name} 
            className="w-full rounded-lg shadow-lg object-cover"
          />
          
          {currentUser && (
            <Button
              variant={isInFavorites ? "default" : "outline"}
              className="w-full mt-4"
              onClick={handleFavoriteToggle}
            >
              <Heart className={`w-4 h-4 mr-2 ${isInFavorites ? 'fill-current' : ''}`} />
              {isInFavorites ? 'Remove from Favorites' : 'Add to Favorites'}
            </Button>
          )}
        </div>

        {/* Actor Info */}
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold">{actor.name}</h1>
          
          {actor.known_for_department && (
            <p className="text-lg text-muted-foreground mt-2">
              {actor.known_for_department}
            </p>
          )}
          
          {actor.birthday && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Personal Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {actor.birthday && (
                  <div>
                    <h3 className="font-medium text-muted-foreground">Birthday</h3>
                    <p>{actor.birthday}</p>
                  </div>
                )}
                {actor.place_of_birth && (
                  <div>
                    <h3 className="font-medium text-muted-foreground">Place of Birth</h3>
                    <p>{actor.place_of_birth}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {actor.biography && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Biography</h2>
              <p className="text-base">{actor.biography}</p>
            </div>
          )}
          
          {actor.movie_credits?.cast && actor.movie_credits.cast.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Known For</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {actor.movie_credits.cast.slice(0, 5).map((movie: any) => (
                  <Link key={movie.id} to={`/movie/${movie.id}`} className="block">
                    <div className="relative overflow-hidden rounded-lg hover:shadow-lg transition-shadow">
                      <img 
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : 'https://via.placeholder.com/342x513?text=No+Poster'} 
                        alt={movie.title} 
                        className="w-full h-auto object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                        <h3 className="text-white text-sm font-medium truncate">{movie.title}</h3>
                        <p className="text-white/70 text-xs">{movie.character}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActorDetails;
