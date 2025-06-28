// File: src/routes/aidataRoutes.js
const express = require('express');
const router = express.Router();
const { verifyCount, fetchVerifications } = require('../controllers/aidatacontroller');

router.post('/verify-count', verifyCount);
router.get('/records', fetchVerifications);

module.exports = router;
