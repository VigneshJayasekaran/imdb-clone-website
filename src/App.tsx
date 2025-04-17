import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { MovieProvider } from "./contexts/MovieContext";
import Layout from "./components/Layout";

// Pages
import Index from "./pages/Index";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import Actors from "./pages/Actors";
import ActorDetails from "./pages/ActorDetails";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Watchlist from "./pages/Watchlist";
import Favorites from "./pages/Favorites";
import FavoriteActors from "./pages/FavoriteActors";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <MovieProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/movies" element={<Movies />} />
                  <Route path="/movie/:id" element={<MovieDetails />} />
                  <Route path="/actors" element={<Actors />} />
                  <Route path="/actor/:id" element={<ActorDetails />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/watchlist" element={<Watchlist />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/favorite-actors" element={<FavoriteActors />} />
                  {/* Catch all not found route */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </MovieProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
