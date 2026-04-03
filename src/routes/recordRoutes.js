const express = require('express');
const router = express.Router();
const {
  createRecord, getRecords, getRecordById,
  updateRecord, deleteRecord, getDashboardSummary
} = require('../controllers/recordController');
const { protect } = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

/**
 * @swagger
 * /api/records/dashboard/summary:
 *   get:
 *     summary: Get dashboard summary - Admin and Analyst only
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns total income, expenses, net balance, category breakdown and recent transactions
 *       403:
 *         description: Access denied
 */
router.get('/dashboard/summary', protect, roleGuard('admin', 'analyst'), getDashboardSummary);

/**
 * @swagger
 * /api/records:
 *   post:
 *     summary: Create a financial record - Admin only
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, type, category, date]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 5000
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: income
 *               category:
 *                 type: string
 *                 example: Salary
 *               date:
 *                 type: string
 *                 example: "2026-04-01"
 *               notes:
 *                 type: string
 *                 example: Monthly salary
 *     responses:
 *       201:
 *         description: Record created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Access denied
 */
router.post('/', protect, roleGuard('admin'), createRecord);

/**
 * @swagger
 * /api/records:
 *   get:
 *     summary: Get all records with filtering and pagination - All roles
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *         description: Filter by type
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *         description: Filter from date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *         description: Filter to date (YYYY-MM-DD)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in notes
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Records per page
 *     responses:
 *       200:
 *         description: Paginated list of records
 */
router.get('/', protect, roleGuard('admin', 'analyst', 'viewer'), getRecords);

/**
 * @swagger
 * /api/records/{id}:
 *   get:
 *     summary: Get a single record by ID - All roles
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Record ID
 *     responses:
 *       200:
 *         description: Record found
 *       404:
 *         description: Record not found
 */
router.get('/:id', protect, roleGuard('admin', 'analyst', 'viewer'), getRecordById);

/**
 * @swagger
 * /api/records/{id}:
 *   put:
 *     summary: Update a record - Admin only
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Record updated
 *       404:
 *         description: Record not found
 */
router.put('/:id', protect, roleGuard('admin'), updateRecord);

/**
 * @swagger
 * /api/records/{id}:
 *   delete:
 *     summary: Soft delete a record - Admin only
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record soft deleted successfully
 *       404:
 *         description: Record not found
 */
router.delete('/:id', protect, roleGuard('admin'), deleteRecord);

module.exports = router;
