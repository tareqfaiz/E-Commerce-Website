import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';

function UpdateUserInfo() {
  const { user, login, logout, refreshToken } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
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
      const updateData = {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
      };
      const token = localStorage.getItem('token');
      let response = await API.put('/users/profile', updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setMessage('Profile updated successfully');
        login({ ...user, ...updateData });
        navigate('/profile');
      } else if (response.status === 401 || response.status === 403) {
        // Try refreshing token once before logout
        const refreshed = await refreshToken();
        if (refreshed) {
          const newToken = localStorage.getItem('token');
          response = await API.put('/users/profile', updateData, {
            headers: { Authorization: `Bearer ${newToken}` },
          });
          if (response.status === 200) {
            setMessage('Profile updated successfully');
            login({ ...user, ...updateData });
            navigate('/profile');
            return;
          }
        }
        setMessage('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        setMessage('Failed to update profile');
      }
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        // Try refreshing token once before logout
        const refreshed = await refreshToken();
        if (refreshed) {
          const newToken = localStorage.getItem('token');
          try {
            const retryResponse = await API.put('/users/profile', {
              name: formData.name,
              address: formData.address,
              phone: formData.phone,
            }, {
              headers: { Authorization: `Bearer ${newToken}` },
            });
            if (retryResponse.status === 200) {
              setMessage('Profile updated successfully');
              login({ ...user, ...formData });
              navigate('/profile');
              return;
            }
          } catch (retryError) {
            // fall through to logout below
          }
        }
        setMessage('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        setMessage('Error updating profile');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="user-profile">
      <h2>Update Your Information</h2>
      {message && <p>{typeof message === 'string' ? message : JSON.stringify(message)}</p>}
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Update Info</button>
      </form>
    </div>
  );
}

export default UpdateUserInfo;
