import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setDarkMode: (isDark: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Local storage key for theme
const THEME_STORAGE_KEY = 'moviedb_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const { currentUser, updatePreferences } = useAuth();

  // Initialize theme from user preferences or local storage
  useEffect(() => {
    if (currentUser) {
      // If user is logged in, use their preferences
      setIsDarkMode(currentUser.preferences.darkMode);
    } else {
      // Otherwise check local storage or system preference
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme) {
        setIsDarkMode(storedTheme === 'dark');
      } else {
        // Check for system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(prefersDark);
      }
    }
  }, [currentUser]);

  // Update document class and local storage when theme changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save to local storage
    localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? 'dark' : 'light');
    
    // Update user preferences if logged in
    if (currentUser) {
      updatePreferences({ darkMode: isDarkMode });
    }
  }, [isDarkMode, currentUser, updatePreferences]);

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Set theme directly
  const setDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark);
  };

  const value = {
    isDarkMode,
    toggleTheme,
    setDarkMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Hook for using the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
