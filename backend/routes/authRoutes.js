const express = require('express');
const router = express.Router();
const { register, login, adminLogin } = require('../controllers/authController');

// Register user
router.post('/register', register);

// Login user
router.post('/login', login);

// Admin login
router.post('/admin/login', adminLogin);

module.exports = router;
