const express = require('express');
const router = express.Router();
const currentProcessController = require('../controllers/currentProcessController');

// Get current process status for all bays
router.get('/status', currentProcessController.getCurrentProcessStatus);

// Get current process status for specific bay type
router.get('/status/:type', currentProcessController.getCurrentProcessStatusByType);

// Get current process summary (for dashboard)
router.get('/summary', currentProcessController.getCurrentProcessSummary);

// Get real-time process updates
router.get('/updates', currentProcessController.getProcessUpdates);

// Get current process status with bay availability
router.get('/status-with-availability', currentProcessController.getCurrentProcessStatusWithAvailability);

module.exports = router;
