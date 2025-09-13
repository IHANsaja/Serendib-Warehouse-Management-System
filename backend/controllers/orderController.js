const orderModel = require('../models/orderModel');
const db = require('../config/db');

exports.createOrder = async (req, res) => {
  const form = req.body;

  try {
    const companyId = await orderModel.getCompanyIdByName(form.CustomerName);
    if (!companyId) {
      return res.status(400).json({ error: 'Company not found' });
    }

    const orderData = {
      CompanyID: companyId,
      DriverName: form.DriverName || "Driver Name",
      VehicleNumber: form.VehicleNo,
      ItemCode: form.ItemCode,
      Item: form.Item,
      Type: form.Type,
      Quantity: form.Quantity,
      OrderDate: form.Date,
      EstimatedBayInTime: form.EstimatedBayIn,
      EstimatedBayOutTime: form.EstimatedBayOut,
      EO_ID: 1002, // Default executive officer ID
    };

    const orderId = await orderModel.insertOrder(orderData);
    res.status(200).json({ 
      message: 'Order inserted successfully',
      orderId: orderId
    });
  } catch (err) {
    console.error('Error in order creation:', err);
    res.status(500).json({ error: err.message || 'Database error' });
  }
};

// Get all companies for dropdown
exports.getAllCompanies = async (req, res) => {
  try {
    const [companies] = await db.query('SELECT CompanyID, Name FROM COMPANY ORDER BY Name');
    res.status(200).json(companies);
  } catch (err) {
    console.error('Error fetching companies:', err);
    res.status(500).json({ error: err.message || 'Database error' });
  }
};

// Create new company
exports.createCompany = async (req, res) => {
  const { Name, Address } = req.body;

  if (!Name || !Address) {
    return res.status(400).json({ error: 'Company name and address are required' });
  }

  try {
    // Check if company already exists
    const [existing] = await db.query('SELECT CompanyID FROM COMPANY WHERE Name = ?', [Name]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Company with this name already exists' });
    }

    // Get next available CompanyID
    const [maxIdResult] = await db.query('SELECT MAX(CompanyID) as maxId FROM COMPANY');
    const nextId = (maxIdResult[0].maxId || 0) + 1;

    // Insert new company
    await db.query('INSERT INTO COMPANY (CompanyID, Name, Address) VALUES (?, ?, ?)', [nextId, Name, Address]);
    
    res.status(201).json({ 
      message: 'Company created successfully',
      company: { CompanyID: nextId, Name, Address }
    });
  } catch (err) {
    console.error('Error creating company:', err);
    res.status(500).json({ error: err.message || 'Database error' });
  }
};

// Create truck visit for order
exports.createTruckVisit = async (req, res) => {
  const { vehicleNumber, truckType, companyId, seId, eoId, driverName, numSacks, estimatedArrivalTime, estimatedLeaveTime, orderId } = req.body;

  if (!vehicleNumber || !truckType || !companyId || !seId || !eoId || !orderId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validate that estimated times are provided
  if (!estimatedArrivalTime || !estimatedLeaveTime) {
    return res.status(400).json({ error: 'Estimated arrival and leave times are required' });
  }

  try {
    // Insert new truck visit with auto-increment VisitID
    const [result] = await db.query(
      `INSERT INTO TRUCKVISIT 
       (OrderID, VehicleNumber, DriverName, CompanyID, Type, Quantity, EstimatedArrivalTime, EstimatedLeaveTime, SE_ID, EO_ID) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        vehicleNumber, 
        driverName || 'Unknown', 
        companyId, 
        truckType, 
        numSacks || 0,
        estimatedArrivalTime, // Use the provided estimated time
        estimatedLeaveTime,   // Use the provided estimated time
        seId, 
        eoId
      ]
    );
    
    const visitId = result.insertId;
    
    res.status(201).json({ 
      message: 'Truck visit created successfully',
      visitId: visitId
    });
  } catch (err) {
    console.error('Error creating truck visit:', err);
    res.status(500).json({ error: err.message || 'Database error' });
  }
};

exports.getOrdersByType = async (req, res) => {
  const { type } = req.query;

  console.log("getOrdersByType called with type:", type);

  if (!type) {
    console.log("No type provided, returning error");
    return res.status(400).json({ error: 'Order type is required (loading or unloading)' });
  }

  try {
    console.log("Executing query: SELECT * FROM `ORDER` WHERE Type = ?", [type]);
    const [results] = await db.query(
      "SELECT * FROM `ORDER` WHERE Type = ?",
      [type]
    );
    console.log("Query results:", results);
    console.log("Number of results:", results.length);
    res.status(200).json(results);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

exports.truckArrival = async (req, res) => {
  const { vehicleNumber, truckType, arrivalTime, companyId, seId } = req.body;

  try {
    const [existing] = await db.query(
      `SELECT VisitID FROM TRUCKVISIT 
       WHERE VehicleNumber = ? AND TruckType = ? AND DATE(ArrivalTime) = CURDATE()`,
      [vehicleNumber, truckType]
    );

    if (existing.length > 0) {
      await db.query(
        `UPDATE TRUCKVISIT SET ArrivalTime = ? WHERE VisitID = ?`,
        [arrivalTime, existing[0].VisitID]
      );
      return res.json({ message: "Arrival time updated." });
    } else {
      await db.query(
        `INSERT INTO TRUCKVISIT (VehicleNumber, ArrivalTime, TruckType, CompanyID, SE_ID) 
         VALUES (?, ?, ?, ?, ?)`,
        [vehicleNumber, arrivalTime, truckType, companyId, seId]
      );
      return res.json({ message: "Arrival time recorded as new visit." });
    }
  } catch (err) {
    console.error("Error in arrival handler:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.truckExit = async (req, res) => {
  const { vehicleNumber, truckType, leaveTime } = req.body;

  try {
    const [existing] = await db.query(
      `SELECT VisitID FROM TRUCKVISIT 
       WHERE VehicleNumber = ? AND TruckType = ? AND DATE(ArrivalTime) = CURDATE()`,
      [vehicleNumber, truckType]
    );

    if (existing.length > 0) {
      await db.query(
        `UPDATE TRUCKVISIT SET LeaveTime = ? WHERE VisitID = ?`,
        [leaveTime, existing[0].VisitID]
      );
      return res.json({ message: "Leave time updated." });
    } else {
      return res.status(400).json({ error: "Visit not found for exit update." });
    }
  } catch (err) {
    console.error("Error in exit handler:", err);
    res.status(500).json({ error: "Server error" });
  }
};
