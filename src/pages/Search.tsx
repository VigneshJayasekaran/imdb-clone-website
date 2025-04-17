
import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useMovies } from '../contexts/MovieContext';
import MovieCard from '../components/MovieCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { searchActors, Actor } from '../lib/api';
import ActorCard from '@/components/ActorCard';

const Search = () => {
  const location = useLocation();
  const { searchQuery, searchResults, search, isLoading } = useMovies();
  const [actors, setActors] = useState<Actor[]>([]);
  const [actorsLoading, setActorsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('movies');

  // Get query from URL
  useEffect(() => {
    const query = new URLSearchParams(location.search).get('q');
    if (query) {
      search(query);
      searchActors(query).then(data => {
        setActors(data.results);
        setActorsLoading(false);
      }).catch(err => {
        console.error(err);
        setActorsLoading(false);
      });
    }
  }, [location.search, search]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Search Results for: <span className="text-primary">{searchQuery}</span>
      </h1>

      <Tabs defaultValue="movies" className="mb-8" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="movies">
            Movies ({searchResults.length})
          </TabsTrigger>
          <TabsTrigger value="actors">
            Actors ({actors.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="movies">
          {isLoading ? (
            <div className="flex justify-center items-center h-60">
              <div className="animate-pulse">Searching movies...</div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {searchResults.map(movie => (
                <MovieCard key={movie.id} movie={movie} size="sm" />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No movies found for "{searchQuery}"</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="actors">
          {actorsLoading ? (
            <div className="flex justify-center items-center h-60">
              <div className="animate-pulse">Searching actors...</div>
            </div>
          ) : actors.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {actors.map(actor => (
                <ActorCard key={actor.id} actor={actor} size="sm" />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No actors found for "{searchQuery}"</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Search;
