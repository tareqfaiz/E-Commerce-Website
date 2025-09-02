import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import AdminFooter from '../components/AdminFooter';
import Toast from '../components/Toast';
import api from '../api/api';

function AdminOrderForm() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [orderItems, setOrderItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await api.get('/users');
        setUsers(usersResponse.data);

        const productsResponse = await api.get('/products');
        setProducts(productsResponse.data);
      } catch (error) {
        setToastMessage('Failed to fetch users or products.');
      }
    };
    fetchData();
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
  };

  const handleAddItem = () => {
    setOrderItems([...orderItems, { product: '', size: '', quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...orderItems];
    if (field === 'product') {
      const selectedProduct = products.find(p => p._id === value);
      newItems[index] = { ...newItems[index], product: value, price: selectedProduct ? selectedProduct.price : 0 };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setOrderItems(newItems);
  };

  const calculateTotalPrice = () => {
    return orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser || orderItems.length === 0 || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country || !phoneNumber) {
      showToast('Please fill all required fields.');
      return;
    }

    const orderData = {
      user: selectedUser,
      orderItems: orderItems.map(item => ({
        product: item.product,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress,
      paymentMethod,
      phoneNumber,
      totalPrice: calculateTotalPrice(),
      taxPrice: 0, // Assuming 0 for now, can be calculated later
      shippingPrice: 0, // Assuming 0 for now, can be calculated later
    };

    try {
      await api.post('/orders', orderData);
      showToast('Order created successfully!');
      navigate('/admin/orders');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create order.';
      showToast(errorMessage);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="form-container">
        <h2>Add New Order</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>User</label>
            <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} className="form-input" required>
              <option value="">Select User</option>
              {users.map(u => (
                <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>

          <h3>Order Items</h3>
          {orderItems.map((item, index) => (
            <div key={index} className="form-group order-item-group">
              <label>Product</label>
              <select value={item.product} onChange={(e) => handleItemChange(index, 'product', e.target.value)} className="form-input" required>
                <option value="">Select Product</option>
                {products.map(p => (
                  <option key={p._id} value={p._id}>{p.title}</option>
                ))}
              </select>

              <label>Size</label>
              <input
                type="text"
                value={item.size}
                onChange={(e) => handleItemChange(index, 'size', e.target.value)}
                className="form-input"
                placeholder="Size (e.g., M, L, XL)"
                required
              />

              <label>Quantity</label>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value, 10))}
                className="form-input"
                min="1"
                required
              />

              <label>Price</label>
              <input
                type="number"
                value={item.price}
                onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                className="form-input"
                step="0.01"
                required
              />

              <button type="button" onClick={() => handleRemoveItem(index)} className="form-button remove-item-button">Remove Item</button>
            </div>
          ))}
          <button type="button" onClick={handleAddItem} className="form-button add-item-button">Add Item</button>

          <h3>Shipping Address</h3>
          <div className="form-group">
            <label>Address</label>
            <input type="text" value={shippingAddress.address} onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })} className="form-input" required />
          </div>
          <div className="form-group">
            <label>City</label>
            <input type="text" value={shippingAddress.city} onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })} className="form-input" required />
          </div>
          <div className="form-group">
            <label>Postal Code</label>
            <input type="text" value={shippingAddress.postalCode} onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })} className="form-input" required />
          </div>
          <div className="form-group">
            <label>Country</label>
            <input type="text" value={shippingAddress.country} onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })} className="form-input" required />
          </div>

          <h3>Payment Details</h3>
          <div className="form-group">
            <label>Payment Method</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="form-input" required>
              <option value="Cash">Cash</option>
              <option value="Bank Card">Bank Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Mobile Pay">Mobile Pay</option>
              <option value="bKash">bKash</option>
            </select>
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="form-input" required />
          </div>

          <p>Total Price: ${calculateTotalPrice().toFixed(2)}</p>

          <button type="submit" className="form-button">Create Order</button>
        </form>
        <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      </div>
      <AdminFooter />
    </>
  );
}

export default AdminOrderForm;