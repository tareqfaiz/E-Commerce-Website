import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user?.isAdmin) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user.name}</p>
      </header>
      <section className="admin-controls">
        <div className="control-card">Customer Management</div>
        <div className="control-card">Order Management</div>
        <div className="control-card">Delivery Management</div>
        <div className="control-card">Database Management</div>
        <div className="control-card">Subscription Management</div>
      </section>
    </div>
  );
}

export default AdminDashboard;
