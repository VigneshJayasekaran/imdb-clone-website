
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  getMovies, 
  getGenres, 
  searchMovies, 
  Movie, 
  Genre 
} from '../lib/api';

type MovieContextType = {
  movies: Movie[];
  genres: Genre[];
  trendingMovies: Movie[];
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalResults: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Movie[];
  fetchMovies: (page?: number) => Promise<void>;
  search: (query: string) => Promise<void>;
  clearSearch: () => void;
  // Filtering
  activeGenreFilters: number[];
  toggleGenreFilter: (genreId: number) => void;
  clearGenreFilters: () => void;
  yearRange: [number, number];
  setYearRange: (range: [number, number]) => void;
  ratingRange: [number, number];
  setRatingRange: (range: [number, number]) => void;
  filteredMovies: Movie[];
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  getMoviesByIds: (ids: number[]) => Movie[];
  setActiveFilters: (filters: { 
    genreIds?: number[], 
    years?: [number, number], 
    ratings?: [number, number] 
  }) => void;
};

type MovieFilter = {
  genreIds: number[];
  years: [number, number];
  ratings: [number, number];
};

const MovieContext = createContext<MovieContextType | undefined>(undefined);

const currentYear = new Date().getFullYear();
const DEFAULT_YEAR_RANGE: [number, number] = [1970, currentYear];
const DEFAULT_RATING_RANGE: [number, number] = [0, 10];

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filtering state
  const [filters, setFilters] = useState<MovieFilter>({
    genreIds: [],
    years: DEFAULT_YEAR_RANGE,
    ratings: DEFAULT_RATING_RANGE,
  });

  // Computed filtered movies
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);

  // Load genres on mount
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genreData = await getGenres();
        setGenres(genreData);
      } catch (err) {
        setError('Failed to load genres');
        console.error(err);
      }
    };

    loadGenres();
  }, []);

  // Load initial movies
  useEffect(() => {
    fetchMovies();
  }, []);

  // Apply filters whenever movies or filters change
  useEffect(() => {
    const applyFilters = () => {
      const moviesToFilter = searchQuery ? searchResults : movies;
      
      const filtered = moviesToFilter.filter(movie => {
        // Filter by genre if any genre filters are active
        const genreMatch = filters.genreIds.length === 0 || 
          movie.genre_ids.some(genreId => filters.genreIds.includes(genreId));
        
        // Filter by year
        const releaseYear = movie.release_date ? 
          parseInt(movie.release_date.split('-')[0]) : 0;
        const yearMatch = releaseYear >= filters.years[0] && 
          releaseYear <= filters.years[1];
        
        // Filter by rating
        const ratingMatch = movie.vote_average >= filters.ratings[0] && 
          movie.vote_average <= filters.ratings[1];
        
        return genreMatch && yearMatch && ratingMatch;
      });
      
      setFilteredMovies(filtered);
    };
    
    applyFilters();
  }, [movies, searchResults, searchQuery, filters]);

  // Set trending movies (top 10 by popularity)
  useEffect(() => {
    if (movies.length > 0) {
      const trending = [...movies]
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 10);
      setTrendingMovies(trending);
    }
  }, [movies]);

  // Fetch movies function
  const fetchMovies = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMovies(page);
      setMovies(data.results);
      setTotalPages(data.total_pages);
      setTotalResults(data.total_results);
      setCurrentPage(data.page);
    } catch (err) {
      setError('Failed to load movies');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Search function
  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      clearSearch();
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await searchMovies(query);
      setSearchResults(data.results);
      setSearchQuery(query);
    } catch (err) {
      setError('Search failed');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  // Filter functions
  const toggleGenreFilter = useCallback((genreId: number) => {
    setFilters(prev => {
      const isActive = prev.genreIds.includes(genreId);
      return {
        ...prev,
        genreIds: isActive
          ? prev.genreIds.filter(id => id !== genreId)
          : [...prev.genreIds, genreId],
      };
    });
  }, []);

  const clearGenreFilters = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      genreIds: [],
    }));
  }, []);

  const setYearRange = useCallback((range: [number, number]) => {
    setFilters(prev => ({
      ...prev,
      years: range,
    }));
  }, []);

  const setRatingRange = useCallback((range: [number, number]) => {
    setFilters(prev => ({
      ...prev,
      ratings: range,
    }));
  }, []);

  const setActiveFilters = useCallback((newFilters: {
    genreIds?: number[],
    years?: [number, number],
    ratings?: [number, number]
  }) => {
    setFilters(prev => ({
      ...prev,
      ...(newFilters.genreIds !== undefined && { genreIds: newFilters.genreIds }),
      ...(newFilters.years !== undefined && { years: newFilters.years }),
      ...(newFilters.ratings !== undefined && { ratings: newFilters.ratings }),
    }));
  }, []);

  // Get multiple movies by IDs (for watchlist, favorites, etc.)
  const getMoviesByIds = useCallback((ids: number[]): Movie[] => {
    return movies.filter(movie => ids.includes(movie.id));
  }, [movies]);

  const value = {
    movies,
    genres,
    trendingMovies,
    isLoading,
    error,
    totalPages,
    currentPage,
    setCurrentPage,
    totalResults,
    searchQuery,
    setSearchQuery,
    searchResults,
    fetchMovies,
    search,
    clearSearch,
    activeGenreFilters: filters.genreIds,
    toggleGenreFilter,
    clearGenreFilters,
    yearRange: filters.years,
    setYearRange,
    ratingRange: filters.ratings,
    setRatingRange,
    filteredMovies,
    viewMode,
    setViewMode,
    getMoviesByIds,
    setActiveFilters,
  };

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
};

// Hook for using the movie context
export const useMovies = (): MovieContextType => {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
};
