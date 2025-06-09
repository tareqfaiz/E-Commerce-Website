import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './UserProfile.css';

function UserProfile() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="user-profile">
      <h2>Your Profile</h2>
      {message && <p>{message}</p>}

      {/* Read-only display of full customer information */}
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

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default UserProfile;
