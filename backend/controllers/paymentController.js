const Payment = require('../models/Payment');
const stripe = require('../utils/stripe');

exports.createPaymentIntent = async (req, res) => {
  const { amount, currency } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });
    res.status(201).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: 'Payment failed', error: error.message });
  }
};

// Create new payment
exports.createPayment = async (req, res) => {
  const { user, amount, status, paymentMethod, paymentDate } = req.body;
  try {
    const payment = new Payment({
      user,
      amount,
      status,
      paymentMethod,
      paymentDate,
    });
    const createdPayment = await payment.save();
    res.status(201).json(createdPayment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all payments
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('user', 'name email');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('user', 'name email');
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update payment by ID
exports.updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    Object.assign(payment, req.body);
    const updatedPayment = await payment.save();
    res.json(updatedPayment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete payment by ID
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    await payment.remove();
    res.json({ message: 'Payment removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
