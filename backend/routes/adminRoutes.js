const express = require('express');
const router = express.Router();
const { protect, admin, superadmin } = require('../middleware/authMiddleware');
const { getAdmins, getAdminById, updateAdmin, deleteAdmin, registerAdmin } = require('../controllers/adminController');

// Register a new admin (superadmin only)
router.post('/register', protect, superadmin, registerAdmin);

// Get all admins
router.get('/admins', protect, admin, getAdmins);

// Get admin by ID
router.get('/admins/:id', protect, admin, getAdminById);

// Update admin info and roles
router.put('/admins/:id', protect, superadmin, updateAdmin);

// Delete an admin
router.delete('/admins/:id', protect, superadmin, deleteAdmin);

module.exports = router;
