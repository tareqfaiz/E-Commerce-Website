// Order model
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  phoneNumber: {
    type: String,
    default: '',
  },
  orderItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      size: { type: String, required: true },
      quantity: { type: Number, required: true, default: 1 },
      price: { type: Number, required: true },
    },
  ],
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  paymentMethod: { type: String, required: true },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String,
  },
  taxPrice: { type: Number, required: true, default: 0.0 },
  shippingPrice: { type: Number, required: true, default: 0.0 },
  totalPrice: { type: Number, required: true, default: 0.0 },
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  isDelivered: { type: Boolean, default: false },
  deliveredAt: Date,
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'accepted', 'rejected', 'edited'],
    default: 'pending',
  },
  statusHistory: [
    {
      status: String,
      timestamp: { type: Date, default: Date.now },
      adminName: String,
      note: String,
    },
  ],
  actions: [
    {
      adminName: { type: String, required: true },
      action: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

// Virtual for status color
orderSchema.virtual('statusColor').get(function() {
  const colorMap = {
    pending: '#f59e0b',    // amber
    processing: '#3b82f6', // blue
    shipped: '#8b5cf6',    // purple
    delivered: '#10b981',  // green
    cancelled: '#ef4444',  // red
    refunded: '#f97316',   // orange
    accepted: '#10b981',   // green
    rejected: '#ef4444',   // red
    edited: '#f59e0b',     // amber
  };
  return colorMap[this.status] || '#6b7280';
});

// Virtual for status icon
orderSchema.virtual('statusIcon').get(function() {
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
  return iconMap[this.status] || '📋';
});

// Virtual for status description
orderSchema.virtual('statusDescription').get(function() {
  const descriptionMap = {
    pending: 'Order received and awaiting review',
    processing: 'Order is being prepared',
    shipped: 'Order has been dispatched',
    delivered: 'Order has been delivered successfully',
    cancelled: 'Order has been cancelled',
    refunded: 'Payment has been refunded',
    accepted: 'Order has been accepted by admin',
    rejected: 'Order has been rejected by admin',
    edited: 'Order has been edited by admin',
  };
  return descriptionMap[this.status] || 'Unknown status';
});

module.exports = mongoose.model('Order', orderSchema);
