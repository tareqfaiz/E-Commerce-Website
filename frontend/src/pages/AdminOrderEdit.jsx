import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import AdminNavbar from '../components/AdminNavbar';
import AdminFooter from '../components/AdminFooter';
import './AdminOrderEdit.css';

function AdminOrderEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data);
        setOrderItems(response.data.orderItems);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch order');
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...orderItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setOrderItems(newItems);
  };

  const handleAddItem = () => {
    setOrderItems([...orderItems, { product: '', size: '', quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedOrder = {
        ...order,
        orderItems,
      };
      await api.put(`/orders/${id}`, updatedOrder);
      navigate('/admin/orders');
    } catch (err) {
      setError('Failed to update order');
    }
  };

  if (loading) return <p>Loading order...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!order) return <p>Order not found</p>;

  return (
    <>
      <AdminNavbar />
      <div className="admin-order-edit">
        <h1>Edit Order {order._id}</h1>
        <form onSubmit={handleSubmit}>
          {orderItems.map((item, index) => (
            <div key={index} className="order-item-edit">
              <input
                type="text"
                placeholder="Product ID"
                value={item.product}
                onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Size"
                value={item.size}
                onChange={(e) => handleItemChange(index, 'size', e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Quantity"
                value={item.quantity}
                min="1"
                onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value, 10))}
                required
              />
              <button type="button" onClick={() => handleRemoveItem(index)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={handleAddItem}>Add Item</button>
          <button type="submit">Save Changes</button>
        </form>
      </div>
      <AdminFooter />
    </>
  );
}

export default AdminOrderEdit;
