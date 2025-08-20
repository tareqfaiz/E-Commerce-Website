const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const adminNewsletterRoutes = require('./routes/adminNewsletterRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const passwordResetRoutes = require('./routes/passwordResetRoutes');
const adminPasswordResetRoutes = require('./routes/adminPasswordResetRoutes');

const adminRoutes = require('./routes/adminRoutes');
const contactRoutes = require('./routes/contactRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploads folder statically
app.use('/uploads', express.static('uploads'));

// Routes
const userRoutes = require('./routes/userRoutes');

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/payments', paymentRoutes);
app.use('/newsletter', newsletterRoutes);
app.use('/upload', uploadRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);
app.use('/contact', contactRoutes);
app.use('/password-reset', passwordResetRoutes);
app.use('/password-reset', adminPasswordResetRoutes);

// Root route to handle GET /
app.get('/', (req, res) => {
  res.send('Welcome to the React Online Store Backend API');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Connected to MongoDB');
  // Start server after DB connection
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});
