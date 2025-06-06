import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import AdminNavbar from '../components/AdminNavbar';
import AdminFooter from '../components/AdminFooter';
/* Removed missing CSS import */
// import './AdminSubscriptionManagement.css';

function AdminSubscriptionManagement() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchSubscriptions();
  }, [isAuthenticated, user, navigate]);

  const fetchSubscriptions = async () => {
    try {
      const response = await api.get('/subscriptions');
      setSubscriptions(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch subscriptions');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subscription?')) return;
    try {
      await api.delete(`/subscriptions/${id}`);
      setSubscriptions(subscriptions.filter(sub => sub._id !== id));
    } catch (err) {
      setError('Failed to delete subscription');
    }
  };

  const handleEdit = async (id) => {
    navigate(`/admin/subscriptions/edit/${id}`);
  };

  const handleAddNew = () => {
    navigate('/admin/subscriptions/new');
  };

  return (
    <>
      <AdminNavbar />
      <div className="admin-subscription-management">
        <header className="admin-header">
          <h1>Subscription Management</h1>
          <button className="add-subscription-button" onClick={handleAddNew}>Add New Subscription</button>
        </header>
        {loading ? (
          <p>Loading subscriptions...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <table className="subscription-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map(sub => (
                <tr key={sub._id}>
                  <td>{sub._id}</td>
                  <td>{sub.user?.name || 'N/A'}</td>
                  <td>{sub.plan}</td>
                  <td>{sub.status}</td>
                  <td>
                    <button className="edit-button" onClick={() => handleEdit(sub._id)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDelete(sub._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <AdminFooter />
    </>
  );
}

export default AdminSubscriptionManagement;
