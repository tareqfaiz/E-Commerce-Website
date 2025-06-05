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
      }
      const token = localStorage.getItem('token');
      if (token) {
        const response = await API.get('/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const freshUserData = response.data;
        setUser(freshUserData);
        localStorage.setItem('user', JSON.stringify(freshUserData));
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
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
