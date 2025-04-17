
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the user type
export interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  watchlist: number[];
  favorites: number[];
  favoriteActors: number[];
  ratings: { [movieId: number]: number };
  reviews: Array<{
    id: string;
    movieId: number;
    rating: number;
    text: string;
    date: string;
  }>;
  preferences: {
    genres: number[];
    darkMode: boolean;
    viewMode: 'grid' | 'list';
  };
}

// Initial mock users for demo
const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'moviefan',
    email: 'demo@example.com',
    profilePicture: 'https://ui-avatars.com/api/?name=Movie+Fan&background=random',
    watchlist: [1, 7, 11],
    favorites: [2, 3, 4],
    favoriteActors: [1, 5, 9],
    ratings: { 1: 5, 2: 4, 3: 5, 4: 4.5 },
    reviews: [
      {
        id: 'rev1',
        movieId: 1,
        rating: 5,
        text: 'One of the most mind-bending films I have ever seen. Christopher Nolan is a genius!',
        date: '2023-01-15',
      },
      {
        id: 'rev2',
        movieId: 2,
        rating: 4,
        text: 'A classic tale of redemption. The acting is superb.',
        date: '2023-02-22',
      },
    ],
    preferences: {
      genres: [28, 878, 18],
      darkMode: true,
      viewMode: 'grid',
    },
  },
];

// Create the auth context
type AuthContextType = {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => void;
  addToWatchlist: (movieId: number) => void;
  removeFromWatchlist: (movieId: number) => void;
  addToFavorites: (movieId: number) => void;
  removeFromFavorites: (movieId: number) => void;
  addToFavoriteActors: (actorId: number) => void;
  removeFromFavoriteActors: (actorId: number) => void;
  rateMovie: (movieId: number, rating: number) => void;
  addReview: (movieId: number, rating: number, text: string) => void;
  updateReview: (reviewId: string, rating: number, text: string) => void;
  deleteReview: (reviewId: string) => void;
  updatePreferences: (preferences: Partial<User['preferences']>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage keys
const USER_STORAGE_KEY = 'moviedb_user';
const USERS_STORAGE_KEY = 'moviedb_users';

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load users from localStorage on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      // Initialize with mock users if none exist
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(MOCK_USERS));
      setUsers(MOCK_USERS);
    }

    // Check for existing login
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }
  }, [users]);

  // Save current user to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
      
      // Also update this user in the users array
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === currentUser.id ? currentUser : user
        )
      );
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [currentUser]);

  // Auth functions
  const login = async (email: string, password: string): Promise<boolean> => {
    // For demo, we don't validate password since it's not stored
    const user = users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    // Check if email already exists
    if (users.some(u => u.email === email)) {
      return false;
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`,
      watchlist: [],
      favorites: [],
      favoriteActors: [],
      ratings: {},
      reviews: [],
      preferences: {
        genres: [],
        darkMode: true,
        viewMode: 'grid',
      },
    };

    // Add to users and set as current
    setUsers(prevUsers => [...prevUsers, newUser]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    return true;
  };

  // User update functions
  const updateUser = (userData: Partial<User>) => {
    if (!currentUser) return;
    setCurrentUser({ ...currentUser, ...userData });
  };

  const addToWatchlist = (movieId: number) => {
    if (!currentUser) return;
    if (!currentUser.watchlist.includes(movieId)) {
      setCurrentUser({
        ...currentUser,
        watchlist: [...currentUser.watchlist, movieId],
      });
    }
  };

  const removeFromWatchlist = (movieId: number) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      watchlist: currentUser.watchlist.filter(id => id !== movieId),
    });
  };

  const addToFavorites = (movieId: number) => {
    if (!currentUser) return;
    if (!currentUser.favorites.includes(movieId)) {
      setCurrentUser({
        ...currentUser,
        favorites: [...currentUser.favorites, movieId],
      });
    }
  };

  const removeFromFavorites = (movieId: number) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      favorites: currentUser.favorites.filter(id => id !== movieId),
    });
  };

  const addToFavoriteActors = (actorId: number) => {
    if (!currentUser) return;
    if (!currentUser.favoriteActors.includes(actorId)) {
      setCurrentUser({
        ...currentUser,
        favoriteActors: [...currentUser.favoriteActors, actorId],
      });
    }
  };

  const removeFromFavoriteActors = (actorId: number) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      favoriteActors: currentUser.favoriteActors.filter(id => id !== actorId),
    });
  };

  const rateMovie = (movieId: number, rating: number) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      ratings: {
        ...currentUser.ratings,
        [movieId]: rating,
      },
    });
  };

  const addReview = (movieId: number, rating: number, text: string) => {
    if (!currentUser) return;
    const newReview = {
      id: `rev-${Date.now()}`,
      movieId,
      rating,
      text,
      date: new Date().toISOString().split('T')[0],
    };
    
    setCurrentUser({
      ...currentUser,
      reviews: [...currentUser.reviews, newReview],
      ratings: {
        ...currentUser.ratings,
        [movieId]: rating,
      },
    });
  };

  const updateReview = (reviewId: string, rating: number, text: string) => {
    if (!currentUser) return;
    
    const updatedReviews = currentUser.reviews.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          rating,
          text,
          date: new Date().toISOString().split('T')[0], // Update date
        };
      }
      return review;
    });
    
    setCurrentUser({
      ...currentUser,
      reviews: updatedReviews,
      ratings: {
        ...currentUser.ratings,
        [currentUser.reviews.find(r => r.id === reviewId)?.movieId || 0]: rating,
      },
    });
  };

  const deleteReview = (reviewId: string) => {
    if (!currentUser) return;
    
    setCurrentUser({
      ...currentUser,
      reviews: currentUser.reviews.filter(review => review.id !== reviewId),
    });
  };

  const updatePreferences = (preferences: Partial<User['preferences']>) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      preferences: {
        ...currentUser.preferences,
        ...preferences,
      },
    });
  };

  const value = {
    currentUser,
    isAuthenticated,
    login,
    logout,
    signup,
    updateUser,
    addToWatchlist,
    removeFromWatchlist,
    addToFavorites,
    removeFromFavorites,
    addToFavoriteActors,
    removeFromFavoriteActors,
    rateMovie,
    addReview,
    updateReview,
    deleteReview,
    updatePreferences,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook for using the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
