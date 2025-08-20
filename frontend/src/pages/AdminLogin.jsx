import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../api/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import MessageModal from '../components/MessageModal';
import './AdminLogin.css';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const { login, isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, user, authLoading, navigate]);

  const showToast = (message) => {
    setToastMessage(message);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await adminLogin({ email, password });
      if (response.data && response.data.token) {
        // Pass the user data directly to the context
        login(response.data);
        showToast('Admin login successful!');
        // The useEffect will handle navigation
      } else {
        throw new Error(response.data.message || 'Login failed: Invalid credentials');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed: Server error';
      showToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return <div className="admin-login-container"><div>Loading...</div></div>;
  }

  return (
    <>
      <div className="admin-login-container">
        <form className="form-container" onSubmit={handleLogin}>
          <h2>Admin Login</h2>
          <div className="form-group">
            <input
              className="form-input"
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <input
              className="form-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <button 
            type="submit"
            className={`form-button ${isLoading ? 'loading' : ''}`} 
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          <div className="form-footer">
            <a href="#" onClick={(e) => { e.preventDefault(); setShowForgotPasswordModal(true); }} className="forgot-password-link">
                Forgot Password?
            </a>
          </div>
        </form>
        <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      </div>
      <MessageModal
        show={showForgotPasswordModal}
        title="Password Reset"
        message="Password reset functionality is not yet implemented. Please contact support for assistance."
        onCancel={() => setShowForgotPasswordModal(false)}
      />
    </>
  );
}

export default AdminLogin;
