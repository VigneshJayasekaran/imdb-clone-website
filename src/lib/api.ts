
import axios from 'axios';

// Base URL for The Movie Database API
const BASE_URL = 'https://api.themoviedb.org/3';
// We're using a demo API key for development. In production, this should be handled securely.
// This is a mock key that would be replaced with a real one in production
const API_KEY = 'mock_api_key_12345';
const API_READ_ACCESS_TOKEN = 'mock_access_token_67890';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_READ_ACCESS_TOKEN}`
  }
});

// Types for API responses
export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
}

export interface Actor {
  id: number;
  name: string;
  profile_path: string | null;
  character?: string;
  known_for_department: string;
  popularity: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number;
  tagline: string;
  status: string;
  budget: number;
  revenue: number;
  credits: {
    cast: Actor[];
    crew: {
      id: number;
      name: string;
      job: string;
      department: string;
    }[];
  };
  videos: {
    results: {
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }[];
  };
}

// For mock data generation
const generateMockData = () => {
  // This function creates mock data since we're not using a real API key
  return {
    mockMovies,
    mockGenres,
    mockActors
  };
};

// API Functions
export const getMovies = async (page = 1) => {
  try {
    // In a real app, this would call the actual API
    // const response = await api.get(`/movie/popular`, { params: { page } });
    // return response.data;
    
    // For now, return mock data
    return {
      results: mockMovies,
      page,
      total_pages: 5,
      total_results: mockMovies.length * 5
    };
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

export const searchMovies = async (query: string, page = 1) => {
  try {
    // In a real app, this would call the actual API
    // const response = await api.get(`/search/movie`, { params: { query, page } });
    // return response.data;
    
    // For now, filter mock data
    const filteredMovies = mockMovies.filter(movie => 
      movie.title.toLowerCase().includes(query.toLowerCase())
    );
    
    return {
      results: filteredMovies,
      page,
      total_pages: 1,
      total_results: filteredMovies.length
    };
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const getGenres = async () => {
  try {
    // In a real app, this would call the actual API
    // const response = await api.get(`/genre/movie/list`);
    // return response.data.genres;
    
    // For now, return mock data
    return mockGenres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

export const getMovieDetails = async (id: number) => {
  try {
    // In a real app, this would call the actual API
    // const response = await api.get(`/movie/${id}`, {
    //   params: { append_to_response: 'credits,videos' }
    // });
    // return response.data;
    
    // For now, find in mock data
    const movie = mockMovies.find(m => m.id === id);
    if (!movie) throw new Error('Movie not found');
    
    // Combine with additional mock details
    return {
      ...movie,
      genres: movie.genre_ids.map(id => mockGenres.find(g => g.id === id) || { id, name: 'Unknown' }),
      runtime: Math.floor(Math.random() * 60) + 90, // Random runtime between 90-150 min
      tagline: 'A mock tagline for this movie',
      status: 'Released',
      budget: Math.floor(Math.random() * 15000) * 100000,
      revenue: Math.floor(Math.random() * 50000) * 100000,
      credits: {
        cast: mockActors.slice(0, 10).map(actor => ({
          ...actor,
          character: `Character ${Math.floor(Math.random() * 100)}`
        })),
        crew: mockActors.slice(10, 15).map(actor => ({
          id: actor.id,
          name: actor.name,
          job: ['Director', 'Producer', 'Writer', 'Cinematographer'][Math.floor(Math.random() * 4)],
          department: 'Production'
        }))
      },
      videos: {
        results: [
          {
            id: 'mock1',
            key: 'dQw4w9WgXcQ', // Rick roll as placeholder
            name: 'Official Trailer',
            site: 'YouTube',
            type: 'Trailer'
          },
          {
            id: 'mock2',
            key: 'dQw4w9WgXcQ',
            name: 'Teaser',
            site: 'YouTube',
            type: 'Teaser'
          }
        ]
      }
    };
  } catch (error) {
    console.error(`Error fetching movie details for ID ${id}:`, error);
    throw error;
  }
};

export const getActor = async (id: number) => {
  try {
    // In a real app, this would call the actual API
    // const response = await api.get(`/person/${id}`, {
    //   params: { append_to_response: 'movie_credits' }
    // });
    // return response.data;
    
    // For now, find in mock data
    const actor = mockActors.find(a => a.id === id);
    if (!actor) throw new Error('Actor not found');
    
    // Add random movies
    const randomMovies = [];
    const numMovies = Math.floor(Math.random() * 5) + 3; // 3-8 movies
    const usedIndices = new Set();
    
    for (let i = 0; i < numMovies; i++) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * mockMovies.length);
      } while (usedIndices.has(randomIndex));
      
      usedIndices.add(randomIndex);
      randomMovies.push(mockMovies[randomIndex]);
    }
    
    return {
      ...actor,
      biography: `This is a mock biography for ${actor.name}. In a real application, this would contain the actor's actual biography pulled from an API.`,
      birthday: '1980-01-01', // Mock birthday
      place_of_birth: 'Hollywood, CA',
      movie_credits: {
        cast: randomMovies.map(movie => ({
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          character: `Character in ${movie.title}`,
          release_date: movie.release_date
        }))
      }
    };
  } catch (error) {
    console.error(`Error fetching actor details for ID ${id}:`, error);
    throw error;
  }
};

export const searchActors = async (query: string, page = 1) => {
  try {
    // In a real app, this would call the actual API
    // const response = await api.get(`/search/person`, { params: { query, page } });
    // return response.data;
    
    // For now, filter mock data
    const filteredActors = mockActors.filter(actor => 
      actor.name.toLowerCase().includes(query.toLowerCase())
    );
    
    return {
      results: filteredActors,
      page,
      total_pages: 1,
      total_results: filteredActors.length
    };
  } catch (error) {
    console.error('Error searching actors:', error);
    throw error;
  }
};

// Mock Data
const mockGenres: Genre[] = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' }
];

const mockMovies: Movie[] = [
  {
    id: 1,
    title: 'Inception',
    poster_path: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    backdrop_path: '/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
    overview: 'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: "inception", the implantation of another person\'s idea into a target\'s subconscious.',
    release_date: '2010-07-16',
    vote_average: 8.4,
    vote_count: 32432,
    genre_ids: [28, 878, 53],
    popularity: 112.125
  },
  {
    id: 2,
    title: 'The Shawshank Redemption',
    poster_path: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    backdrop_path: '/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
    overview: 'Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden. During his long stretch in prison, Dufresne comes to be admired by the other inmates -- including an older prisoner named Red -- for his integrity and unquenchable sense of hope.',
    release_date: '1994-09-23',
    vote_average: 8.7,
    vote_count: 24574,
    genre_ids: [18, 80],
    popularity: 95.456
  },
  {
    id: 3,
    title: 'The Godfather',
    poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    backdrop_path: '/rSPw7tgCH9c6NqICZef4kZjFOQ5.jpg',
    overview: 'Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.',
    release_date: '1972-03-14',
    vote_average: 8.7,
    vote_count: 18156,
    genre_ids: [18, 80],
    popularity: 88.236
  },
  {
    id: 4,
    title: 'The Dark Knight',
    poster_path: '/1hRoyzDtpgMU7Dz4JF22RANzQO7.jpg',
    backdrop_path: '/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
    overview: 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.',
    release_date: '2008-07-16',
    vote_average: 8.5,
    vote_count: 29961,
    genre_ids: [28, 80, 18, 53],
    popularity: 104.563
  },
  {
    id: 5,
    title: 'Pulp Fiction',
    poster_path: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    backdrop_path: '/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg',
    overview: 'A burger-loving hit man, his philosophical partner, a drug-addled gangster\'s moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip back and forth in time.',
    release_date: '1994-09-10',
    vote_average: 8.5,
    vote_count: 25006,
    genre_ids: [53, 80],
    popularity: 78.652
  },
  {
    id: 6,
    title: 'The Matrix',
    poster_path: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    backdrop_path: '/2u7zbn8EudG6kLlBzUYqP8RyFU4.jpg',
    overview: 'Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.',
    release_date: '1999-03-30',
    vote_average: 8.2,
    vote_count: 20767,
    genre_ids: [28, 878],
    popularity: 83.754
  },
  {
    id: 7,
    title: 'Interstellar',
    poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop_path: '/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
    release_date: '2014-11-05',
    vote_average: 8.4,
    vote_count: 29894,
    genre_ids: [12, 18, 878],
    popularity: 115.32
  },
  {
    id: 8,
    title: 'Fight Club',
    poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    backdrop_path: '/52AfXWuXCHn3UjD17rBruA9f5qb.jpg',
    overview: 'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground "fight clubs" forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.',
    release_date: '1999-10-15',
    vote_average: 8.4,
    vote_count: 24461,
    genre_ids: [18],
    popularity: 75.36
  },
  {
    id: 9,
    title: 'Parasite',
    poster_path: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    backdrop_path: '/ApiBzeaa95TNYliSbQ8pJv4Fje7.jpg',
    overview: 'All unemployed, Ki-taek\'s family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.',
    release_date: '2019-05-30',
    vote_average: 8.5,
    vote_count: 14636,
    genre_ids: [35, 53, 18],
    popularity: 97.42
  },
  {
    id: 10,
    title: 'The Lord of the Rings: The Return of the King',
    poster_path: '/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg',
    backdrop_path: '/1XOSh6BFZbQ0xN75m4avqgzClyG.jpg',
    overview: 'Aragorn is revealed as the heir to the ancient kings as he, Gandalf and the other members of the broken fellowship struggle to save Gondor from Sauron\'s forces. Meanwhile, Frodo and Sam take the ring closer to the heart of Mordor, the dark lord\'s realm.',
    release_date: '2003-12-01',
    vote_average: 8.5,
    vote_count: 20940,
    genre_ids: [12, 14, 28],
    popularity: 84.32
  },
  {
    id: 11,
    title: 'Avengers: Endgame',
    poster_path: '/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    backdrop_path: '/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
    overview: 'After the devastating events of Avengers: Infinity War, the universe is in ruins due to the efforts of the Mad Titan, Thanos. With the help of remaining allies, the Avengers must assemble once more in order to undo Thanos\' actions and restore order to the universe once and for all, no matter what consequences may be in store.',
    release_date: '2019-04-24',
    vote_average: 8.3,
    vote_count: 22916,
    genre_ids: [12, 28, 878],
    popularity: 132.45
  },
  {
    id: 12,
    title: 'Joker',
    poster_path: '/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
    backdrop_path: '/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg',
    overview: 'During the 1980s, a failed stand-up comedian is driven insane and turns to a life of crime and chaos in Gotham City while becoming an infamous psychopathic crime figure.',
    release_date: '2019-10-02',
    vote_average: 8.2,
    vote_count: 20321,
    genre_ids: [80, 53, 18],
    popularity: 95.76
  }
];

const mockActors: Actor[] = [
  {
    id: 1,
    name: 'Leonardo DiCaprio',
    profile_path: '/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg',
    known_for_department: 'Acting',
    popularity: 95.42
  },
  {
    id: 2,
    name: 'Brad Pitt',
    profile_path: '/kU3B75TyRiCgE270EyZnHjfivoq.jpg',
    known_for_department: 'Acting',
    popularity: 87.34
  },
  {
    id: 3,
    name: 'Meryl Streep',
    profile_path: '/r3oJkdyBOs3RRlLXyoaXzeqkZZR.jpg',
    known_for_department: 'Acting',
    popularity: 76.89
  },
  {
    id: 4,
    name: 'Tom Hanks',
    profile_path: '/xndWFsBlClOJFRdhziIRO8MgO9L.jpg',
    known_for_department: 'Acting',
    popularity: 82.56
  },
  {
    id: 5,
    name: 'Robert Downey Jr.',
    profile_path: '/5qHNjhtjMD4YWH3UP0rm4tKwxCL.jpg',
    known_for_department: 'Acting',
    popularity: 90.23
  },
  {
    id: 6,
    name: 'Scarlett Johansson',
    profile_path: '/6NsMbJXRlDZuDzatN2akFdGuTvx.jpg',
    known_for_department: 'Acting',
    popularity: 88.76
  },
  {
    id: 7,
    name: 'Morgan Freeman',
    profile_path: '/oIciQWr8VwKoR8TmAw1owaiZFyb.jpg',
    known_for_department: 'Acting',
    popularity: 75.34
  },
  {
    id: 8,
    name: 'Jennifer Lawrence',
    profile_path: '/blKKsHlJIL9PmUQZB8f3YmMBW5Y.jpg',
    known_for_department: 'Acting',
    popularity: 84.21
  },
  {
    id: 9,
    name: 'Denzel Washington',
    profile_path: '/jj2Gcobpopokal0YstuCQW0ldJ4.jpg',
    known_for_department: 'Acting',
    popularity: 78.45
  },
  {
    id: 10,
    name: 'Emma Stone',
    profile_path: '/2hwXbPW2ffnXUe1Um0WXHG0cTwb.jpg',
    known_for_department: 'Acting',
    popularity: 79.87
  },
  {
    id: 11,
    name: 'Johnny Depp',
    profile_path: '/kbWValANhZI8rbWZXximXuMN4UN.jpg',
    known_for_department: 'Acting',
    popularity: 83.92
  },
  {
    id: 12,
    name: 'Anne Hathaway',
    profile_path: '/tLelKoPNiyJCSEtQTz1FGv4TLGc.jpg',
    known_for_department: 'Acting',
    popularity: 76.23
  },
  {
    id: 13,
    name: 'Chris Hemsworth',
    profile_path: '/jpurJ9jAcLCYjgHHfYF32m3zJYm.jpg',
    known_for_department: 'Acting',
    popularity: 86.45
  },
  {
    id: 14,
    name: 'Viola Davis',
    profile_path: '/xDssw3ME8cvQ8p5Q1jdQWxW1PpN.jpg',
    known_for_department: 'Acting',
    popularity: 73.78
  },
  {
    id: 15,
    name: 'Ryan Gosling',
    profile_path: '/lyUyVARQKhGxeoiWuD5wm8yPpEn.jpg',
    known_for_department: 'Acting',
    popularity: 84.56
  }
];

export default api;
