const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MySQLStore = require('express-mysql-session')(session);
const db = require('./config/db'); // This is mysql2/promise
require('dotenv').config();

const app = express();

// ✅ Session store config
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
  clearExpired: true,
  checkExpirationInterval: 900000, // 15 minutes
  expiration: 86400000, // 1 day
  createDatabaseTable: true,
  schema: {
    tableName: 'sessions',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    }
  }
});

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// ✅ Test DB connection
(async () => {
  try {
    const [rows] = await db.query('SELECT 1');
    console.log('✅ Database connection verified');
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
})();

// ✅ Apply session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'SerendibWMSSecret1@2',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production' // Only true in prod
  }
}));

// ✅ Route imports
const authRoutes = require('./routes/authRoutes');
const aiDataRoutes = require('./routes/aiRoutes');
const orderRoutes = require('./routes/orderRoutes');

// ✅ Use routes
app.use('/api/auth', authRoutes);
app.use('/api/aidata', aiDataRoutes);
app.use('/api/order', orderRoutes);

// ✅ Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
