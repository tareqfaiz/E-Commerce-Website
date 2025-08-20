import React, { useState, useEffect } from 'react';
import { loginUser } from '../services/api';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import MessageModal from '../components/MessageModal';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const { login, isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      if (user?.isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/products');
      }
    }
  }, [isAuthenticated, loading, navigate, user]);

  const showToast = (message) => {
    setToastMessage(message);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }
    try {
      const res = await loginUser({ email, password });
      if (res.success && res.user) {
        // Pass the user data directly to the context
        login(res.user);
        showToast('Logged in successfully!');
        // The useEffect will handle navigation
      } else {
        throw new Error(res.error || 'Login failed: Invalid credentials');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login.');
      showToast(err.message || 'Login failed');
    }
  };

  const handleGoogleSuccess = (response) => {
    console.log('Google login success:', response);
    showToast('Google login successful (token received)');
  };

  const handleGoogleFailure = (response) => {
    console.error('Google login failed:', response);
    if (response.error !== 'popup_closed_by_user' && response.error !== 'access_denied') {
      showToast('Google login failed');
    }
  };

  const handleFacebookResponse = (response) => {
    console.log('Facebook login response:', response);
    if (response.accessToken) {
      showToast('Facebook login successful (token received)');
    } else {
      showToast('Facebook login failed');
    }
  };

  return (
    <>
      <form className="form-container" onSubmit={handleLogin}>
        {error && <p className="form-error">{error}</p>}
        <input className="form-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input className="form-input" value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
        <button type="submit" className="form-button">Login</button>
        
        <div className="social-login">
            <GoogleLogin
                clientId="YOUR_GOOGLE_CLIENT_ID"
                buttonText="Login with Google"
                onSuccess={handleGoogleSuccess}
                onFailure={handleGoogleFailure}
                cookiePolicy={'single_host_origin'}
                render={renderProps => (
                    <button type="button" className="social-button google" onClick={renderProps.onClick} disabled={renderProps.disabled}>
                    <img src="https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/google.svg" alt="Google" className="social-icon" />
                    Login with Google
                    </button>
                )}
            />
            <FacebookLogin
                appId="YOUR_FACEBOOK_APP_ID"
                autoLoad={false}
                callback={handleFacebookResponse}
                render={renderProps => (
                    <button type="button" className="social-button facebook" onClick={renderProps.onClick}>
                    <img src="https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/facebook.svg" alt="Facebook" className="social-icon" />
                    Login with Facebook
                    </button>
                )}
            />
        </div>
        <div className="form-footer">
            <a href="#" onClick={(e) => { e.preventDefault(); setShowForgotPasswordModal(true); }} className="forgot-password-link">
                Forgot Password?
            </a>
        </div>
      </form>
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      <MessageModal
        show={showForgotPasswordModal}
        title="Password Reset"
        message="Password reset functionality is not yet implemented. Please contact support for assistance."
        onCancel={() => setShowForgotPasswordModal(false)}
      />
    </>
  );
}

export default Login;
