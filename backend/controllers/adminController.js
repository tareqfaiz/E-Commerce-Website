const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get all admins
exports.getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ isAdmin: true }).select('-password');
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update admin info and roles
exports.updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, isAdmin } = req.body;

  try {
    const admin = await User.findById(id);
    if (!admin || !admin.isAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (name) admin.name = name;
    if (email) admin.email = email;
    if (typeof isAdmin === 'boolean') admin.isAdmin = isAdmin;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      admin.password = hashedPassword;
    }

    await admin.save();
    res.json({ message: 'Admin updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an admin
exports.deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await User.findById(id);
    if (!admin || !admin.isAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    await admin.remove();
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
