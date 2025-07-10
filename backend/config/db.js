// // config/db.js
// const mysql = require('mysql2');
// require('dotenv').config();

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: "",
//   database: process.env.DB_NAME,
// });

// db.connect((err) => {
//   if (err) {
//     console.error('DB connection failed: ', err);
//   } else {
//     console.log('Connected to MySQL');
//   }
// });

// module.exports = db;


// // config/db.js
// const mysql = require('mysql2/promise'); // Directly use promise version
// require('dotenv').config();

// const createDbConnection = async () => {
//   try {
//     const connection = await mysql.createConnection({
//       host: process.env.DB_HOST,
//       user: process.env.DB_USER,
//       password: process.env.DB_PASSWORD || "", // Use env variable
//       database: process.env.DB_NAME,
//     });
//     console.log('Connected to MySQL (promise)');
//     return connection;
//   } catch (err) {
//     console.error('DB connection failed:', err);
//     process.exit(1);
//   }
// };

// // Export a promise that resolves to the connection
// module.exports = createDbConnection();


// backend/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log('✅ MySQL pool (with promise) created');
module.exports = pool;