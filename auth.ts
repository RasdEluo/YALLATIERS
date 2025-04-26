export interface User {
  id: number;
  name: string;
  email: string;
}

// Local storage keys
const USER_KEY = 'yallaTiersUser';

// API Endpoints
const REGISTER_URL = '/api/auth/register';
const LOGIN_URL = '/api/auth/login';

// Authentication service using API
export const auth = {
  // Register a new user
  register: async (name: string, email: string, password: string): Promise<User> => {
    try {
      const response = await fetch(REGISTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      const user = await response.json();
      
      // Store user in localStorage
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  // Login existing user
  login: async (email: string, password: string): Promise<User> => {
    try {
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const user = await response.json();
      
      // Store user in localStorage
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Logout current user
  logout: (): void => {
    localStorage.removeItem(USER_KEY);
  },
  
  // Get current user from localStorage
  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem(USER_KEY);
    if (!userJson) return null;
    
    try {
      return JSON.parse(userJson);
    } catch (e) {
      console.error('Error parsing user from localStorage:', e);
      return null;
    }
  },
  
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!auth.getCurrentUser();
  },
  
  // Get user favorites
  getUserFavorites: async (userId: number): Promise<any[]> => {
    try {
      const response = await fetch(`/api/user/favorites?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
  },
  
  // Add favorite
  addFavorite: async (userId: number, partId: number): Promise<void> => {
    try {
      const response = await fetch('/api/user/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          partId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add favorite');
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  },
  
  // Remove favorite
  removeFavorite: async (userId: number, partId: number): Promise<void> => {
    try {
      const response = await fetch(`/api/user/favorites?userId=${userId}&partId=${partId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove favorite');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  },
  
  // Get user search history
  getSearchHistory: async (userId: number): Promise<any[]> => {
    try {
      const response = await fetch(`/api/user/search-history?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch search history');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching search history:', error);
      return [];
    }
  },
  
  // Save search to history
  saveSearch: async (userId: number, searchData: any): Promise<void> => {
    try {
      const response = await fetch('/api/user/search-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...searchData,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save search history');
      }
    } catch (error) {
      console.error('Error saving search history:', error);
      throw error;
    }
  }
};
