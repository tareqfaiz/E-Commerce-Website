import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  const login = async (userData) => {
    setLoading(true);
    try {
      if (userData) {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setLoading(false);
        return;
      }
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await API.get('/users/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const freshUserData = response.data;
          setUser(freshUserData);
          localStorage.setItem('user', JSON.stringify(freshUserData));
        } catch (error) {
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            logout();
          }
          setUser(null);
          localStorage.removeItem('user');
        }
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
    } catch (error) {
      setUser(null);
      localStorage.removeItem('user');
    }
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // New function to refresh token
  const refreshToken = useCallback(async () => {
    try {
      const response = await API.post('/auth/refresh-token', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.status === 200 && response.data.token) {
        localStorage.setItem('token', response.data.token);
        return true;
      }
    } catch (error) {
      logout();
      return false;
    }
  }, []);

  // Periodically refresh token every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        refreshToken();
      }
    }, 10 * 60 * 1000); // 10 minutes
    return () => clearInterval(interval);
  }, [user, refreshToken]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        }
      } catch (error) {
        logout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
