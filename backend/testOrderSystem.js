const mongoose = require('mongoose');
const Order = require('./models/Order');
const dotenv = require('dotenv');

dotenv.config();

// Test database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/onlinestore');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Test order creation
const testOrderCreation = async () => {
  try {
    const testOrder = new Order({
      user: '507f1f77bcf86cd799439011', // Example user ID
      items: [
        {
          product: '507f1f77bcf86cd799439012', // Example product ID
          quantity: 2,
          price: 29.99
        }
      ],
      totalAmount: 59.98,
      shippingAddress: {
        fullName: 'John Doe',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      paymentMethod: 'credit_card',
      status: 'pending'
    });

    const savedOrder = await testOrder.save();
    console.log('✅ Order created successfully:', savedOrder._id);
    return savedOrder;
  } catch (error) {
    console.error('❌ Order creation failed:', error);
    throw error;
  }
};

// Test order status update
const testStatusUpdate = async (orderId) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: { status: 'processing' },
        $push: {
          timeline: {
            status: 'processing',
            timestamp: new Date(),
            note: 'Order is being processed'
          }
        }
      },
      { new: true }
    );
    console.log('✅ Status updated successfully:', updatedOrder.status);
    return updatedOrder;
  } catch (error) {
    console.error('❌ Status update failed:', error);
    throw error;
  }
};

// Test order search
const testOrderSearch = async () => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 })
      .limit(5);
    
    console.log('✅ Found', orders.length, 'orders');
    return orders;
  } catch (error) {
    console.error('❌ Order search failed:', error);
    throw error;
  }
};

// Run all tests
const runTests = async () => {
  try {
    await connectDB();
    
    console.log('\n🧪 Running Order Management System Tests...\n');
    
    // Test order creation
    const newOrder = await testOrderCreation();
    
    // Test status update
    await testStatusUpdate(newOrder._id);
    
    // Test order search
    await testOrderSearch();
    
    console.log('\n✅ All tests passed successfully!');
    
  } catch (error) {
    console.error('\n❌ Tests failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Database disconnected');
  }
};

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  testOrderCreation,
  testStatusUpdate,
  testOrderSearch,
  runTests
};
