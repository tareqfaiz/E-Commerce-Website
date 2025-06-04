const express = require('express');
const router = express.Router();
const { updateProfile, getProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Update user profile
router.put('/profile', protect, updateProfile);

// Get user profile
router.get('/profile', protect, getProfile);

module.exports = router;
