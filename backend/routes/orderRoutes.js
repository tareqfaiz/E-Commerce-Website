const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.post('/', protect, orderController.addOrder);
router.get('/myorders', protect, orderController.getUserOrders);
router.get('/:id', orderController.getOrderById);

// Admin routes
router.get('/admin/all', protect, admin, orderController.getAllOrders);
router.get('/', protect, admin, orderController.getAllOrders);
router.put('/:id', protect, admin, orderController.updateOrder);
router.delete('/:id', protect, admin, orderController.deleteOrder);
router.get('/:id/timeline', protect, admin, orderController.getOrderTimeline);

module.exports = router;
