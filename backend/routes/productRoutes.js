const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductCategories,
  getProductsByCategory,
} = require('../controllers/productController');
const { protect, admin, superadmin } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get('/categories', getProductCategories);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, superadmin, deleteProduct);

module.exports = router;