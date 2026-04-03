const FinancialRecord = require('../models/FinancialRecord');

// POST /api/records — Admin only
const createRecord = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    const record = await FinancialRecord.create({
      amount, type, category, date, notes,
      createdBy: req.user._id
    });

    res.status(201).json({ message: 'Record created', record });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/records — Viewer, Analyst, Admin
// Supports filters: ?type=income&category=salary&startDate=2024-01-01&endDate=2024-12-31
// Supports pagination: ?page=1&limit=10
const getRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate, page = 1, limit = 10, search } = req.query;

    // Build filter object dynamically
    const filter = { isDeleted: false };

    if (type) filter.type = type;
    if (category) filter.category = new RegExp(category, 'i'); // case-insensitive
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    if (search) {
      filter.notes = new RegExp(search, 'i'); // search in notes
    }

    const skip = (page - 1) * limit;
    const total = await FinancialRecord.countDocuments(filter);
    const records = await FinancialRecord.find(filter)
      .populate('createdBy', 'name email')
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      records
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/records/:id
const getRecordById = async (req, res) => {
  try {
    const record = await FinancialRecord.findOne({
      _id: req.params.id,
      isDeleted: false
    }).populate('createdBy', 'name email');

    if (!record) return res.status(404).json({ message: 'Record not found.' });

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/records/:id — Admin only
const updateRecord = async (req, res) => {
  try {
    const record = await FinancialRecord.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    );

    if (!record) return res.status(404).json({ message: 'Record not found.' });

    res.json({ message: 'Record updated', record });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/records/:id — Soft delete, Admin only
const deleteRecord = async (req, res) => {
  try {
    const record = await FinancialRecord.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!record) return res.status(404).json({ message: 'Record not found.' });

    res.json({ message: 'Record soft-deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/records/dashboard/summary — Analyst + Admin
const getDashboardSummary = async (req, res) => {
  try {
    // Aggregate totals by type
    const totals = await FinancialRecord.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Build a readable object from aggregate result
    const summary = { totalIncome: 0, totalExpenses: 0 };
    totals.forEach(item => {
      if (item._id === 'income') summary.totalIncome = item.total;
      if (item._id === 'expense') summary.totalExpenses = item.total;
    });
    summary.netBalance = summary.totalIncome - summary.totalExpenses;

    // Category-wise breakdown
    const categoryBreakdown = await FinancialRecord.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: { category: '$category', type: '$type' },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { total: -1 } }
    ]);

    // Recent 5 transactions
    const recentTransactions = await FinancialRecord.find({ isDeleted: false })
      .sort({ date: -1 })
      .limit(5)
      .populate('createdBy', 'name');

    res.json({ summary, categoryBreakdown, recentTransactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRecord, getRecords, getRecordById,
  updateRecord, deleteRecord, getDashboardSummary
};
