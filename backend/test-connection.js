const mongoose = require('mongoose');
require('dotenv').config();

// Enhanced MongoDB connection test with detailed diagnostics
async function testMongoDBConnection() {
  console.log('🔍 MongoDB Connection Diagnostic Tool');
  console.log('=====================================\n');

  // Check environment variables
  console.log('📋 Environment Check:');
  console.log(`MONGO_URI exists: ${!!process.env.MONGO_URI}`);
  console.log(`PORT: ${process.env.PORT || 5000}\n`);

  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI is not defined in .env file');
    console.log('💡 Please add MONGO_URI to your .env file');
    return;
  }

  // Parse connection string for security (hide password)
  const uri = process.env.MONGO_URI;
  const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//[USERNAME]:[HIDDEN_PASSWORD]@');
  console.log(`🔗 Connection String: ${maskedUri}\n`);

  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 second timeout
    };

    const conn = await mongoose.connect(uri, connectionOptions);
    
    console.log('✅ MongoDB Connection Successful!');
    console.log(`📊 Host: ${conn.connection.host}`);
    console.log(`📊 Port: ${conn.connection.port}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`📊 Ready State: ${conn.connection.readyState}`);
    
    // Test basic operations
    console.log('\n🧪 Testing basic operations...');
    
    // Test database stats
    const admin = conn.connection.db.admin();
    const stats = await admin.serverStatus();
    console.log(`📈 Server Version: ${stats.version}`);
    console.log(`📈 Uptime: ${Math.floor(stats.uptime / 3600)} hours`);
    
    // Test collection listing
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`📦 Collections: ${collections.length} found`);
    collections.forEach((col, index) => {
      console.log(`   ${index + 1}. ${col.name}`);
    });

    console.log('\n🎉 All tests passed! Your MongoDB connection is working correctly.');
    
  } catch (error) {
    console.error('❌ MongoDB Connection Failed!');
    console.error(`Error Type: ${error.name}`);
    console.error(`Error Message: ${error.message}`);
    
    // Provide specific troubleshooting advice
    console.log('\n🔧 Troubleshooting Guide:');
    
    if (error.message.includes('authentication failed')) {
      console.log('   1. Check username and password are correct');
      console.log('   2. Verify user has database access permissions');
      console.log('   3. Ensure database name is correctly specified');
    }
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.log('   1. Check internet connection');
      console.log('   2. Verify cluster URL is correct');
      console.log('   3. Check DNS settings');
    }
    
    if (error.message.includes('ECONNREFUSED') || error.message.includes('timed out')) {
      console.log('   1. Check if MongoDB Atlas cluster is running');
      console.log('   2. Verify your IP is whitelisted in MongoDB Atlas');
      console.log('   3. Check firewall settings');
      console.log('   4. Try whitelisting IP: 0.0.0.0/0 (all IPs) for testing');
    }
    
    if (error.message.includes('SSL') || error.message.includes('TLS')) {
      console.log('   1. Check SSL/TLS certificate issues');
      console.log('   2. Try adding &ssl=true to connection string');
    }
    
    console.log('\n📋 Steps to whitelist IP in MongoDB Atlas:');
    console.log('   1. Go to https://cloud.mongodb.com');
    console.log('   2. Login to your account');
    console.log('   3. Navigate to your cluster');
    console.log('   4. Go to Network Access → IP Access List');
    console.log('   5. Click "Add IP Address"');
    console.log('   6. Add your current IP or 0.0.0.0/0 for testing');
    
  } finally {
    // Close connection
    try {
      await mongoose.connection.close();
      console.log('\n🔒 Connection closed.');
    } catch (closeError) {
      console.log('\n⚠️  Warning: Could not close connection cleanly');
    }
  }
}

// Run the test
testMongoDBConnection().catch(console.error);
