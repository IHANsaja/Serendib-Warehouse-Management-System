const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',  //frontend URL
  credentials: true                 //allow cookies
}));

app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: 'yourSecretKey',  // use environment variable in production
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: 'lax',
  }
}));

// Route Variables
const authRoutes = require('./routes/authRoutes');
const aiDataRoutes = require('./routes/aidataroutes');
const orderRoutes = require('./routes/orderRoutes');

// API calls
app.use('/api/auth', authRoutes);
app.use('/api/aidata', aiDataRoutes);
app.use('/api/order', orderRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
