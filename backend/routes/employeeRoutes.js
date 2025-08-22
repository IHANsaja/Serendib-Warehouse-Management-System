const express = require('express');
const router = express.Router();
const { 
    getAllEmployees, 
    getCurrentMonthEfficiency, 
    getEmployeeEfficiencyByDateRange, 
    getEmployeeSessions, 
    getSessionTrucks, 
    addTruckManagement, 
    getEmployeePerformanceSummary 
} = require('../controllers/employeeController');

// Route to get all employees with their efficiency metrics
// GET /api/employees
router.get('/', getAllEmployees);

// Route to get current month efficiency for all employees
// GET /api/employees/monthly
router.get('/monthly', getCurrentMonthEfficiency);

// Route to get employee efficiency for a specific date range
// GET /api/employees/:employeeID/efficiency/:startDate/:endDate
router.get('/:employeeID/efficiency/:startDate/:endDate', getEmployeeEfficiencyByDateRange);

// Route to get employee login sessions for a specific date
// GET /api/employees/:employeeID/sessions/:date
router.get('/:employeeID/sessions/:date', getEmployeeSessions);

// Route to get trucks managed by employee during a specific session
// GET /api/employees/sessions/:sessionID/trucks
router.get('/sessions/:sessionID/trucks', getSessionTrucks);

// Route to add truck management record for an employee session
// POST /api/employees/truck-management
router.post('/truck-management', addTruckManagement);

// Route to update truck management record
// PUT /api/employees/truck-management/:recordID
router.put('/truck-management/:recordID', addTruckManagement);

// Route to delete truck management record
// DELETE /api/employees/truck-management/:recordID
router.delete('/truck-management/:recordID', (req, res) => {
    // This would need to be implemented in the controller
    res.status(501).json({ message: 'Delete functionality not yet implemented' });
});

// Route to get employee performance summary
// GET /api/employees/summary
router.get('/summary', getEmployeePerformanceSummary);

// Legacy route for backward compatibility (redirects to new endpoint)
// GET /api/employees/performance
router.get('/performance', (req, res) => {
    res.redirect('/api/employees');
});

module.exports = router;