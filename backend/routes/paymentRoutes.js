const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
} = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/create-payment-intent', protect, createPaymentIntent);

// Admin routes for payment management
router.post('/', protect, admin, createPayment);
router.get('/', protect, admin, getPayments);
router.get('/:id', protect, admin, getPaymentById);
router.put('/:id', protect, admin, updatePayment);
router.delete('/:id', protect, admin, deletePayment);

module.exports = router;
