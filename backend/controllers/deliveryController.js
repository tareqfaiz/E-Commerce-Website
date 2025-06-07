const Delivery = require('../models/Delivery');

// Create new delivery
exports.createDelivery = async (req, res) => {
  const { order, deliveryStatus, deliveryDate, deliveryAddress, deliveryPerson } = req.body;
  try {
    const delivery = new Delivery({
      order,
      deliveryStatus,
      deliveryDate,
      deliveryAddress,
      deliveryPerson,
    });
    const createdDelivery = await delivery.save();
    res.status(201).json(createdDelivery);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all deliveries
exports.getDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find().populate({
      path: 'order',
      populate: { path: 'user', select: 'name email _id' }
    });
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get delivery by ID
exports.getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id).populate('order');
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }
    res.json(delivery);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update delivery by ID
exports.updateDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }
    Object.assign(delivery, req.body);
    const updatedDelivery = await delivery.save();
    res.json(updatedDelivery);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete delivery by ID
exports.deleteDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }
    await delivery.remove();
    res.json({ message: 'Delivery removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
