import React, { useState, useEffect } from 'react';
import API, { loginUser } from '../services/api';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [googleLoginAttempted, setGoogleLoginAttempted] = useState(false);
  const authContext = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authContext.isAuthenticated && !authContext.loading) {
      navigate('/products');
    }
  }, [authContext.isAuthenticated, authContext.loading, navigate]);

  const showToast = (message) => {
    setToastMessage(message);
  };

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }
    const res = await loginUser({ email, password });
      if (res.success) {
        localStorage.setItem('token', res.user.token);
        await authContext.login(res.user);
        showToast('Logged in');
        const waitForAuth = () => {
          return new Promise((resolve) => {
            const interval = setInterval(() => {
              if (authContext.isAuthenticated && !authContext.loading) {
                clearInterval(interval);
                resolve();
              }
            }, 50);
          });
        };
        await waitForAuth();
        navigate('/products');
      } else {
        showToast('Login failed');
      }
  };

  const handleGoogleSuccess = (response) => {
    setGoogleLoginAttempted(false);
    console.log('Google login success:', response);
    // TODO: Send token to backend for verification and login
    showToast('Google login successful (token received)');
  };

  const handleGoogleFailure = (response) => {
    setGoogleLoginAttempted(true);
    console.error('Google login failed:', response);
    // Ignore errors caused by user closing popup or canceling login
    if (response.error === 'popup_closed_by_user' || response.error === 'access_denied') {
      setGoogleLoginAttempted(false);
      return;
    }
    if (googleLoginAttempted) {
      showToast('Google login failed');
    }
  };

  const handleFacebookResponse = (response) => {
    console.log('Facebook login response:', response);
    // TODO: Send token to backend for verification and login
    if (response.accessToken) {
      showToast('Facebook login successful (token received)');
    } else {
      showToast('Facebook login failed');
    }
  };

  return (
    <div className="form-container">
      {error && <p className="form-error">{error}</p>}
      <input className="form-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input className="form-input" value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
      <button className="form-button" onClick={handleLogin}>Login</button>
      <div className="social-login">
        <GoogleLogin
          clientId="YOUR_GOOGLE_CLIENT_ID"
          buttonText="Login with Google"
          onSuccess={handleGoogleSuccess}
          onFailure={handleGoogleFailure}
          cookiePolicy={'single_host_origin'}
          render={renderProps => (
            <button className="social-button google" onClick={() => { setGoogleLoginAttempted(true); renderProps.onClick(); }} disabled={renderProps.disabled}>
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
            <button className="social-button facebook" onClick={renderProps.onClick}>
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/facebook.svg" alt="Facebook" className="social-icon" />
              Login with Facebook
            </button>
          )}
        />
      </div>
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
}

export default Login;
