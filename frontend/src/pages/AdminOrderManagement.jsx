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
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredOrders(orders);
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      setFilteredOrders(
        orders.filter(order => order._id.toLowerCase().includes(lowerSearch))
      );
    }
  }, [searchTerm, orders]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/admin/all');
      setOrders(response.data);
      setFilteredOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch orders');
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const response = await api.put(`/orders/${id}`, { status });
      // Update orders state with updated order data
      setOrders(prevOrders => prevOrders.map(order => (order._id === id ? response.data : order)));
    } catch (err) {
      setError('Failed to update order status');
    }
  };

  const handleAccept = async (event, id) => {
    event.preventDefault();
    console.log('Accept clicked for order:', id);
    await updateOrderStatus(id, 'accepted');
  };

  const handleReject = async (event, id) => {
    event.preventDefault();
    console.log('Reject clicked for order:', id);
    await updateOrderStatus(id, 'rejected');
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
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Order Management</h1>
          <button className="add-order-button" onClick={handleAddNew}>Add New Order</button>
          <input
            type="text"
            placeholder="Search by Order ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="order-search-input"
          />
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
                <th>Phone Number</th>
                <th>Order Date</th>
                <th>Items</th>
                <th>Total Price</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.filter(order => order != null).map(order => {
                const orderDate = new Date(order.createdAt).toLocaleString();
                return (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.phoneNumber || order.user?.phone || 'N/A'}</td>
                    <td>{orderDate}</td>
                    <td>
                      {order.orderItems.map((item, index) => (
                        <div key={item._id || `${item.product?._id}-${index}`} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                          <img
                            src={item.product && item.product.image ? (item.product.image.startsWith('http') ? item.product.image : `http://localhost:5000${item.product.image.startsWith('/') ? '' : '/'}${item.product.image}`) : 'https://via.placeholder.com/40'}
                            alt={item.product ? item.product.title : 'Unknown Product'}
                            style={{ width: '40px', height: '40px', objectFit: 'cover', marginRight: '10px' }}
                          />
                          <div>
                            <div>{item.product ? item.product.title : 'Unknown Product'}</div>
                            <div>Size: {item.size}</div>
                            <div>Qty: {item.quantity}</div>
                            <div>Unit Price: ${item.price.toFixed(2)}</div>
                          </div>
                        </div>
                      ))}
                    </td>
                    <td>${order.totalPrice.toFixed(2)}</td>
                    <td>{order.paymentMethod}</td>
                    <td>
                      {order.status === 'accepted' ? (
                        <span className="status accepted">Accepted</span>
                      ) : order.status === 'rejected' ? (
                        <span className="status rejected">Rejected</span>
                      ) : (
                        <>
                          <button className="accept-button" onClick={(e) => handleAccept(e, order._id)}>Accept</button>
                          <button className="reject-button" onClick={(e) => handleReject(e, order._id)}>Reject</button>
                        </>
                      )}
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
