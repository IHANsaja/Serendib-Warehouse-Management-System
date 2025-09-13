// routes/predictRoutes.js
const express = require("express");
const router = express.Router();
const { predictIncome } = require("../controllers/predictController");

// POST /api/predict
router.post("/", predictIncome);

module.exports = router;