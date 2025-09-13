const express = require('express');
const router = express.Router();
const { getEmployeePerformance } = require('../controllers/employeeController');

// Route to get all employees with their performance metrics
// GET /api/employees/performance
router.get('/performance', getEmployeePerformance);

module.exports = router;