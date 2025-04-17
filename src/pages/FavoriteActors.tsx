
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { searchActorsByIds, Actor } from '../lib/api';
import ActorCard from '../components/ActorCard';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const FavoriteActors = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [actors, setActors] = useState<Actor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    
    const loadFavoriteActors = async () => {
      if (!currentUser?.favoriteActors.length) {
        setActors([]);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        // Here we would normally fetch actors by IDs
        // For now we'll use a mock function that should be implemented in the API
        const actorData = await searchActorsByIds(currentUser.favoriteActors);
        setActors(actorData);
      } catch (error) {
        console.error('Error loading favorite actors:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavoriteActors();
  }, [currentUser, isAuthenticated, navigate]);

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Please log in to view your favorite actors.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Favorite Actors</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-pulse">Loading actors...</div>
        </div>
      ) : actors.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {actors.map(actor => (
            <ActorCard key={actor.id} actor={actor} size="sm" />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">You haven't added any actors to your favorites yet</p>
          <Button className="mt-4" onClick={() => navigate('/actors')}>
            Discover Actors
          </Button>
        </div>
      )}
    </div>
  );
};

export default FavoriteActors;
