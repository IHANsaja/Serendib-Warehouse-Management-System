// backend/models/orderModel.js
const db = require('../config/db');

const getCompanyIdByName = async (companyName) => {
  const [rows] = await db.query('SELECT CompanyID FROM COMPANY WHERE Name = ?', [companyName]);
  return rows.length > 0 ? rows[0].CompanyID : null;
};

const insertOrder = async (orderData) => {
  const {
    CompanyID,
    DriverName,
    VehicleNumber,
    ItemCode,
    Item,
    Type,
    Quantity,
    OrderDate,
    EstimatedBayInTime,
    EstimatedBayOutTime,
    EO_ID,
  } = orderData;

  const [result] = await db.query(
    `INSERT INTO \`ORDER\` 
     (CompanyID, DriverName, VehicleNumber, ItemCode, Item, Type, Quantity, OrderDate, EstimatedBayInTime, EstimatedBayOutTime, EO_ID)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      CompanyID,
      DriverName,
      VehicleNumber,
      ItemCode,
      Item,
      Type,
      Quantity,
      OrderDate,
      EstimatedBayInTime,
      EstimatedBayOutTime,
      EO_ID,
    ]
  );
  
  return result.insertId; // Return the auto-generated OrderID
};

module.exports = { getCompanyIdByName, insertOrder };