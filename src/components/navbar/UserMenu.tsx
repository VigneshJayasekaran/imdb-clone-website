
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  UserCircle, 
  Bookmark, 
  Heart, 
  Settings,
  LogOut,
  Users
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const UserMenu: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  return (
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
  );
};

export default UserMenu;
