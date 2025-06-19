// backend/models/orderModel.js
const db = require('../config/db');

const getCompanyIdByName = (companyName, callback) => {
  db.query(
    'SELECT CompanyID FROM COMPANY WHERE Name = ?',
    [companyName],
    (err, results) => {
      if (err) return callback(err);
      if (results.length === 0) return callback(null, null);
      callback(null, results[0].CompanyID);
    }
  );
};

const insertOrder = (orderData, callback) => {
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

  db.query(
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
    ],
    callback
  );
};

module.exports = { getCompanyIdByName, insertOrder };
