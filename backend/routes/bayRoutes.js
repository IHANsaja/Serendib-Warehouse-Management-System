const express = require('express');
const router = express.Router();
const bayController = require('../controllers/bayController');

// Get available bays by type
router.get('/bays', bayController.getAvailableBays);

// Get truck visits for security officer
router.get('/truck-visits/security', bayController.getTruckVisitsForSecurity);

// Get truck visits for executive officer
router.get('/truck-visits/executive', bayController.getTruckVisitsForExecutive);

// Update truck arrival time (Security Officer)
router.put('/truck-visit/:visitId/arrival', bayController.updateTruckArrival);

// Update truck leave time (Security Officer)
router.put('/truck-visit/:visitId/leave', bayController.updateTruckLeave);

// Update bay-in time (Executive Officer)
router.put('/truck-visit/:visitId/bay-in', bayController.updateBayInTime);

// Update bay-out time (Executive Officer)
router.put('/truck-visit/:visitId/bay-out', bayController.updateBayOutTime);

// Assign bay to truck visit
router.put('/truck-visit/:visitId/assign-bay', bayController.assignBayToVisit);

// Get current Sri Lanka time
router.get('/time/sri-lanka', bayController.getSriLankaTime);

// Check bay availability
router.get('/availability/:type', bayController.checkBayAvailability);

// Get bay availability status for all types
router.get('/availability', bayController.getBayAvailabilityStatus);

module.exports = router;