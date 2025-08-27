import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { toast } from 'react-toastify';
import './OrderManagement.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusNote, setStatusNote] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/api/orders');
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { data } = await API.put(`/api/orders/${orderId}`, {
        status: newStatus,
        note: statusNote || `Status updated to ${newStatus}`,
      });
      
      setOrders(orders.map(order => 
        order._id === orderId ? data : order
      ));
      
      toast.success('Order status updated successfully');
      setShowModal(false);
      setStatusNote('');
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    const colorMap = {
      pending: '#f59e0b',
      processing: '#3b82f6',
      shipped: '#8b5cf6',
      delivered: '#10b981',
      cancelled: '#ef4444',
      refunded: '#f97316',
      accepted: '#10b981',
      rejected: '#ef4444',
      edited: '#f59e0b',
    };
    return colorMap[status] || '#6b7280';
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      pending: '⏳',
      processing: '🔄',
      shipped: '📦',
      delivered: '✅',
      cancelled: '❌',
      refunded: '💰',
      accepted: '✅',
      rejected: '❌',
      edited: '✏️',
    };
    return iconMap[status] || '📋';
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="order-management">
      <div className="header">
        <h2>Order Management</h2>
        <div className="filters">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
          
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="orders-grid">
        {filteredOrders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div>
                <h3>Order #{order._id.slice(-8)}</h3>
                <p className="customer-name">{order.user?.name || 'Unknown'}</p>
                <p className="customer-email">{order.user?.email || 'No email'}</p>
              </div>
              <div 
                className="status-badge" 
                style={{ backgroundColor: getStatusColor(order.status) + '20', color: getStatusColor(order.status) }}
              >
                <span>{getStatusIcon(order.status)}</span>
                <span>{order.status}</span>
              </div>
            </div>

            <div className="order-details">
              <div className="detail-row">
                <span>Date:</span>
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <div className="detail-row">
                <span>Total:</span>
                <span>{formatCurrency(order.totalPrice)}</span>
              </div>
              <div className="detail-row">
                <span>Items:</span>
                <span>{order.orderItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
            </div>

            <div className="order-actions">
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setSelectedOrder(order);
                  setShowModal(true);
                }}
              >
                Update Status
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setSelectedOrder(order);
                }}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Update Order Status</h3>
            <p>Order #{selectedOrder._id.slice(-8)}</p>
            
            <div className="status-options">
              {['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'].map(status => (
                <button
                  key={status}
                  className={`status-btn ${selectedOrder.status === status ? 'active' : ''}`}
                  style={{ backgroundColor: getStatusColor(status) + '20', color: getStatusColor(status) }}
                  onClick={() => updateOrderStatus(selectedOrder._id, status)}
                >
                  {getStatusIcon(status)} {status}
                </button>
              ))}
            </div>

            <div className="note-section">
              <label>Note (optional):</label>
              <textarea
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="Add a note about this status change..."
                rows={3}
              />
            </div>

            <div className="modal-actions">
              <button 
                className="btn btn-primary"
                onClick={() => updateOrderStatus(selectedOrder._id, selectedOrder.status)}
              >
                Update Status
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setShowModal(false);
                  setStatusNote('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
