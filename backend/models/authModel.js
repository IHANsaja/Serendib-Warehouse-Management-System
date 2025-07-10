// models/authModel.js
const db = require('../config/db');

const findUserByNameAndRole = (name, role, callback) => {
  const query = 'SELECT * FROM EMPLOYEE WHERE Name = ? AND Role = ?';
  db.query(query, [name, role], callback); // ✅ Correct with callback-style pool
};

module.exports = {
  findUserByNameAndRole,
};
