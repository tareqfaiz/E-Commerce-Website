import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../api/api';
import Toast from '../components/Toast';
import './ResetPassword.css';

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (message) => {
    setToastMessage(message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      const response = await resetPassword(token, { password });
      showToast(response.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      showToast(error.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="reset-password-container">
        <form className="form-container" onSubmit={handleSubmit}>
          <h2>Reset Password</h2>
          <div className="form-group">
            <input
              className="form-input"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <input
              className="form-input"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className={`form-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      </div>
    </>
  );
}

export default ResetPassword;
