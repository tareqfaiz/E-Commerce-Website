import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import AdminNavbar from '../components/AdminNavbar';
import AdminFooter from '../components/AdminFooter';
/* Removed missing CSS import */
// import './AdminDeliveryManagement.css';

function AdminDeliveryManagement() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchDeliveries();
  }, [isAuthenticated, user, navigate]);

  const fetchDeliveries = async () => {
    try {
      const response = await api.get('/deliveries');
      setDeliveries(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch deliveries');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this delivery?')) return;
    try {
      await api.delete(`/deliveries/${id}`);
      setDeliveries(deliveries.filter(delivery => delivery._id !== id));
    } catch (err) {
      setError('Failed to delete delivery');
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/deliveries/edit/${id}`);
  };

  const handleAddNew = () => {
    navigate('/admin/deliveries/new');
  };

  return (
    <>
      <AdminNavbar />
      <div className="admin-delivery-management">
        <header className="admin-header">
          <h1>Delivery Management</h1>
          <button className="add-delivery-button" onClick={handleAddNew}>Add New Delivery</button>
        </header>
        {loading ? (
          <p>Loading deliveries...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <table className="delivery-table">
            <thead>
              <tr>
                <th>Delivery ID</th>
                <th>Order ID</th>
                <th>Status</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map(delivery => (
                <tr key={delivery._id}>
                  <td>{delivery._id}</td>
                  <td>{delivery.orderId}</td>
                  <td>{delivery.status}</td>
                  <td>{delivery.address}</td>
                  <td>
                    <button className="edit-button" onClick={() => handleEdit(delivery._id)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDelete(delivery._id)}>Delete</button>
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

export default AdminDeliveryManagement;
