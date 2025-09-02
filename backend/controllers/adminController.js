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

// Get admin by ID
exports.getAdminById = async (req, res) => {
  try {
    const admin = await User.findById(req.params.id).select('-password');
    if (admin && admin.isAdmin) {
      res.json(admin);
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Register a new admin
exports.registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      name,
      email,
      password,
      role: 'admin',
    });

    const createdUser = await user.save();

    if (createdUser) {
      res.status(201).json({
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
        isAdmin: createdUser.isAdmin,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update admin info and roles
exports.updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  try {
    const admin = await User.findById(id);
    if (!admin || !admin.isAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    admin.name = name || admin.name;
    admin.email = email || admin.email;
    admin.role = role || admin.role;

    if (password) {
      admin.password = password;
    }

    const updatedAdmin = await admin.save();
    res.json({
        _id: updatedAdmin._id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
        isAdmin: updatedAdmin.isAdmin,
    });
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

    await admin.deleteOne(); // Changed from admin.remove()
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
