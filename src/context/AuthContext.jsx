import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// ✅ YOUR BACKEND URL
const API_URL = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Load user on refresh
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));

          const res = await axios.get(`${API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          const userData = res.data.data.user;
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (err) {
          console.error('Token invalid:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  // ✅ REGISTER
  const register = useCallback(async (name, email, password, zipCode) => {
    try {
      setError(null);

      const res = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
        zipCode
      });

      const { user: userData, token } = res.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, message };
    }
  }, []);

  // ✅ LOGIN (MAIN FIX 🔥)
  const login = useCallback(async (email, password) => {
    try {
      setError(null);

      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      const { user: userData, token } = res.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    }
  }, []);

  // ✅ LOGOUT
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  }, []);

  // ✅ UPDATE ZIP CODE
  const updateZipCode = useCallback(async (zipCode) => {
    try {
      setError(null);
      const token = localStorage.getItem('token');

      const res = await axios.put(
        `${API_URL}/users/zipcode`,
        { zipCode },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const updatedUser = res.data.data.user;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update ZIP code';
      setError(message);
      return { success: false, message };
    }
  }, []);

  // ✅ UPDATE PROFILE
  const updateProfile = useCallback(async (data) => {
    try {
      setError(null);
      const token = localStorage.getItem('token');

      const res = await axios.put(
        `${API_URL}/users/profile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const updatedUser = res.data.data.user;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update profile';
      setError(message);
      return { success: false, message };
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateZipCode,
    updateProfile,
    clearError,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export default AuthContext;