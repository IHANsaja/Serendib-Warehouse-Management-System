// // backend/routes/orderRoutes.js
// const express = require('express');
// const router = express.Router();
// const orderModel = require('../models/orderModel');
// const db = require('../config/db');

// router.post('/', (req, res) => {
//   const form = req.body;

//   orderModel.getCompanyIdByName(form.CustomerName, (err, companyId) => {
//     if (err) return res.status(500).json({ error: 'DB error' });
//     if (!companyId) return res.status(400).json({ error: 'Company not found' });

//     const orderData = {
//       ...form,
//       CompanyID: companyId,
//     };

//     orderModel.insertOrder(orderData, (err, result) => {
//       if (err) return res.status(500).json({ error: 'Insert failed' });
//       res.status(200).json({ message: 'Order inserted successfully' });
//     });
//   });
// });


// // Get orders by TYPE
// router.get('/', (req, res) => {
//   const { type } = req.query;

//   if (!type) {
//     return res.status(400).json({ error: 'Order type is required (loading or unloading)' });
//   }

//   const query = "SELECT * FROM `ORDER` WHERE Type = ?";
//   db.query(query, [type], (err, results) => {
//     if (err) {
//       console.error("Database error:", err);
//       return res.status(500).json({ error: "Database error" });
//     }

//     res.status(200).json(results);
//   });
// });


// // Truck Visit handle in Security Officer's side
// router.post('/truckvisit/arrival', async (req, res) => {
//   const { vehicleNumber, truckType, arrivalTime, companyId, seId } = req.body;

//   try {
//     // Check if record exists for this vehicle & type today
//     const [existing] = await db.query(
//       `SELECT VisitID FROM TRUCKVISIT 
//        WHERE VehicleNumber = ? AND TruckType = ? AND DATE(ArrivalTime) = CURDATE()`,
//       [vehicleNumber, truckType]
//     );

//     if (existing.length > 0) {
//       // Update arrival time
//       await db.query(
//         `UPDATE TRUCKVISIT SET ArrivalTime = ? WHERE VisitID = ?`,
//         [arrivalTime, existing[0].VisitID]
//       );
//       return res.json({ message: "Arrival time updated." });
//     } else {
//       // Insert new visit
//       await db.query(
//         `INSERT INTO TRUCKVISIT (VehicleNumber, ArrivalTime, TruckType, CompanyID, SE_ID) 
//          VALUES (?, ?, ?, ?, ?)`,
//         [vehicleNumber, arrivalTime, truckType, companyId, seId]
//       );
//       return res.json({ message: "Arrival time recorded as new visit." });
//     }
//   } catch (err) {
//     console.error("Error in arrival handler:", err);
//     return res.status(500).json({ error: "Server error" });
//   }
// });

// router.post('/truckvisit/exit', async (req, res) => {
//   const { vehicleNumber, truckType, leaveTime } = req.body;

//   try {
//     const [existing] = await db.query(
//       `SELECT VisitID FROM TRUCKVISIT 
//        WHERE VehicleNumber = ? AND TruckType = ? AND DATE(ArrivalTime) = CURDATE()`,
//       [vehicleNumber, truckType]
//     );

//     if (existing.length > 0) {
//       await db.query(
//         `UPDATE TRUCKVISIT SET LeaveTime = ? WHERE VisitID = ?`,
//         [leaveTime, existing[0].VisitID]
//       );
//       return res.json({ message: "Leave time updated." });
//     } else {
//       return res.status(400).json({ error: "Visit not found for exit update." });
//     }
//   } catch (err) {
//     console.error("Error in exit handler:", err);
//     return res.status(500).json({ error: "Server error" });
//   }
// });

// module.exports = router;



// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderModel = require('../models/orderModel');
const db = require('../config/db');

router.post('/', async (req, res) => {
  const form = req.body;

  try {
    const companyId = await orderModel.getCompanyIdByName(form.CustomerName);
    if (!companyId) {
      return res.status(400).json({ error: 'Company not found' });
    }

    const orderData = {
      ...form,
      CompanyID: companyId,
    };

    await orderModel.insertOrder(orderData);
    res.status(200).json({ message: 'Order inserted successfully' });
  } catch (err) {
    console.error('Error in order creation:', err);
    res.status(500).json({ error: err.message || 'Database error' });
  }
});

// Get orders by TYPE
router.get('/', async (req, res) => {
  const { type } = req.query;

  if (!type) {
    return res.status(400).json({ error: 'Order type is required (loading or unloading)' });
  }

  try {
    const [results] = await db.query(
      "SELECT * FROM `ORDER` WHERE Type = ?",
      [type]
    );
    res.status(200).json(results);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Truck Visit handle in Security Officer's side
router.post('/truckvisit/arrival', async (req, res) => {
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
});

router.post('/truckvisit/exit', async (req, res) => {
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
});

module.exports = router;