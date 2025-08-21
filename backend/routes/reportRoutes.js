const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Individual visit report
router.get('/:visitId', reportController.getReport);

// Visit list
router.get('/', reportController.getVisitList);

// Comprehensive delay management reports
router.get('/summary/delay', reportController.getDelaySummaryReport);
router.get('/company/delay', reportController.getCompanyDelayReport);
router.get('/bay/performance', reportController.getBayPerformanceReport);
router.get('/employee/performance', reportController.getEmployeePerformanceReport);

module.exports = router;
