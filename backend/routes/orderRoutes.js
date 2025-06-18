// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderModel = require('../models/orderModel');

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

module.exports = router;
