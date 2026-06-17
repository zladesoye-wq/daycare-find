import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

const STORAGE_KEY_TOKEN = '@daycarefind_token';
const STORAGE_KEY_USER = '@daycarefind_user';
const STORAGE_KEY_ROLE = '@daycarefind_role';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null); // 'parent' | 'provider' | 'admin'
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load stored auth state on mount
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem(STORAGE_KEY_TOKEN);
      const storedUser = await AsyncStorage.getItem(STORAGE_KEY_USER);
      const storedRole = await AsyncStorage.getItem(STORAGE_KEY_ROLE);

      if (storedToken && storedUser && storedRole) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setRole(storedRole);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.warn('Failed to load stored auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData, authToken, userRole) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_TOKEN, authToken);
      await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
      await AsyncStorage.setItem(STORAGE_KEY_ROLE, userRole);
      setToken(authToken);
      setUser(userData);
      setRole(userRole);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to store auth:', error);
      throw error;
    }
  };

  const register = async (userData, authToken, userRole) => {
    await login(userData, authToken, userRole);
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEY_TOKEN,
        STORAGE_KEY_USER,
        STORAGE_KEY_ROLE,
      ]);
      setToken(null);
      setUser(null);
      setRole(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Failed to clear auth:', error);
    }
  };

  const updateUser = async (userData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser,
        setRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;