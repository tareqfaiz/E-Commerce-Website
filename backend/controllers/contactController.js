const Contact = require('../models/Contact');

// Handle contact form submission
const submitContactForm = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please fill all required fields' });
  }

  try {
    const contact = new Contact({
      name,
      email,
      message,
    });

    const savedContact = await contact.save();

    res.status(201).json({ message: 'Contact form submitted successfully', contact: savedContact });
  } catch (error) {
    console.error('Error saving contact form:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  submitContactForm,
};
