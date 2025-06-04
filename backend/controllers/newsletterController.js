const Newsletter = require('../models/Newsletter');

// Subscribe to newsletter
exports.subscribe = async (req, res) => {
  const { email } = req.body;
  try {
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }
    const subscription = new Newsletter({ email });
    await subscription.save();
    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Unsubscribe from newsletter
exports.unsubscribe = async (req, res) => {
  const { email } = req.body;
  try {
    const deleted = await Newsletter.findOneAndDelete({ email });
    if (!deleted) {
      return res.status(404).json({ message: 'Email not found' });
    }
    res.json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
