const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getAdmins, updateAdmin, deleteAdmin } = require('../controllers/adminController');

// Get all admins
router.get('/admins', protect, admin, getAdmins);

// Update admin info and roles
router.put('/admins/:id', protect, admin, updateAdmin);

// Delete an admin
router.delete('/admins/:id', protect, admin, deleteAdmin);

module.exports = router;
