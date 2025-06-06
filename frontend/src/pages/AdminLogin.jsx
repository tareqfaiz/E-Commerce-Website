import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

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
    console.log('AdminLogin: handleLogin called');
    if (!email || !password) {
      showToast('Please fill all fields');
      return;
    }
    try {
      const response = await api.adminLogin({ email, password });
      console.log('AdminLogin: API response', response);
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        await authContext.login(response.data);
        console.log('AdminLogin: login successful, checking user state');
        if (authContext.user && authContext.user.isAdmin) {
          console.log('AdminLogin: user is admin, navigating to /admin/dashboard');
          showToast('Admin logged in');
          navigate('/admin/dashboard');
        } else {
          console.log('AdminLogin: user is not admin, staying on login page');
          showToast('Admin login failed: not an admin');
        }
      } else {
        showToast('Admin login failed');
      }
    } catch (error) {
      console.error('AdminLogin: login error', error);
      showToast('Admin login failed');
    }
  };

  React.useEffect(() => {
    if (authContext.user && authContext.user.isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [authContext.user, navigate]);

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
