const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Create new order
exports.addOrder = async (req, res) => {
  const {
    user, // This is the customer's ID, sent from admin form
    orderItems,
    shippingAddress,
    paymentMethod,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentResult,
    phoneNumber,
    updatePhoneNumber,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  try {
    const isAdminCreatingOrder = req.user.role === 'admin' || req.user.role === 'superadmin';
    const customerId = isAdminCreatingOrder && user ? user : req.user._id;

    console.log('Customer ID:', customerId);

    // Validate orderItems to ensure size is present
    const validatedOrderItems = orderItems.map(item => ({
      product: item.product,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
    }));

    // Fetch customer from DB
    const customerUser = await User.findById(customerId);

    console.log('Customer user from DB:', customerUser);

    if (!customerUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user phone number if requested
    if (updatePhoneNumber && phoneNumber && customerUser.phone !== phoneNumber) {
      customerUser.phone = phoneNumber;
      await customerUser.save();
    }

    const order = new Order({
      user: customerId,
      phoneNumber: phoneNumber || (customerUser ? customerUser.phone : ''),
      orderItems: validatedOrderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentResult,
      isPaid: paymentResult ? true : false,
      paidAt: paymentResult ? Date.now() : null,
      statusHistory: [{
        status: 'pending',
        timestamp: new Date(),
        adminName: isAdminCreatingOrder ? req.user.name : 'System',
        note: 'Order created',
      }],
      createdByAdmin: isAdminCreatingOrder, // Set based on who is creating the order
      adminId: isAdminCreatingOrder ? req.user._id : null, // Store the admin's ID if applicable
      adminName: isAdminCreatingOrder ? req.user.name : null, // Store the admin's name if applicable
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order) {
      return res.status(404).json({ message: 'Order not Judicial not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get orders for logged in user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ $or: [{ user: req.user._id }, { createdByAdmin: true, user: req.user._id }] }).populate('orderItems.product', 'title image').populate('user', 'name email phone');
    console.log('Fetched orders with populated products:', JSON.stringify(orders, null, 2)); // Debug log
    res.json(orders);
  } catch (error) {
    console.error('Error updating order:', error.stack || error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update order by ID
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const { status, note, ...otherUpdates } = req.body;

    // Handle status updates
    if (status && ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'accepted', 'rejected'].includes(status)) {
      order.status = status;
      
      // Add to status history
      const adminName = req.user?.name || 'Unknown Admin';
      order.statusHistory.push({
        status,
        timestamp: new Date(),
        adminName,
        note: note || `Status changed to ${status}`,
      });

      // Log admin action
      order.actions.push({
        adminName,
        action: `Status changed to ${status}`,
        timestamp: new Date(),
      });
    }

    // Update other fields
    for (const key of Object.keys(otherUpdates)) {
      if (key !== 'status' && key !== 'note') {
        order[key] = otherUpdates[key];
      }
    }

    // Recalculate prices if orderItems updated
    if (otherUpdates.orderItems) {
      // Fetch product prices for each order item in req.body.orderItems
      for (const item of otherUpdates.orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          item.price = product.price; // store unit price
        }
      }
      // Update orderItems with recalculated prices
      order.orderItems = otherUpdates.orderItems;
      // Recalculate totalPrice as sum of unit price * quantity
      order.totalPrice = order.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    const updatedOrder = await order.save();
    try {
        const populatedOrder = await updatedOrder.populate('orderItems.product', 'title image').populate('user', 'name email phone');
        res.json(populatedOrder);
    }
    catch (populateError) {
        console.error("Error populating order after update:", populateError);
        res.json(updatedOrder);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete order by ID
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    await order.remove();
    res.json({ message: 'Order removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// New controller method to get all orders for admin with advanced filtering
exports.getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      startDate,
      endDate,
      minPrice,
      maxPrice,
      paymentMethod,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = {};
    
    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      query.totalPrice = {};
      if (minPrice) query.totalPrice.$gte = parseFloat(minPrice);
      if (maxPrice) query.totalPrice.$lte = parseFloat(maxPrice);
    }
    
    // Payment method filter
    if (paymentMethod && paymentMethod !== 'all') {
      query.paymentMethod = paymentMethod;
    }
    
    // Search by order ID, user name, or user email
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { _id: { $regex: searchRegex } },
        { 'user.name': { $regex: searchRegex } },
        { 'user.email': { $regex: searchRegex } }
      ];
    }

    // Sort configuration
    const sortConfig = {};
    sortConfig[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get total count for pagination
    const totalCount = await Order.countDocuments(query);
    
    // Get orders with pagination
    let orders = await Order.find(query)
      .populate('orderItems.product', 'title image')
      .populate('user', 'name email phone')
      .sort(sortConfig)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Filter out orderItems with null product
    orders = orders.map(order => {
      order.orderItems = order.orderItems.filter(item => item.product !== null).map(item => {
        return {
          ...item.toObject(),
          price: item.price,
        };
      });
      return order;
    });

    res.json({
      orders,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: parseInt(page),
      totalOrders: totalCount
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get order statistics
exports.getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' }
        }
      }
    ]);

    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders
    });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Bulk update orders
exports.bulkUpdateOrders = async (req, res) => {
  try {
    const { orderIds, status, note } = req.body;
    
    if (!orderIds || !orderIds.length) {
      return res.status(400).json({ message: 'No orders selected' });
    }

    const adminName = req.user?.name || 'Unknown Admin';
    
    const bulkOps = orderIds.map(orderId => ({
      updateOne: {
        filter: { _id: orderId },
        update: {
          $set: { status },
          $push: {
            statusHistory: {
              status,
              timestamp: new Date(),
              adminName,
              note: note || `Bulk status changed to ${status}`
            },
            actions: {
              adminName,
              action: `Bulk status changed to ${status}`,
              timestamp: new Date()
            }
          }
        }
      }
    }));

    await Order.bulkWrite(bulkOps);

    res.json({ message: `${orderIds.length} orders updated successfully` });
  } catch (error) {
    console.error('Error bulk updating orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get order timeline
exports.getOrderTimeline = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const timeline = order.statusHistory.map(entry => ({
      status: entry.status,
      timestamp: entry.timestamp,
      adminName: entry.adminName,
      note: entry.note,
      color: getStatusColor(entry.status),
      icon: getStatusIcon(entry.status),
      description: getStatusDescription(entry.status),
    }));

    res.json(timeline);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper functions for status visualization
function getStatusColor(status) {
  const colorMap = {
    pending: '#f59e0b',
    processing: '#3b82f6',
    shipped: '#8b5cf6',
    delivered: '#10b981',
    cancelled: '#ef4444',
    refunded: '#f97316',
    accepted: '#10b981',
    rejected: '#ef4444',
    edited: '#f59e0b',
  };
  return colorMap[status] || '#6b7280';
}

function getStatusIcon(status) {
  const iconMap = {
    pending: '⏳',
    processing: '🔄',
    shipped: '📦',
    delivered: '✅',
    cancelled: '❌',
    refunded: '💰',
    accepted: '✅',
    rejected: '❌',
    edited: '✏️',
  };
  return iconMap[this.status] || '📋';
}

function getStatusDescription(status) {
  const descriptionMap = {
    pending: 'Order received and awaiting review',
    processing: 'Order is being prepared',
    shipped: 'Order has been dispatched',
    delivered: 'Order has been delivered successfully',
    cancelled: 'Order has been cancelled',
    refunded: 'Payment has been refunded',
    accepted: 'Order has been accepted by admin',
    rejected: 'Order has been rejected by admin',
    edited: 'Order has been edited by admin',
  };
  return descriptionMap[this.status] || 'Unknown status';
}