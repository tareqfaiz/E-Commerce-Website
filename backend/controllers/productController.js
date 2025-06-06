const Product = require('../models/Product');

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    let { title, description, price, category, image, sizes } = req.body;
    // Filter sizes to only valid entries and convert quantity to number
    if (Array.isArray(sizes)) {
      sizes = sizes
        .filter(s => s.size && s.size.trim() !== '' && s.quantity !== undefined)
        .map(s => ({
          size: s.size,
          quantity: Number(s.quantity),
        }));
    } else {
      sizes = [];
    }
    console.log('Creating product with sizes:', sizes);
    const product = new Product({
      title,
      description,
      price,
      category,
      image,
      sizes,
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    let { title, description, price, category, image, sizes } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      product.title = title || product.title;
      product.description = description || product.description;
      product.price = price || product.price;
      product.category = category || product.category;
      product.image = image || product.image;
      if (Array.isArray(sizes)) {
        product.sizes = sizes
          .filter(s => s.size && s.size.trim() !== '' && s.quantity !== undefined)
          .map(s => ({
            size: s.size,
            quantity: Number(s.quantity),
          }));
      }
      console.log('Updating product with sizes:', product.sizes);
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get product categories
exports.getProductCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
