const Order = require('../models/Order');

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

    const order = new Order({
      user: req.user._id,
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
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get orders for logged in user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('orderItems.product', 'title image');
    console.log('Fetched orders with populated products:', JSON.stringify(orders, null, 2)); // Debug log
    res.json(orders);
  } catch (error) {
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
    Object.keys(req.body).forEach(key => {
      if (key !== 'status') {
        order[key] = req.body[key];
      }
    });
    const updatedOrder = await order.save();
    res.json(updatedOrder);
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
