const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const bcrypt = require('bcryptjs');

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('admin123', 10),
    isAdmin: true,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('john123', 10),
  },
];

const products = [
  {
    title: 'Sample Product 1',
    description: 'This is a sample product 1',
    price: 29.99,
    category: 'Category 1',
    stock: 100,
    image: 'https://via.placeholder.com/150',
  },
  {
    title: 'Sample Product 2',
    description: 'This is a sample product 2',
    price: 49.99,
    category: 'Category 2',
    stock: 50,
    image: 'https://via.placeholder.com/150',
  },
];

const seedData = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding');

    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    const createdUsers = await User.insertMany(users);
    console.log('Users seeded');

    const adminUser = createdUsers.find(user => user.isAdmin);

    const regularUser = createdUsers.find(user => !user.isAdmin);

    const sampleProducts = products.map(product => {
      return { ...product, user: adminUser._id };
    });

    const createdProducts = await Product.insertMany(sampleProducts);
    console.log('Products seeded');

    // Add sample orders
    const orders = [
      {
        user: regularUser._id,
        orderItems: [
          {
            product: createdProducts[0]._id,
            name: createdProducts[0].title,
            qty: 2,
            price: createdProducts[0].price,
            image: createdProducts[0].image,
          },
        ],
        shippingAddress: {
          address: '123 Main St',
          city: 'Cityville',
          postalCode: '12345',
          country: 'Countryland',
        },
        paymentMethod: 'PayPal',
        paymentResult: {
          id: 'PAYID12345',
          status: 'Completed',
          update_time: new Date(),
          email_address: 'john@example.com',
        },
        taxPrice: 5.0,
        shippingPrice: 10.0,
        totalPrice: 74.98,
        isPaid: true,
        paidAt: new Date(),
        isDelivered: false,
        deliveredAt: null,
      },
    ];

    await Order.insertMany(orders);
    console.log('Orders seeded');

    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
