import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Film, 
  Search, 
  User, 
  Menu, 
  X, 
  Heart, 
  Bookmark, 
  LogIn, 
  LogOut,
  Sun,
  Moon,
  Home,
  UserCircle,
  Settings,
  Play,
  Users
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useMovies } from '../contexts/MovieContext';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from './ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

const Navbar = () => {
  const { currentUser, isAuthenticated, login, logout, signup } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { search, clearSearch } = useMovies();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Signup form state
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupError, setSignupError] = useState('');

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset search when changing routes
  useEffect(() => {
    clearSearch();
    setSearchQuery('');
    setIsSearchExpanded(false);
  }, [location.pathname, clearSearch]);

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      search(searchQuery);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (!loginEmail || !loginPassword) {
      setLoginError('Please fill in all fields');
      return;
    }
    
    try {
      const success = await login(loginEmail, loginPassword);
      if (success) {
        // Reset form and close dialog
        setLoginEmail('');
        setLoginPassword('');
        // The dialog will be closed by the DOM
      } else {
        setLoginError('Invalid email or password');
      }
    } catch (error) {
      setLoginError('An error occurred. Please try again.');
    }
  };

  // Handle signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    
    if (!signupUsername || !signupEmail || !signupPassword || !signupConfirmPassword) {
      setSignupError('Please fill in all fields');
      return;
    }
    
    if (signupPassword !== signupConfirmPassword) {
      setSignupError('Passwords do not match');
      return;
    }
    
    try {
      const success = await signup(signupUsername, signupEmail, signupPassword);
      if (success) {
        // Reset form and close dialog
        setSignupUsername('');
        setSignupEmail('');
        setSignupPassword('');
        setSignupConfirmPassword('');
        // The dialog will be closed by the DOM
      } else {
        setSignupError('Email already exists or sign up failed');
      }
    } catch (error) {
      setSignupError('An error occurred. Please try again.');
    }
  };

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
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="nav-link text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/movies" className="nav-link text-foreground hover:text-primary transition-colors">
            Movies
          </Link>
          <Link to="/actors" className="nav-link text-foreground hover:text-primary transition-colors">
            Actors
          </Link>
        </nav>

        {/* Search, User menu and Mobile menu */}
        <div className="flex items-center space-x-2">
          {/* Search Bar */}
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

          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* User Menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/watchlist')}>
                  <Bookmark className="mr-2 h-4 w-4" />
                  <span>Watchlist</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/favorites')}>
                  <Heart className="mr-2 h-4 w-4" />
                  <span>Favorites</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/favorite-actors')}>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Favorite Actors</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              {/* Login Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Login to your account</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleLogin} className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="you@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input 
                        id="password" 
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                    {loginError && (
                      <p className="text-red-500 text-sm">{loginError}</p>
                    )}
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button type="submit">Login</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Signup Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default" size="sm">Sign Up</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create an account</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSignup} className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input 
                        id="username" 
                        value={signupUsername}
                        onChange={(e) => setSignupUsername(e.target.value)}
                        placeholder="johndoe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input 
                        id="signup-email" 
                        type="email" 
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="you@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input 
                        id="signup-password" 
                        type="password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input 
                        id="confirm-password" 
                        type="password"
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                    {signupError && (
                      <p className="text-red-500 text-sm">{signupError}</p>
                    )}
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button type="submit">Sign Up</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>IMDB</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col mt-6 space-y-4">
                <SheetClose asChild>
                  <Link to="/" className="flex items-center py-2 px-3 rounded-md hover:bg-accent">
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link to="/movies" className="flex items-center py-2 px-3 rounded-md hover:bg-accent">
                    <Play className="mr-2 h-4 w-4" />
                    Movies
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link to="/actors" className="flex items-center py-2 px-3 rounded-md hover:bg-accent">
                    <Users className="mr-2 h-4 w-4" />
                    Actors
                  </Link>
                </SheetClose>
                {isAuthenticated && (
                  <>
                    <SheetClose asChild>
                      <Link to="/profile" className="flex items-center py-2 px-3 rounded-md hover:bg-accent">
                        <UserCircle className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/watchlist" className="flex items-center py-2 px-3 rounded-md hover:bg-accent">
                        <Bookmark className="mr-2 h-4 w-4" />
                        Watchlist
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/favorites" className="flex items-center py-2 px-3 rounded-md hover:bg-accent">
                        <Heart className="mr-2 h-4 w-4" />
                        Favorites
                      </Link>
                    </SheetClose>
                    <div className="pt-4">
                      <Button 
                        onClick={() => {
                          logout();
                          document.querySelector<HTMLButtonElement>('[data-sheetclose]')?.click();
                        }} 
                        variant="outline"
                        className="w-full"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
