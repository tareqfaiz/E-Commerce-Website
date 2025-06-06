const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getAllSubscribers, createSubscriber, updateSubscriber, deleteSubscriber } = require('../controllers/adminNewsletterController');

router.get('/subscribers', protect, admin, getAllSubscribers);
router.post('/subscribers', protect, admin, createSubscriber);
router.put('/subscribers/:email', protect, admin, updateSubscriber);
router.delete('/subscribers/:email', protect, admin, deleteSubscriber);

// Alias routes for subscriptions to match frontend
router.get('/subscriptions', protect, admin, getAllSubscribers);
router.post('/subscriptions', protect, admin, createSubscriber);
router.put('/subscriptions/:email', protect, admin, updateSubscriber);
router.delete('/subscriptions/:email', protect, admin, deleteSubscriber);

module.exports = router;
