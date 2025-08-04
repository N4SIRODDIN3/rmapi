import { useState, useEffect } from 'react';
import { User, AuthTokens } from '../types';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);

  useEffect(() => {
    // Check for stored authentication
    const storedTokens = localStorage.getItem('rmapi-tokens');
    const storedUser = localStorage.getItem('rmapi-user');
    
    if (storedTokens && storedUser) {
      try {
        setTokens(JSON.parse(storedTokens));
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored auth data:', error);
        localStorage.removeItem('rmapi-tokens');
        localStorage.removeItem('rmapi-user');
      }
    }
  }, []);

  const login = async (deviceCode: string): Promise<void> => {
    try {
      // Simulate API call to authenticate with device code
      // In a real implementation, this would call the rmapi authentication endpoints
      const mockTokens: AuthTokens = {
        deviceToken: `device_${deviceCode}_${Date.now()}`,
        userToken: `user_${deviceCode}_${Date.now()}`
      };
      
      const mockUser: User = {
        email: 'user@example.com',
        syncVersion: '1.5'
      };

      setTokens(mockTokens);
      setUser(mockUser);
      setIsAuthenticated(true);

      // Store authentication data
      localStorage.setItem('rmapi-tokens', JSON.stringify(mockTokens));
      localStorage.setItem('rmapi-user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setTokens(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('rmapi-tokens');
    localStorage.removeItem('rmapi-user');
  };

  return {
    isAuthenticated,
    user,
    tokens,
    login,
    logout
  };
}