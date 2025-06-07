import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You must be logged in to view order history.');
          setLoading(false);
          return;
        }
        const response = await API.get('/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Orders data:', response.data); // Debug log
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch order history.');
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="order-history-container"><p>Loading order history...</p></div>;
  }

  if (error) {
    return <div className="order-history-container error"><p>{error}</p></div>;
  }

  if (orders.length === 0) {
    return <div className="order-history-container"><p>No orders found.</p></div>;
  }

  return (
    <div className="order-history-container">
      <h1>Your Order History</h1>
      <table className="order-history-table">
        <thead>
          <tr>
              <th>Order ID</th>
              <th>Date & Time</th>
              <th>Items</th>
              <th>Total Price</th>
              <th>Paid</th>
              <th>Delivered</th>
            </tr>
          </thead>
          <tbody>
          {orders.map(order => (
            <tr key={order._id} onClick={() => navigate(`/order/${order._id}`)} className="order-row">
              <td>{order._id}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
              <td>
                <div className="order-items-list">
                  {order.orderItems.map(item => (
                    <div key={item.product} className="order-item">
                      <img src={item.product && item.product.image && (item.product.image.startsWith('http') ? item.product.image : `http://localhost:5000${item.product.image}`)} alt={item.product ? item.product.title : ''} className="order-item-image" />
                      <span className="order-item-name">
                        {item.product ? item.product.title : ''} {item.size ? `- Size: ${item.size}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </td>
              <td>${order.totalPrice.toFixed(2)}</td>
              <td>{order.isPaid ? 'Yes' : 'No'}</td>
              <td>{order.isDelivered ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <style>{`
        .order-history-container {
          max-width: 900px;
          margin: 20px auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        .order-history-table {
          width: 100%;
          border-collapse: collapse;
        }
        .order-history-table th, .order-history-table td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
          vertical-align: middle;
        }
        .order-history-table th {
          background-color: #007bff;
          color: white;
        }
        .order-row:hover {
          background-color: #f1f1f1;
          cursor: pointer;
        }
        .order-items-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .order-item {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
        }
        .order-item-image {
          width: 30px;
          height: 30px;
          object-fit: cover;
          border-radius: 4px;
          border: 1px solid #ccc;
        }
        .order-item-name {
          font-size: 14px;
          color: #333;
        }
        .error {
          color: red;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}

export default OrderHistory;
