import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import './AdminCustomerEdit.css';

const AdminCustomerEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewCustomer = !id;
  
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    phone: ''
  });
  const [loading, setLoading] = useState(!isNewCustomer);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isNewCustomer) {
      fetchCustomer();
    }
  }, [id]);

  const fetchCustomer = async () => {
    try {
      const response = await api.get(`/users/${id}`);
      setCustomer(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching customer:', error);
      setError('Failed to fetch customer details');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isNewCustomer) {
        await api.post('/users', customer);
        setSuccess('Customer created successfully!');
      } else {
        await api.put(`/users/${id}`, customer);
        setSuccess('Customer updated successfully!');
      }
      setTimeout(() => {
        navigate('/admin/customers');
      }, 2000);
    } catch (error) {
      console.error('Error saving customer:', error);
      setError(error.response?.data?.message || `Failed to ${isNewCustomer ? 'create' : 'update'} customer`);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      try {
        await api.delete(`/users/${id}`);
        navigate('/admin/customers');
      } catch (error) {
        console.error('Error deleting customer:', error);
        setError(error.response?.data?.message || 'Failed to delete customer');
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-customer-edit">
        <div className="loading">Loading customer details...</div>
      </div>
    );
  }

  return (
    <div className="admin-customer-edit">
      <div className="edit-header">
        <h2>{isNewCustomer ? 'Add New Customer' : 'Edit Customer'}</h2>
        <button className="back-button" onClick={() => navigate('/admin/customers')}>
          ← Back to Customers
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={customer.name}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={customer.email}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        {isNewCustomer && (
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={customer.password}
              onChange={handleChange}
              required={isNewCustomer}
              className="form-input"
              placeholder="Enter password for new customer"
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            value={customer.address || ''}
            onChange={handleChange}
            rows="3"
            className="form-input"
            placeholder="Enter customer address"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={customer.phone || ''}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter phone number"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="save-button">
            {isNewCustomer ? 'Create Customer' : 'Save Changes'}
          </button>
          {!isNewCustomer && (
            <button type="button" className="delete-button" onClick={handleDelete}>
              Delete Customer
            </button>
          )}
          <button type="button" className="cancel-button" onClick={() => navigate('/admin/customers')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCustomerEdit;
