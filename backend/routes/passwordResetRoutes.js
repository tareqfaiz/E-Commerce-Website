const express = require('express');
const router = express.Router();
const {
  requestPasswordReset,
  resetPassword
} = require('../controllers/passwordResetController');

// Customer password reset routes
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
