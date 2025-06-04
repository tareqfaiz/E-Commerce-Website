// Payment model
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Order',
  },
  paymentId: { type: String, required: true },
  status: { type: String, required: true },
  updateTime: { type: String },
  emailAddress: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
