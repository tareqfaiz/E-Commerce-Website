import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, adminUser } = useAuth();

  if (adminOnly) {
    if (!adminUser) {
      return <Navigate to="/admin/login" replace />;
    }
    if (!adminUser.isAdmin) {
      return <Navigate to="/admin/login" replace />;
    }
  } else {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
