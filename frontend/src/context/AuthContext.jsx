import React, { createContext, useContext, useState, useEffect } from 'react';

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
        // If no token, clear user state
        setUser(null);
        localStorage.removeItem('user');
      }
    } catch (error) {
      // On error, clear user state
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

  useEffect(() => {
    // Optionally, validate token or refresh session here
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        }
      } catch (error) {
        // Invalid token format
        logout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
