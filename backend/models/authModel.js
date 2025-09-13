// backend/models/authModel.js
const db = require('../config/db');

const findUserByNameAndRole = async (name, role) => {
  const [rows] = await db.query(
    'SELECT * FROM EMPLOYEE WHERE Name = ? AND Role = ?',
    [name, role]
  );
  return rows;
};

module.exports = {
  findUserByNameAndRole,
};
