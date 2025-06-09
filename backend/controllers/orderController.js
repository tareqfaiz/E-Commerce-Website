const Order = require('../models/Order');
const Product = require('../models/Product');

// Create new order
exports.addOrder = async (req, res) => {
  const {
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
    // Validate orderItems to ensure size is present
    const validatedOrderItems = orderItems.map(item => ({
      product: item.product,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
    }));

    // Fetch user from DB
    const user = await require('../models/User').findById(req.user._id);

    // Update user phone number if updatePhoneNumber flag is true and phoneNumber is different
    if (updatePhoneNumber && phoneNumber && user.phone !== phoneNumber) {
      user.phone = phoneNumber;
      await user.save();
    }

    const order = new Order({
      user: req.user._id,
      phoneNumber: phoneNumber || (user ? user.phone : ''),
      orderItems: validatedOrderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentResult,
      isPaid: paymentResult ? true : false,
      paidAt: paymentResult ? Date.now() : null,
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
      return res.status(404).json({ message: 'Order not found' });
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
    const orders = await Order.find({ user: req.user._id }).populate('orderItems.product', 'title image').populate('user', 'phone');
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
    // Update fields from req.body, including status if provided
    if (req.body.status && ['pending', 'accepted', 'rejected', 'edited'].includes(req.body.status)) {
      order.status = req.body.status;
      // Log admin action
      const adminName = req.user?.name || 'Unknown Admin';
      order.actions.push({
        adminName,
        action: `Status changed to ${req.body.status}`,
        timestamp: new Date(),
      });
    }
    // Update other fields
    for (const key of Object.keys(req.body)) {
      if (key !== 'status') {
        order[key] = req.body[key];
      }
    }

    // Recalculate prices if orderItems updated
    if (req.body.orderItems) {
      // Fetch product prices for each order item in req.body.orderItems
      for (const item of req.body.orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          item.price = product.price; // store unit price
        }
      }
      // Update orderItems with recalculated prices
      order.orderItems = req.body.orderItems;
      // Recalculate totalPrice as sum of unit price * quantity
      order.totalPrice = order.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    const updatedOrder = await order.save();
    const populatedOrder = await updatedOrder.populate('orderItems.product', 'title image').populate('user', 'phone');
    res.json(populatedOrder);
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

// New controller method to get all orders for admin
exports.getAllOrders = async (req, res) => {
  try {
    let orders = await Order.find({}).populate('orderItems.product', 'title image').populate('user', 'phone');
    // Filter out orderItems with null product, no need to recalculate unit price as price is already unit price
    orders = orders.map(order => {
      order.orderItems = order.orderItems.filter(item => item.product !== null).map(item => {
        return {
          ...item.toObject(),
          price: item.price,
        };
      });
      return order;
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
