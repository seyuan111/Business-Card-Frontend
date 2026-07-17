// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const applyAuthState = (nextUser, nextAuthenticated, token = null) => {
    setUser(nextUser);
    setIsAuthenticated(nextAuthenticated);
    setLoading(false);

    if (nextAuthenticated && token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(nextUser));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/check-auth`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          });

          const authUser = response?.data?.user || null;
          if (authUser) {
            applyAuthState(authUser, true, token);
          } else {
            throw new Error('No user returned from auth check');
          }
        } catch (error) {
          console.error('Auth verification failed:', error);
          applyAuthState(null, false, null);
        }
        return;
      }

      applyAuthState(null, false, null);
    };

    const onAuthChanged = () => {
      const token = localStorage.getItem('token');
      if (token) {
        const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
        applyAuthState(storedUser, true, token);
      } else {
        applyAuthState(null, false, null);
      }
    };

    window.addEventListener('auth-state-changed', onAuthChanged);
    checkAuth();

    return () => {
      window.removeEventListener('auth-state-changed', onAuthChanged);
    };
  }, []);

  const login = (userData, token) => {
    if (!userData || !token) {
      return;
    }

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    setLoading(false);
    window.dispatchEvent(new Event('auth-state-changed'));
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/logout`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      window.dispatchEvent(new Event('auth-state-changed'));
      navigate('/login');
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    setUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
