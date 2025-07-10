const db = require('./config/db');

db.query('SELECT 1', (err, results) => {
  if (err) return console.error("DB Test Error:", err);
  console.log("✅ DB Test Passed");
});