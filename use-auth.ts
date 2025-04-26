import { useState, useEffect, useCallback } from 'react';
import { auth, User } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [searchHistory, setSearchHistory] = useState<any[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const { toast } = useToast();
  
  // Initialize auth state on mount
  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);
  
  // Load user favorites when user changes 
  useEffect(() => {
    if (user) {
      const loadData = async () => {
        try {
          await fetchFavorites();
          await fetchSearchHistory();
        } catch (error) {
          console.error("Error loading user data:", error);
        }
      };
      
      loadData();
    } else {
      setFavorites([]);
      setSearchHistory([]);
    }
  }, [user]);
  
  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      const user = await auth.login(email, password);
      setUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  }, []);
  
  // Register function
  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const user = await auth.register(name, email, password);
      setUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  }, []);
  
  // Logout function
  const logout = useCallback(() => {
    auth.logout();
    setUser(null);
  }, []);
  
  // Fetch user favorites
  const fetchFavorites = useCallback(async () => {
    if (!user) return;
    
    setLoadingFavorites(true);
    try {
      const favorites = await auth.getUserFavorites(user.id);
      setFavorites(favorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast({
        title: 'Error',
        description: 'Failed to load favorites',
        variant: 'destructive',
      });
    } finally {
      setLoadingFavorites(false);
    }
  }, [user, toast]);
  
  // Add favorite
  const addFavorite = useCallback(async (partId: number) => {
    if (!user) return;
    
    try {
      await auth.addFavorite(user.id, partId);
      await fetchFavorites(); // Refresh favorites
      toast({
        title: 'Success',
        description: 'Part added to favorites',
      });
    } catch (error) {
      console.error('Error adding favorite:', error);
      toast({
        title: 'Error',
        description: 'Failed to add to favorites',
        variant: 'destructive',
      });
    }
  }, [user, fetchFavorites, toast]);
  
  // Remove favorite
  const removeFavorite = useCallback(async (partId: number) => {
    if (!user) return;
    
    try {
      await auth.removeFavorite(user.id, partId);
      await fetchFavorites(); // Refresh favorites
      toast({
        title: 'Success',
        description: 'Part removed from favorites',
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove from favorites',
        variant: 'destructive',
      });
    }
  }, [user, fetchFavorites, toast]);
  
  // Fetch search history
  const fetchSearchHistory = useCallback(async () => {
    if (!user) return;
    
    setLoadingHistory(true);
    try {
      const history = await auth.getSearchHistory(user.id);
      setSearchHistory(history);
    } catch (error) {
      console.error('Error fetching search history:', error);
      toast({
        title: 'Error',
        description: 'Failed to load search history',
        variant: 'destructive',
      });
    } finally {
      setLoadingHistory(false);
    }
  }, [user, toast]);
  
  // Save search to history
  const saveSearch = useCallback(async (searchData: any) => {
    if (!user) return;
    
    try {
      await auth.saveSearch(user.id, searchData);
      await fetchSearchHistory(); // Refresh history
    } catch (error) {
      console.error('Error saving search:', error);
      toast({
        title: 'Error',
        description: 'Failed to save search',
        variant: 'destructive',
      });
    }
  }, [user, fetchSearchHistory, toast]);
  
  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    favorites,
    searchHistory,
    loadingFavorites,
    loadingHistory,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    fetchSearchHistory,
    saveSearch
  };
}
