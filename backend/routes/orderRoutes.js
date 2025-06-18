// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderModel = require('../models/orderModel');
const db = require('../config/db');

router.post('/', (req, res) => {
  const form = req.body;

  orderModel.getCompanyIdByName(form.CustomerName, (err, companyId) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!companyId) return res.status(400).json({ error: 'Company not found' });

    const orderData = {
      ...form,
      CompanyID: companyId,
    };

    orderModel.insertOrder(orderData, (err, result) => {
      if (err) return res.status(500).json({ error: 'Insert failed' });
      res.status(200).json({ message: 'Order inserted successfully' });
    });
  });
});


// Get orders by TYPE
router.get('/', (req, res) => {
  const { type } = req.query;

  if (!type) {
    return res.status(400).json({ error: 'Order type is required (loading or unloading)' });
  }

  const query = "SELECT * FROM `ORDER` WHERE Type = ?";
  db.query(query, [type], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(200).json(results);
  });
});

module.exports = router;
