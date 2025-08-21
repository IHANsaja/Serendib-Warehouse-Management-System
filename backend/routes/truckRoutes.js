// routes/TruckRoutes.js
const express = require('express');
const router = express.Router();
const TruckController = require('../controllers/truckController');

router.get('/loading', TruckController.getLoadingTrucks);
router.get('/unloading', TruckController.getUnloadingTrucks);

module.exports = router;
