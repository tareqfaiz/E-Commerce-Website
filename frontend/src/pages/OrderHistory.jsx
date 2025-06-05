import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import './OrderHistory.css';

function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [errorOrders, setErrorOrders] = useState('');

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        setLoadingOrders(true);
        setErrorOrders('');
        try {
          const token = localStorage.getItem('token');
          const response = await API.get('/orders/my', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setOrders(response.data);
        } catch (error) {
          setErrorOrders('Failed to load order history');
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [user]);

  if (!user) {
    return <p>Please log in to view your order history.</p>;
  }

  return (
    <div className="order-history-container">
      <h2>Your Order History</h2>
      {loadingOrders ? (
        <p>Loading orders...</p>
      ) : errorOrders ? (
        <p>{errorOrders}</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="order-history-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Total Price</th>
              <th>Paid</th>
              <th>Delivered</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>${order.totalPrice.toFixed(2)}</td>
                <td>{order.isPaid ? 'Yes' : 'No'}</td>
                <td>{order.isDelivered ? 'Yes' : 'No'}</td>
                <td>
                  {order.orderItems.map(item => (
                    <div key={item.product}>
                      {item.quantity} x {item.product.name || item.product} (${item.price.toFixed(2)})
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OrderHistory;
