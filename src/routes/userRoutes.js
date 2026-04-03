const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole, updateUserStatus } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

router.get('/', protect, roleGuard('admin'), getAllUsers);
router.patch('/:id/role', protect, roleGuard('admin'), updateUserRole);
router.patch('/:id/status', protect, roleGuard('admin'), updateUserStatus);

module.exports = router;
