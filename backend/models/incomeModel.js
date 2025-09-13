// backend/models/incomeModel.js
const db = require('../config/db');

// Get all income records ordered by Month ascending (YYYY-MM lexical sort works)
async function getAllIncomes() {
  const sql = `
    SELECT IncomeID, Month, Income, CreatedAt
    FROM MONTHLY_INCOME
    ORDER BY Month ASC, IncomeID ASC
  `;
  const [rows] = await db.query(sql);
  return rows;
}

// Add a new income record
async function addIncome({ month, income }) {
  const sql = `
    INSERT INTO MONTHLY_INCOME (Month, Income)
    VALUES (?, ?)
  `;
  const [result] = await db.query(sql, [month, income]);
  return result.insertId;
}

module.exports = {
  getAllIncomes,
  addIncome,
};
