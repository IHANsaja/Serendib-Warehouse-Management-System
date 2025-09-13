// backend/routes/incomeRoutes.js
const express = require('express');
const router = express.Router();
const { listIncomes, createIncome } = require('../controllers/incomeController');

router.get('/', listIncomes);
router.post('/', createIncome);

module.exports = router;
