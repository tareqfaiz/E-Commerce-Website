import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import AdminNavbar from '../components/AdminNavbar';
import AdminFooter from '../components/AdminFooter';
import './AdminOrderManagement.css';

function AdminOrderManagement() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, user, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch orders');
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const response = await api.put(`/orders/${id}`, { status });
      setOrders(orders.map(order => (order._id === id ? response.data : order)));
    } catch (err) {
      setError('Failed to update order status');
    }
  };

  const handleAccept = (id) => {
    updateOrderStatus(id, 'accepted');
  };

  const handleReject = (id) => {
    updateOrderStatus(id, 'rejected');
  };

  const handleEdit = (id) => {
    navigate(`/admin/orders/edit/${id}`);
  };

  const handleAddNew = () => {
    navigate('/admin/orders/new');
  };

  return (
    <>
      <AdminNavbar />
      <div className="admin-order-management">
        <header className="admin-header">
          <h1>Order Management</h1>
          <button className="add-order-button" onClick={handleAddNew}>Add New Order</button>
        </header>
        {loading ? (
          <p>Loading orders...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <table className="order-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer ID</th>
                <th>Order Date</th>
                <th>Items</th>
                <th>Total Price</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const orderDate = new Date(order.createdAt).toLocaleString();
                return (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.user?._id || 'N/A'}</td>
                    <td>{orderDate}</td>
                    <td>
                      {order.orderItems.map(item => (
                        <div key={item.product._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                          <img
                            src={item.product.image.startsWith('http') ? item.product.image : `http://localhost:5000${item.product.image}`}
                            alt={item.product.title}
                            style={{ width: '40px', height: '40px', objectFit: 'cover', marginRight: '10px' }}
                          />
                          <div>
                            <div>{item.product.title}</div>
                            <div>Size: {item.size}</div>
                            <div>Qty: {item.quantity}</div>
                          </div>
                        </div>
                      ))}
                    </td>
                    <td>${order.totalPrice.toFixed(2)}</td>
                    <td>{order.paymentMethod}</td>
                    <td>
                      <button className="accept-button" onClick={() => handleAccept(order._id)}>Accept</button>
                      <button className="reject-button" onClick={() => handleReject(order._id)}>Reject</button>
                      <button className="edit-button" onClick={() => handleEdit(order._id)}>Edit</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <AdminFooter />
    </>
  );
}

export default AdminOrderManagement;
