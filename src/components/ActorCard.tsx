
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Actor } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';

interface ActorCardProps {
  actor: Actor;
  size?: 'sm' | 'md' | 'lg';
}

const ActorCard = ({ actor, size = 'md' }: ActorCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { currentUser, addToFavoriteActors, removeFromFavoriteActors } = useAuth();
  
  const isInFavorites = currentUser?.favoriteActors.includes(actor.id) || false;
  
  // Set profile image
  const profileUrl = actor.profile_path 
    ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';
    
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInFavorites) {
      removeFromFavoriteActors(actor.id);
    } else {
      addToFavoriteActors(actor.id);
    }
  };

  const actorDetailsPath = `/actor/${actor.id}`;

  // Size classes
  const sizeClasses = {
    sm: 'w-28 h-40',
    md: 'w-40 h-56',
    lg: 'w-56 h-72',
  };

  return (
    <div 
      className={`movie-card movie-card-hover ${sizeClasses[size]} relative overflow-hidden rounded-lg`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={actorDetailsPath} className="block h-full">
        {/* Profile Image */}
        <div className="relative w-full h-full overflow-hidden">
          <img 
            src={profileUrl} 
            alt={actor.name} 
            className="w-full h-full object-cover"
          />

          {/* Overlay for hover/focused state */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-30'}`}>
            {/* Favorite button (only visible when authenticated) */}
            {currentUser && (
              <div className="absolute top-2 right-2 flex flex-col gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-8 h-8 rounded-full bg-black/50 hover:bg-primary transition-colors"
                  onClick={handleFavoriteToggle}
                >
                  <Heart className={`w-4 h-4 ${isInFavorites ? 'fill-primary text-primary' : 'text-white'}`} />
                </Button>
              </div>
            )}

            {/* Bottom content area */}
            <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-1">
              {/* Actor Name */}
              <h3 className="text-white text-sm sm:text-base font-semibold line-clamp-2">
                {actor.name}
              </h3>

              {/* Character if available */}
              {actor.character && (
                <p className="text-xs text-white/80 line-clamp-1">
                  {actor.character}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ActorCard;
