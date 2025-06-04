const express = require('express');
const router = express.Router();
const {
  addOrder,
  getOrderById,
  getUserOrders,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addOrder);
router.get('/:id', protect, getOrderById);
router.get('/', protect, getUserOrders);

module.exports = router;
