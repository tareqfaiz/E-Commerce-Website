const express = require('express');
const router = express.Router();
const {
  addOrder,
  getOrderById,
  getUserOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, addOrder);
router.get('/:id', protect, getOrderById);
router.get('/', protect, getUserOrders);

// Admin routes for order management
router.get('/admin/all', protect, admin, getAllOrders);
router.put('/:id', protect, admin, updateOrder);
router.delete('/:id', protect, admin, deleteOrder);

module.exports = router;
