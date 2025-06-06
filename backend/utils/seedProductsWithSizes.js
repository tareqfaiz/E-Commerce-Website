const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const products = [
  {
    title: 'Sample Product 1',
    description: 'This is a sample product 1',
    price: 19.99,
    category: 'Category 1',
    image: '/uploads/sample1.jpg',
    sizes: [
      { size: 'S', quantity: 10 },
      { size: 'M', quantity: 5 },
      { size: 'L', quantity: 0 },
      { size: 'XL', quantity: 2 },
      { size: 'Universal', quantity: 1 },
    ],
  },
  {
    title: 'Sample Product 2',
    description: 'This is a sample product 2',
    price: 99,
    category: 'Category 2',
    image: '/uploads/sample2.jpg',
    sizes: [
      { size: 'S', quantity: 0 },
      { size: 'M', quantity: 0 },
      { size: 'L', quantity: 0 },
      { size: 'XL', quantity: 0 },
      { size: 'Universal', quantity: 0 },
    ],
  },
  {
    title: 'Women Shirt',
    description: 'This is women shirt',
    price: 10,
    category: 'Women',
    image: '/uploads/women-shirt.jpg',
    sizes: [
      { size: 'S', quantity: 3 },
      { size: 'M', quantity: 0 },
      { size: 'L', quantity: 7 },
      { size: 'XL', quantity: 0 },
      { size: 'Universal', quantity: 0 },
    ],
  },
  {
    title: 'Men polo',
    description: 'This is men polo',
    price: 20,
    category: 'Men',
    image: '/uploads/men-polo.jpg',
    sizes: [
      { size: 'S', quantity: 0 },
      { size: 'M', quantity: 0 },
      { size: 'L', quantity: 0 },
      { size: 'XL', quantity: 0 },
      { size: 'Universal', quantity: 0 },
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://alfredsuomi:3AAd6WJwZeFsYoJS@online-store.vzidcsl.mongodb.net/?retryWrites=true&w=majority&appName=online-store');
    console.log('Connected to MongoDB for seeding');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    await Product.insertMany(products);
    console.log('Inserted sample products with sizes');

    process.exit();
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seed();
