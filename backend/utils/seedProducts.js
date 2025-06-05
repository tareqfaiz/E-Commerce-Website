require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/db');

const products = [
  {
    name: 'Sample Product 1',
    description: 'This is a sample product 1',
    price: 29.99,
    image: '/uploads/sample1.jpg',
    category: 'all',
    countInStock: 10,
    sizes: ['S', 'M', 'L'],
  },
  {
    name: 'Sample Product 2',
    description: 'This is a sample product 2',
    price: 49.99,
    image: '/uploads/sample2.jpg',
    category: 'all',
    countInStock: 5,
    sizes: ['M', 'L', 'XL'],
  },
  {
    name: 'Test Product',
    description: 'Test product description',
    price: 19.99,
    image: '/uploads/sample3.jpg',
    category: 'all',
    countInStock: 20,
    sizes: ['S', 'M'],
  },
];

const seedProducts = async () => {
  try {
    await connectDB();
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Products seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
