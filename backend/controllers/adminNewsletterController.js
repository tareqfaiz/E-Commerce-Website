const Newsletter = require('../models/Newsletter');

// Get all newsletter subscribers
exports.getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().select('email createdAt');
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new subscriber
exports.createSubscriber = async (req, res) => {
  const { email } = req.body;
  try {
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Subscriber already exists' });
    }
    const subscriber = new Newsletter({ email });
    const created = await subscriber.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a subscriber's email
exports.updateSubscriber = async (req, res) => {
  const { email } = req.params;
  const { newEmail } = req.body;
  try {
    const subscriber = await Newsletter.findOne({ email });
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }
    subscriber.email = newEmail || subscriber.email;
    const updated = await subscriber.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a subscriber by email
exports.deleteSubscriber = async (req, res) => {
  const { email } = req.params;
  try {
    const deleted = await Newsletter.findOneAndDelete({ email });
    if (!deleted) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }
    res.json({ message: 'Subscriber deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
