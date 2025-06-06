const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getAllSubscribers, deleteSubscriber } = require('../controllers/adminNewsletterController');

router.get('/subscribers', protect, admin, getAllSubscribers);
router.delete('/subscribers/:email', protect, admin, deleteSubscriber);

module.exports = router;
