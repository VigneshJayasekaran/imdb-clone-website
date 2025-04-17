
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { searchActors, Actor } from '../lib/api';
import ActorCard from '../components/ActorCard';

const Actors = () => {
  const [actors, setActors] = useState<Actor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadActors = async () => {
      try {
        setIsLoading(true);
        // We'll use the search function with an empty string to get all actors
        const data = await searchActors('');
        setActors(data.results);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadActors();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Popular Actors</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-pulse">Loading actors...</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {actors.map(actor => (
            <ActorCard key={actor.id} actor={actor} size="sm" />
          ))}
        </div>
      )}
    </div>
  );
};

export default Actors;
