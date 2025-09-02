import React, { useState } from 'react';
import { requestPasswordReset } from '../api/api';
import Toast from '../components/Toast';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (message) => {
    setToastMessage(message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await requestPasswordReset({ email });
      showToast(response.data.message);
    } catch (error) {
      showToast(error.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="forgot-password-container">
        <form className="form-container" onSubmit={handleSubmit}>
          <h2>Forgot Password</h2>
          <div className="form-group">
            <input
              className="form-input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className={`form-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Password Reset Email'}
          </button>
        </form>
        <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      </div>
    </>
  );
}

export default ForgotPassword;
