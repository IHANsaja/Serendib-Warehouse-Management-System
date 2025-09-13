const express = require('express');
const router = express.Router();
const securityTimingController = require('../controllers/securityTimingController');

router.post('/', securityTimingController.createSecurityTiming);
router.get('/:visitId', securityTimingController.getSecurityTiming);

module.exports = router;
