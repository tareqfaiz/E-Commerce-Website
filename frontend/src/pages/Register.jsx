import React, { useState } from 'react';
import API, { registerUser } from '../services/api';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [googleRegisterAttempted, setGoogleRegisterAttempted] = useState(false);

  const handleRegister = async () => {
    setError('');
    if (!username || !email || !password || !retypePassword) {
      setError('Please fill all fields');
      return;
    }
    if (password !== retypePassword) {
      setError('Passwords do not match');
      return;
    }
    const res = await registerUser({ username, password, email });
    if (res.success) {
      alert('Registered successfully');
    } else {
      alert('Registration failed');
    }
  };

  const handleGoogleSuccess = (response) => {
    setGoogleRegisterAttempted(false);
    console.log('Google registration success:', response);
    // TODO: Send token to backend for verification and registration
    alert('Google registration successful (token received)');
  };

  const handleGoogleFailure = (response) => {
    setGoogleRegisterAttempted(true);
    console.error('Google registration failed:', response);
    // Ignore errors caused by user closing popup or canceling login
    if (response.error === 'popup_closed_by_user' || response.error === 'access_denied') {
      setGoogleRegisterAttempted(false);
      return;
    }
    if (googleRegisterAttempted) {
      alert('Google registration failed');
    }
  };

  const handleFacebookResponse = (response) => {
    console.log('Facebook registration response:', response);
    // TODO: Send token to backend for verification and registration
    if (response.accessToken) {
      alert('Facebook registration successful (token received)');
    } else {
      alert('Facebook registration failed');
    }
  };

  return (
    <div className="form-container">
      {error && <p className="form-error">{error}</p>}
      <input className="form-input" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input className="form-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input className="form-input" value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
      <input className="form-input" value={retypePassword} onChange={e => setRetypePassword(e.target.value)} type="password" placeholder="Retype Password" />
      <button className="form-button" onClick={handleRegister}>Register</button>
      <div className="social-login">
        <GoogleLogin
          clientId="YOUR_GOOGLE_CLIENT_ID"
          buttonText="Register with Google"
          onSuccess={handleGoogleSuccess}
          onFailure={handleGoogleFailure}
          cookiePolicy={'single_host_origin'}
          render={renderProps => (
            <button className="social-button google" onClick={() => { setGoogleRegisterAttempted(true); renderProps.onClick(); }} disabled={renderProps.disabled}>
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/google.svg" alt="Google" className="social-icon" />
              Register with Google
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
              Register with Facebook
            </button>
          )}
        />
      </div>
    </div>
  );
}

export default Register;
