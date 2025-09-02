import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api/api';
import Toast from '../components/Toast';
import AdminNavbar from '../components/AdminNavbar';
import AdminFooter from '../components/AdminFooter';

function AdminRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();

  const showToast = (message) => {
    setToastMessage(message);
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      showToast('Please fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match');
      return;
    }
    try {
      await api.adminRegister({ name, email, password });
      showToast('Admin registered successfully');
      // Optionally, navigate to another page or clear the form
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      showToast(errorMessage);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="form-container">
        <h2>Admin Register</h2>
        <input
          className="form-input"
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
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
        <input
          className="form-input"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />
        <button className="form-button" onClick={handleRegister}>Register</button>
        <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      </div>
      <AdminFooter />
    </>
  );
}

export default AdminRegister;