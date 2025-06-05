import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import './UserProfile.css';

function UserProfile() {
  const { user, login, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    customerId: '',
    address: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      // Load user info from backend or from user context
      setFormData({
        name: user.name || '',
        email: user.email || '',
        customerId: user._id || '',
        address: user.address || '',
        phone: user.phone || '',
      });
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      // Update user info on backend except email and customerId
      const updateData = {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
      };
      const token = localStorage.getItem('token');
      const response = await API.put('/users/profile', updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setMessage('Profile updated successfully');
        // Update user context with new info
        login({ ...user, ...updateData });
      } else {
        setMessage('Failed to update profile');
      }
    } catch (error) {
      setMessage('Error updating profile');
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="user-profile">
      <h2>Your Profile</h2>
      {message && <p>{message}</p>}

      {/* New read-only display of full customer information */}
      {user && (
        <div className="profile-display" style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <h3>Customer Information</h3>
          <p><strong>Customer ID:</strong> {user._id}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Address:</strong> {user.address || 'Not provided'}</p>
          <p><strong>Phone:</strong> {user.phone || 'Not provided'}</p>
        </div>
      )}

      {/* Existing update form */}
      <form onSubmit={handleSubmit}>
        <label>
          Customer ID (read-only):
          <input type="text" name="customerId" value={formData.customerId} readOnly />
        </label>
        <label>
          Email (read-only):
          <input type="email" name="email" value={formData.email} readOnly />
        </label>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <label>
          Address:
          <input type="text" name="address" value={formData.address} onChange={handleChange} />
        </label>
        <label>
          Phone:
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
        </label>
        <button type="submit">Update Profile</button>
      </form>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default UserProfile;
