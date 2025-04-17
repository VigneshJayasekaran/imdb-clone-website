
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMovies } from '../../contexts/MovieContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const SearchBar: React.FC = () => {
  const { search } = useMovies();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      search(searchQuery);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <form 
      onSubmit={handleSearchSubmit} 
      className={`relative transition-all duration-300 ${
        isSearchExpanded ? 'w-60' : 'w-10'
      }`}
    >
      <Input
        type="text"
        placeholder="Search movies, actors..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsSearchExpanded(true)}
        onBlur={() => !searchQuery && setIsSearchExpanded(false)}
        className={`rounded-full bg-background border-muted pr-10 ${
          isSearchExpanded ? 'pl-4 w-full opacity-100' : 'w-10 h-10 pl-10 opacity-0'
        }`}
      />
      <Button
        type={isSearchExpanded ? 'submit' : 'button'}
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-10 w-10 rounded-full"
        onClick={() => !isSearchExpanded && setIsSearchExpanded(true)}
      >
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default SearchBar;
