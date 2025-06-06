const Database = require('../models/Database');

// Create new database
exports.createDatabase = async (req, res) => {
  const { name, type, connectionString, description } = req.body;
  try {
    const existing = await Database.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Database already exists' });
    }
    const database = new Database({
      name,
      type,
      connectionString,
      description,
    });
    const created = await database.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all databases
exports.getDatabases = async (req, res) => {
  try {
    const databases = await Database.find();
    res.json(databases);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get database by ID
exports.getDatabaseById = async (req, res) => {
  try {
    const database = await Database.findById(req.params.id);
    if (!database) {
      return res.status(404).json({ message: 'Database not found' });
    }
    res.json(database);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update database by ID
exports.updateDatabase = async (req, res) => {
  try {
    const database = await Database.findById(req.params.id);
    if (!database) {
      return res.status(404).json({ message: 'Database not found' });
    }
    Object.assign(database, req.body);
    const updated = await database.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete database by ID
exports.deleteDatabase = async (req, res) => {
  try {
    const database = await Database.findById(req.params.id);
    if (!database) {
      return res.status(404).json({ message: 'Database not found' });
    }
    await database.remove();
    res.json({ message: 'Database removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
