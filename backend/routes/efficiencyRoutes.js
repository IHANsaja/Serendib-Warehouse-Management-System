const express = require('express');
const router = express.Router();
const efficiencyController = require('../controllers/efficiencyController');

// Start or ensure an active session for the current user
router.post('/start', efficiencyController.startSession);

// Stop active session for the current user
router.post('/stop', efficiencyController.stopSession);

// Record a handled truck (loading/unloading)
router.post('/record', efficiencyController.recordActivity);

// Get efficiency summary for current user or specific employee
router.get('/summary', efficiencyController.getSummary);
router.get('/all', efficiencyController.getAllSummaries);
router.get('/:employeeId', efficiencyController.getSummary);

module.exports = router;
