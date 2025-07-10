// backend/models/orderModel.js
const db = require('../config/db');

const getCompanyIdByName = async (companyName) => {
  const [rows] = await db.query('SELECT CompanyID FROM COMPANY WHERE Name = ?', [companyName]);
  return rows.length > 0 ? rows[0].CompanyID : null;
};

const insertOrder = async (orderData) => {
  const {
    OrderID,
    ProductName,
    QtyOrdered,
    CompanyID,
    CustomerName,
    ItemCode,
    VehicleNo,
    Date,
    Type,
  } = orderData;

  await db.query(
    `INSERT INTO \`ORDER\` 
     (OrderID, ProductName, QtyOrdered, CompanyID, CustomerName, ItemCode, VehicleNo, Date, Type)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      OrderID,
      ProductName,
      QtyOrdered,
      CompanyID,
      CustomerName,
      ItemCode,
      VehicleNo,
      Date,
      Type,
    ]
  );
};

module.exports = { getCompanyIdByName, insertOrder };