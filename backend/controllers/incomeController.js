// backend/controllers/incomeController.js
const incomeModel = require('../models/incomeModel');

// GET /api/incomes
async function listIncomes(req, res) {
  try {
    const rows = await incomeModel.getAllIncomes();
    res.json(rows);
  } catch (err) {
    console.error('Error fetching incomes:', err);
    res.status(500).json({ error: 'Failed to fetch incomes' });
  }
}

// POST /api/incomes
async function createIncome(req, res) {
  try {
    const { month, income } = req.body || {};

    // Basic validation
    if (!month || typeof month !== 'string' || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ error: 'Invalid or missing month. Expected format YYYY-MM' });
    }
    const numIncome = Number(income);
    if (!Number.isFinite(numIncome) || numIncome <= 0) {
      return res.status(400).json({ error: 'Invalid income value' });
    }

    const id = await incomeModel.addIncome({ month, income: numIncome });
    res.status(201).json({ message: 'Income added', id });
  } catch (err) {
    console.error('Error adding income:', err);
    res.status(500).json({ error: 'Failed to add income' });
  }
}

module.exports = {
  listIncomes,
  createIncome,
};
