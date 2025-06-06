const express = require('express');
const router = express.Router();
const {
  createDatabase,
  getDatabases,
  getDatabaseById,
  updateDatabase,
  deleteDatabase,
} = require('../controllers/databaseController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, admin, createDatabase);
router.get('/', protect, admin, getDatabases);
router.get('/:id', protect, admin, getDatabaseById);
router.put('/:id', protect, admin, updateDatabase);
router.delete('/:id', protect, admin, deleteDatabase);

module.exports = router;
