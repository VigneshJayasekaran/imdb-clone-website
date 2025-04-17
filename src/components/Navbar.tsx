
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useMovies } from '../contexts/MovieContext';

// Import subcomponents
import SearchBar from './navbar/SearchBar';
import ThemeToggle from './navbar/ThemeToggle';
import UserMenu from './navbar/UserMenu';
import MobileMenu from './navbar/MobileMenu';
import AuthButtons from './navbar/AuthButtons';
import NavLinks from './navbar/NavLinks';

const Navbar: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { clearSearch } = useMovies();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/90 backdrop-blur-md border-b shadow-sm' 
          : 'bg-gradient-to-b from-background/80 to-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Film className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">IMDB</span>
        </Link>

        {/* Desktop Navigation */}
        <NavLinks />

        {/* Search, User menu and Mobile menu */}
        <div className="flex items-center space-x-2">
          {/* Search Bar */}
          <SearchBar />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu or Auth Buttons */}
          {isAuthenticated ? <UserMenu /> : <AuthButtons />}

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
