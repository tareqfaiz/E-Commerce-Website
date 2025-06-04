import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cartItems, removeFromCart, incrementQuantity, decrementQuantity, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [detailsVisible, setDetailsVisible] = useState({});

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePurchaseClick = () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    setShowPaymentForm(true);
    setPaymentStatus('');
  };

  const handleInputChange = (e) => {
    setPaymentDetails({
      ...paymentDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    // Here you would integrate with real payment APIs
    setPaymentStatus(`Payment successful via ${paymentMethod}`);
    clearCart();
    setShowPaymentForm(false);
    setPaymentDetails({});
  };

  const toggleDetails = (id) => {
    setDetailsVisible(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (cartItems.length === 0 && !paymentStatus) {
    return (
      <div className="container">
        <h1 className="cart-empty-title">Your Cart is Empty</h1>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="cart-title">Your Cart</h1>
      {cartItems.map(item => (
        <div key={`${item.id}-${item.size}`} className="cart-item" style={{ position: 'relative' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img src={item.image} alt={item.title} className="cart-item-image" />
            <button
              className="details-button"
              onClick={() => toggleDetails(item.id)}
            >
              Details
            </button>
            {detailsVisible[item.id] && (
              <div className="details-popup" onClick={(e) => e.stopPropagation()}>
                <p><strong>Description:</strong> {item.description ? item.description : 'No description available.'}</p>
                <p><strong>Category:</strong> {item.category ? item.category : 'N/A'}</p>
                <p><strong>SKU:</strong> {item.sku ? item.sku : 'N/A'}</p>
              </div>
            )}
          </div>
          <div className="cart-item-details">
            <h2 className="cart-item-title">{item.title}</h2>
            <p className="cart-item-price">Price: ${item.price}</p>
            <p className="cart-item-size">Size: {item.size}</p>
            <p className="cart-item-quantity">Quantity: {item.quantity}</p>
            <div className="cart-item-buttons">
              <button
                onClick={() => incrementQuantity(item.id, item.size)}
                className="cart-button increment-button"
              >
                +
              </button>
              <button
                onClick={() => decrementQuantity(item.id, item.size)}
                className="cart-button decrement-button"
              >
                -
              </button>
              <button
                onClick={() => removeFromCart(item.id, item.size)}
                className="cart-button remove-button"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
      <h2 className="cart-total">Total: ${totalPrice.toFixed(2)}</h2>
      {!showPaymentForm ? (
        <div className="payment-section">
          <div className="payment-method-label">Select Payment Method:</div>
          <div className="payment-method-options">
            {['Cash', 'Bank Card', 'Bank Transfer', 'Mobile Pay', 'bKash'].map(method => (
              <label key={method} className="payment-method-label-item">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={e => setPaymentMethod(e.target.value)}
                  className="payment-radio"
                />
                <span>{method}</span>
              </label>
            ))}
          </div>
          <button
            onClick={handlePurchaseClick}
            className="purchase-button"
          >
            Purchase
          </button>
        </div>
      ) : (
        <form onSubmit={handlePaymentSubmit} className="payment-form">
          {paymentMethod === 'Bank Card' && (
            <>
              <div className="form-group">
                <label className="form-label">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={paymentDetails.cardNumber || ''}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={paymentDetails.expiryDate || ''}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={paymentDetails.cvv || ''}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
            </>
          )}
          {(paymentMethod === 'Bank Transfer' || paymentMethod === 'Mobile Pay' || paymentMethod === 'bKash') && (
            <>
              <div className="form-group">
                <label className="form-label">Account Number / Mobile Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={paymentDetails.accountNumber || ''}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Transaction ID</label>
                <input
                  type="text"
                  name="transactionId"
                  value={paymentDetails.transactionId || ''}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
            </>
          )}
          {paymentMethod === 'Cash' && (
            <p>Please prepare the cash payment upon delivery.</p>
          )}
          <div className="form-buttons">
            <button
              type="submit"
              className="confirm-payment-button"
            >
              Confirm Payment
            </button>
            <button
              type="button"
              onClick={() => {
                setShowPaymentForm(false);
                setPaymentStatus('');
              }}
              className="cancel-payment-button"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {paymentStatus && <p className="payment-status">{paymentStatus}</p>}
    </div>
  );
}

export default Cart;
