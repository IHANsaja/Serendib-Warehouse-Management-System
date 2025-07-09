// const express = require('express');
// const cors = require('cors');
// const session = require('express-session');
// const cookieParser = require('cookie-parser');
// const db = require('./config/db');
// require('dotenv').config();

// const app = express();

// app.use(cors({
//   origin: 'http://localhost:5173',  //frontend URL
//   credentials: true                 //allow cookies
// }));

// app.use(express.json());
// app.use(cookieParser());

// // Test DB connection on startup
// db.query('SELECT 1')
//   .then(() => console.log('Database connection verified'))
//   .catch(err => {
//     console.error('Database connection failed:', err);
//     process.exit(1);
//   });

// app.use(session({
//   secret: 'yourSecretKey',  // use environment variable in production
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     httpOnly: true,
//     maxAge: 24 * 60 * 60 * 1000, // 1 day
//     sameSite: 'lax',
//   }
// }));

// // Route Variables
// const authRoutes = require('./routes/authRoutes');
// const aiDataRoutes = require('./routes/aidataroutes');
// const orderRoutes = require('./routes/orderRoutes');

// // API calls
// app.use('/api/auth', authRoutes);
// app.use('/api/aidata', aiDataRoutes);
// app.use('/api/order', orderRoutes);

// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });


// const express = require('express');
// const cors = require('cors');
// const session = require('express-session');
// const cookieParser = require('cookie-parser');
// const MySQLStore = require('express-mysql-session')(session);
// const db = require('./config/db');
// require('dotenv').config();

// const app = express();

// // Session store setup
// const sessionStore = new MySQLStore({
//   clearExpired: true,
//   checkExpirationInterval: 900000, // 15 minutes
//   expiration: 86400000, // 1 day
//   createDatabaseTable: true,
//   schema: {
//     tableName: 'sessions',
//     columnNames: {
//       session_id: 'session_id',
//       expires: 'expires',
//       data: 'data'
//     }
//   }
// }, db.promise());

// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true
// }));

// app.use(express.json());
// app.use(cookieParser());

// // Test DB connection
// db.query('SELECT 1')
//   .then(() => console.log('Database connection verified'))
//   .catch(err => {
//     console.error('Database connection failed:', err);
//     process.exit(1);
//   });

// // Session middleware with store
// app.use(session({
//   secret: process.env.SESSION_SECRET || 'yourSecretKey',
//   store: sessionStore,
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     httpOnly: true,
//     maxAge: 24 * 60 * 60 * 1000, // 1 day
//     sameSite: 'lax',
//     secure: process.env.NODE_ENV === 'production' // true in production
//   }
// }));

// // Routes
// const authRoutes = require('./routes/authRoutes');
// const aiDataRoutes = require('./routes/aidataroutes');
// const orderRoutes = require('./routes/orderRoutes');

// app.use('/api/auth', authRoutes);
// app.use('/api/aidata', aiDataRoutes);
// app.use('/api/order', orderRoutes);

// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });



const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MySQL2Store = require('connect-mysql2')(session); // Updated session store
const db = require('./config/db');
require('dotenv').config();

const app = express();

// Session store setup with connect-mysql2
const sessionStore = new MySQL2Store({
  config: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME
  },
  clearExpired: true,
  checkExpirationInterval: 900000, // 15 minutes
  expiration: 86400000, // 1 day
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

// Test DB connection
db.query('SELECT 1')
  .then(() => console.log('Database connection verified'))
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

// Session middleware with store
app.use(session({
  secret: process.env.SESSION_SECRET || 'yourSecretKey',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production' // true in production
  }
}));

// Routes
const authRoutes = require('./routes/authRoutes');
const aiDataRoutes = require('./routes/aidataroutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/aidata', aiDataRoutes);
app.use('/api/order', orderRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});