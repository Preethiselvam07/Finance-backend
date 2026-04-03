const User = require('../models/User');

// GET /api/users — Admin only
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/users/:id/role — Admin only
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ['admin', 'analyst', 'viewer'];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role provided.' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.json({ message: 'Role updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/users/:id/status — Admin only
const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.json({ message: `User ${isActive ? 'activated' : 'deactivated'}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, updateUserRole, updateUserStatus };
