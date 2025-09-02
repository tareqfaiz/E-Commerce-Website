const express = require('express');
const router = express.Router();
const {
  requestAdminPasswordReset,
  resetAdminPassword
} = require('../controllers/adminPasswordResetController');

// Admin password reset routes
router.post('/admin/forgot-password', requestAdminPasswordReset);
router.post('/admin/reset-password/:token', resetAdminPassword);

module.exports = router;
