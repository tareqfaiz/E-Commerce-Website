const express = require('express');
const router = express.Router();
const { updateProfile, getProfile, getUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Admin routes for user management
router.get('/', protect, admin, getUsers);
router.get('/:id', protect, admin, getUserById);
router.post('/', protect, admin, createUser);
router.put('/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);

// Update user profile
router.put('/profile', protect, updateProfile);

// Get user profile
router.get('/profile', protect, getProfile);

module.exports = router;
