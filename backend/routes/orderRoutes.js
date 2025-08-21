// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create new order
router.post('/', orderController.createOrder);

// Create truck visit for order
router.post('/truckvisit', orderController.createTruckVisit);

// Get all companies for dropdown
router.get('/companies', orderController.getAllCompanies);

// Create new company
router.post('/company', orderController.createCompany);

// Get orders by type (loading/unloading)
router.get('/', orderController.getOrdersByType);

// Truck Visit Arrival (Security Officer)
router.post('/truckvisit/arrival', orderController.truckArrival);

// Truck Visit Exit (Security Officer)
router.post('/truckvisit/exit', orderController.truckExit);

module.exports = router;
