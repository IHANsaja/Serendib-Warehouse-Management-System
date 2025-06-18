// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());

//Route Variables
const authRoutes = require('./routes/authRoutes');
const aiDataRoutes = require('./routes/aidataroutes');
const orderRoutes = require('./routes/orderRoutes');

//API calls
app.use('/api/auth', authRoutes);
app.use('/api/aidata', aiDataRoutes);
app.use('/api/order', orderRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
