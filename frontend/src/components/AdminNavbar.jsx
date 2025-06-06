import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminNavbar.css';

function AdminNavbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    if (user && user.isAdmin) {
      navigate('/admin/login');
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="admin-navbar">
      <button className="admin-navbar-home" onClick={() => window.location.href = '/admin/dashboard'}>Admin Home</button>
      <div className="admin-navbar-right">
        <button className="admin-navbar-logout" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default AdminNavbar;
