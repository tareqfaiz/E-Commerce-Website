const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

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

// Get contact requests with pagination
const getContactRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const total = await Contact.countDocuments();
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      contacts,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error('Error fetching contact requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark contact request as read/unread
const markContactRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { read } = req.body;

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact request not found' });
    }

    contact.read = read;
    contact.readAt = read ? new Date() : null;

    await contact.save();

    res.json({ message: 'Contact request updated', contact });
  } catch (error) {
    console.error('Error updating contact request:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send reply email and log admin info
const replyContact = async (req, res) => {
    try {
      const { id } = req.params;
      const { replyMessage, adminName } = req.body;
  
      if (!replyMessage || !adminName) {
        return res
          .status(400)
          .json({ message: "Reply message and admin name are required" });
      }
  
      const contact = await Contact.findById(id);
      if (!contact) {
        return res.status(404).json({ message: "Contact request not found" });
      }
  
      // Send email to contact email
      const transporter = nodemailer.createTransport({
        // Configure your email service here
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: contact.email,
        subject: "Reply to your contact request",
        text: replyMessage,
      };
  
      await transporter.sendMail(mailOptions);
  
      // Update contact with reply info
      contact.repliedAt = new Date();
      contact.repliedBy = adminName;
      contact.replyMessage = replyMessage;
  
      await contact.save();
  
      res.json({ message: "Reply sent and contact updated", contact });
    } catch (error) {
      console.error("Error replying to contact request:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  // Delete contact request
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact request not found' });
    }

    // Ask for confirmation before deleting
    const confirm = req.body.confirm;
    if (!confirm) {
      return res.status(400).json({ message: 'Confirmation required to delete contact' });
    }

    await Contact.findByIdAndDelete(id);

    res.json({ message: 'Contact request deleted' });
  } catch (error) {
    console.error('Error deleting contact request:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
  
  module.exports = {
    submitContactForm,
    getContactRequests,
    markContactRead,
    replyContact,
    deleteContact,
  };
