import React, { createContext, useContext, useState, useEffect } from 'react';

import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Customer auth state
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  // Admin auth state
  const [adminUser, setAdminUser] = useState(() => {
    const storedAdminUser = localStorage.getItem('adminUser');
    return storedAdminUser ? JSON.parse(storedAdminUser) : null;
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(!!adminUser);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  useEffect(() => {
    setIsAdminAuthenticated(!!adminUser);
  }, [adminUser]);

  // Customer login
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
        const response = await API.get('/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const freshUserData = response.data;
        setUser(freshUserData);
        localStorage.setItem('user', JSON.stringify(freshUserData));
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

  // Admin login
  const adminLogin = async (adminData) => {
    setLoading(true);
    try {
      if (adminData) {
        setAdminUser(adminData);
        localStorage.setItem('adminUser', JSON.stringify(adminData));
        setLoading(false);
        return;
      }
      const adminToken = localStorage.getItem('adminToken');
      if (adminToken) {
        const response = await API.get('/admin/profile', {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        const freshAdminData = response.data;
        setAdminUser(freshAdminData);
        localStorage.setItem('adminUser', JSON.stringify(freshAdminData));
      } else {
        setAdminUser(null);
        localStorage.removeItem('adminUser');
      }
    } catch (error) {
      setAdminUser(null);
      localStorage.removeItem('adminUser');
    }
    setLoading(false);
  };

  const logout = (isAdmin = false) => {
    if (isAdmin) {
      setAdminUser(null);
      localStorage.removeItem('adminUser');
      localStorage.removeItem('adminToken');
    } else {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  useEffect(() => {
    // Optionally, validate token or refresh session here
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        adminUser,
        login,
        adminLogin,
        logout,
        isAuthenticated,
        isAdminAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
