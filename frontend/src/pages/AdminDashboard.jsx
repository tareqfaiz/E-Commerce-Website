import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isAuthenticated || !user?.isAdmin) {
    return <Navigate to="/admin/login" />;
  }

  const formattedDate = currentTime.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString();

  return (
    <>
      <div className="admin-dashboard">
        <header className="admin-header">
          <h1>Admin Dashboard</h1>
          <div className="admin-subheader">
            <span>{formattedDate}</span> | <span>{formattedTime}</span>
          </div>
        </header>
        <section className="admin-controls">
          <div className="control-card" onClick={() => window.location.href = '/admin/customers'}>Customer Management</div>
          <div className="control-card" onClick={() => window.location.href = '/admin/orders'}>Order Management</div>
          <div className="control-card" onClick={() => window.location.href = '/admin/delivery'}>Delivery Management</div>
          <div className="control-card" onClick={() => window.location.href = '/admin/database'}>Database Management</div>
          <div className="control-card" onClick={() => window.location.href = '/admin/subscriptions'}>Subscription Management</div>
          <div className="control-card" onClick={() => window.location.href = '/admin/admins'}>Admin Management</div>
          <div className="control-card" onClick={() => window.location.href = '/admin/products'}>Product Management</div>
          <div className="control-card" onClick={() => window.location.href = '/admin/payments'}>Payment Management</div>
        </section>
      </div>
    </>
  );
}

export default AdminDashboard;
