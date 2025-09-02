const mongoose = require('mongoose');
const path = require('path');
const User = require('../models/User');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const makeSuperAdmin = async (email) => {
  if (!email) {
    console.error('Please provide an email address.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const user = await User.findOne({ email });

    if (!user) {
      console.error(`User with email ${email} not found.`);
      process.exit(1);
    }

    user.role = 'superadmin';
    user.isAdmin = true; // Explicitly set isAdmin to true
    await user.save();

    console.log(`Successfully promoted ${email} to superadmin.`);
    process.exit(0);
  } catch (error) {
    console.error('Error making user a superadmin:', error);
    process.exit(1);
  }
};

const email = process.argv[2];
makeSuperAdmin(email);
