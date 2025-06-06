import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import AdminNavbar from '../components/AdminNavbar';
import AdminFooter from '../components/AdminFooter';
/* Removed missing CSS import */
// import './AdminCustomerManagement.css';

function AdminCustomerManagement() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchCustomers();
  }, [isAuthenticated, user, navigate]);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/users');
      setCustomers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch customers');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await api.delete(`/users/${id}`);
      setCustomers(customers.filter(customer => customer._id !== id));
    } catch (err) {
      setError('Failed to delete customer');
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/customers/edit/${id}`);
  };

  const handleAddNew = () => {
    navigate('/admin/customers/new');
  };

  return (
    <>
      <AdminNavbar />
      <div className="admin-customer-management">
        <header className="admin-header">
          <h1>Customer Management</h1>
          <button className="add-customer-button" onClick={handleAddNew}>Add New Customer</button>
        </header>
        {loading ? (
          <p>Loading customers...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <table className="customer-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer._id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.address || 'N/A'}</td>
                  <td>{customer.phone || 'N/A'}</td>
                  <td>
                    <button className="edit-button" onClick={() => handleEdit(customer._id)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDelete(customer._id)}>Delete</button>
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

export default AdminCustomerManagement;
