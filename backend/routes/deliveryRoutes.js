const express = require('express');
const router = express.Router();
const {
  createDelivery,
  getDeliveries,
  getDeliveryById,
  updateDelivery,
  deleteDelivery,
} = require('../controllers/deliveryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, admin, createDelivery);
router.get('/', protect, admin, getDeliveries);
router.get('/:id', protect, admin, getDeliveryById);
router.put('/:id', protect, admin, updateDelivery);
router.delete('/:id', protect, admin, deleteDelivery);

module.exports = router;
