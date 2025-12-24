import { createContext, useContext, useState, useEffect } from 'react';
import { profileAPI, authAPI } from '../api/axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log('[AuthProvider] Render - loading:', loading, 'user:', user ? 'exists' : 'null');

  // Check if user is logged in on mount
  useEffect(() => {
    console.log('[AuthProvider] useEffect - calling checkAuth');
    checkAuth();
  }, []);

  const checkAuth = async () => {
    console.log('[AuthProvider] checkAuth - starting');
    try {
      const response = await profileAPI.getProfile();
      console.log('[AuthProvider] checkAuth - success, user data:', response.data);
      setUser(response.data);
    } catch (error) {
      console.log('[AuthProvider] checkAuth - error:', error);
      setUser(null);
    } finally {
      console.log('[AuthProvider] checkAuth - setting loading to false');
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    await checkAuth(); // Fetch user data after login
    return response;
  };

  const signup = async (userData) => {
    const response = await authAPI.signup(userData);
    return response;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } finally {
      setUser(null);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateUser,
    checkAuth,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
