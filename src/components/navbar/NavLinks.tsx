
import React from 'react';
import { Link } from 'react-router-dom';

const NavLinks: React.FC = () => {
  return (
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
  );
};

export default NavLinks;
