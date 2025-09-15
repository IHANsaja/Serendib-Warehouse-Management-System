// File: src/routes/aidataRoutes.js
const express = require('express');
const router = express.Router();
const { verifyCount, fetchVerifications, fetchCurrentVisit } = require('../controllers/aidatacontroller');

router.post('/verify-count', verifyCount);
router.get('/records', fetchVerifications);
router.get('/current-visit', fetchCurrentVisit);

module.exports = router;
