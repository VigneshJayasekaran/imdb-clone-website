
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, 
  Home, 
  Play, 
  Users, 
  UserCircle, 
  Bookmark, 
  Heart, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '../ui/sheet';

const MobileMenu: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  
  return (
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
  );
};

export default MobileMenu;
