import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import './AdminLogin.css';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const authContext = useAuth();
  const navigate = useNavigate();

  const showToast = (message) => {
    setToastMessage(message);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showToast('Please fill all fields');
      return;
    }
    try {
      const response = await api.adminLogin({ email, password });
      if (response.data && response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        await authContext.adminLogin(response.data);
        if (authContext.adminUser && authContext.adminUser.isAdmin) {
          showToast('Admin logged in');
          navigate('/admin/dashboard');
        } else {
          showToast('Admin login failed: not an admin');
        }
      } else {
        showToast('Admin login failed');
      }
    } catch (error) {
      showToast('Admin login failed');
    }
  };

  // Removed useEffect to prevent infinite render loop

  // Navigation handled directly in handleLogin after successful login

  return (
    <div className="form-container">
      <h2>Admin Login</h2>
      <input
        className="form-input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        className="form-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button className="form-button" onClick={handleLogin}>Login</button>
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
}

export default AdminLogin;
