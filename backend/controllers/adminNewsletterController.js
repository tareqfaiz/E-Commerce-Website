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
