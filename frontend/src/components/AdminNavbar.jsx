import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './AdminNavbar.css';

function AdminNavbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  // Check if the user is an admin
  const isAdmin = user && user.isAdmin;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Render nothing if we are on the login page or if the user is not an authenticated admin
  if (!isAuthenticated || !isAdmin) {
    return null; 
  }

  return (
    <nav className="admin-navbar">
      <Link to="/admin/dashboard" className="admin-navbar-home">Admin Home</Link>
      <div className="admin-navbar-right">
        <button className="admin-navbar-logout" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default AdminNavbar;
