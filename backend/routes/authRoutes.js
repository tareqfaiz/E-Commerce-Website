const express = require('express');
const router = express.Router();
const { register, login, adminLogin, adminRegister, refreshToken } = require('../controllers/authController');

// Register user
router.post('/register', register);

// Login user
router.post('/login', login);

// Refresh token
router.post('/refresh-token', refreshToken);

// Admin login
router.post('/admin/login', adminLogin);

// Admin register
router.post('/admin/register', adminRegister);

module.exports = router;
