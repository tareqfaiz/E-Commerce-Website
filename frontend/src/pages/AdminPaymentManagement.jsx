import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import AdminNavbar from '../components/AdminNavbar';
import AdminFooter from '../components/AdminFooter';
import './AdminPaymentManagement.css';

function AdminPaymentManagement() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchPayments();
  }, [isAuthenticated, user, navigate]);

  const fetchPayments = async () => {
    try {
      const response = await api.get('/payments');
      setPayments(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch payments');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payment?')) return;
    try {
      await api.delete(`/payments/${id}`);
      setPayments(payments.filter(payment => payment._id !== id));
    } catch (err) {
      setError('Failed to delete payment');
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="admin-payment-management">
        <header className="admin-header">
          <h1>Payment Management</h1>
        </header>
        {loading ? (
          <p>Loading payments...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <table className="payment-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>User</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment._id}>
                  <td>{payment._id}</td>
                  <td>{payment.user?.name || 'N/A'}</td>
                  <td>${payment.amount}</td>
                  <td>{payment.status}</td>
                  <td>{new Date(payment.createdAt).toLocaleString()}</td>
                  <td>
                    <button className="delete-button" onClick={() => handleDelete(payment._id)}>Delete</button>
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

export default AdminPaymentManagement;
