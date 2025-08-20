import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRedirect = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    // You might want to show a loading spinner here
    return <div>Loading...</div>;
  }

  if (isAuthenticated && user?.isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/admin/login" replace />;
};

export default AdminRedirect;
