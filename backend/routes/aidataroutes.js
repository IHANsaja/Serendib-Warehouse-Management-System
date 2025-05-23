const express = require('express');
const router = express.Router();
const AIdataController = require('../controllers/aidatacontroller');

router.post('/verify-count', AIdataController.saveAICount);

module.exports = router;
