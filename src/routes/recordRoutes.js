const express = require('express');
const router = express.Router();
const {
  createRecord, getRecords, getRecordById,
  updateRecord, deleteRecord, getDashboardSummary
} = require('../controllers/recordController');
const { protect } = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

router.get('/dashboard/summary', protect, roleGuard('admin', 'analyst'), getDashboardSummary);
router.post('/', protect, roleGuard('admin'), createRecord);
router.get('/', protect, roleGuard('admin', 'analyst', 'viewer'), getRecords);
router.get('/:id', protect, roleGuard('admin', 'analyst', 'viewer'), getRecordById);
router.put('/:id', protect, roleGuard('admin'), updateRecord);
router.delete('/:id', protect, roleGuard('admin'), deleteRecord);

module.exports = router;
