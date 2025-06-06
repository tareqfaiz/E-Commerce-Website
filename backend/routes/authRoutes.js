const express = require('express');
const router = express.Router();
const { register, login, adminLogin, adminRegister } = require('../controllers/authController');

// Register user
router.post('/register', register);

// Login user
router.post('/login', login);

// Admin login
router.post('/admin/login', adminLogin);

// Admin register
router.post('/admin/register', adminRegister);

module.exports = router;
