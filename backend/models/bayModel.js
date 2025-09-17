const db = require('../config/db');

// Get all available bays by type
exports.getAvailableBays = async (type) => {
  const [rows] = await db.execute(
    `SELECT * FROM BAY WHERE Type = ? AND Status = 'Available' ORDER BY BayNumber`,
    [type]
  );
  return rows;
};

// Get bay operation by visit ID
exports.getBayOperationByVisit = async (visitId) => {
  const [rows] = await db.execute(
    `SELECT bo.*, b.BayNumber, b.LocationDescription 
     FROM BAYOPERATION bo 
     JOIN BAY b ON bo.BayID = b.BayID 
     WHERE bo.VisitID = ?`,
    [visitId]
  );
  return rows[0];
};

// Get truck visit with order details
exports.getTruckVisitWithOrder = async (visitId) => {
  const [rows] = await db.execute(
    `SELECT tv.*, o.ItemCode, o.Item, o.Quantity, c.Name as CompanyName
     FROM TRUCKVISIT tv 
     JOIN \`ORDER\` o ON tv.OrderID = o.OrderID 
     JOIN COMPANY c ON tv.CompanyID = c.CompanyID 
     WHERE tv.VisitID = ?`,
    [visitId]
  );
  return rows[0];
};

// Update truck arrival time (Security Officer)
exports.updateTruckArrival = async (visitId, actualArrivalTime, seId) => {
  const [result] = await db.execute(
    `UPDATE TRUCKVISIT 
     SET ActualArrivalTime = ?, Status = 'Arrived', SE_ID = ? 
     WHERE VisitID = ?`,
    [actualArrivalTime, seId, visitId]
  );
  return result;
};

// Update truck leave time (Security Officer)
exports.updateTruckLeave = async (visitId, actualLeaveTime, seId) => {
  const [result] = await db.execute(
    `UPDATE TRUCKVISIT 
     SET ActualLeaveTime = ?, Status = 'Left', SE_ID = ? 
     WHERE VisitID = ?`,
    [actualLeaveTime, seId, visitId]
  );

  // Auto-record Security activity into efficiency tracking when truck leaves
  try {
    const [tvRows] = await db.execute(`SELECT Type FROM TRUCKVISIT WHERE VisitID = ?`, [visitId]);
    const type = tvRows[0]?.Type; // 'Loading' or 'Unloading'
    if (type && seId) {
      const [sess] = await db.execute(
        `SELECT SessionID FROM EMPLOYEE_SESSION WHERE EmployeeID = ? AND LogoutTime IS NULL ORDER BY SessionID DESC LIMIT 1`,
        [seId]
      );
      if (sess.length > 0) {
        await db.execute(
          `INSERT INTO EMPLOYEE_TRUCK_ACTIVITY (SessionID, EmployeeID, VisitID, Type) VALUES (?, ?, ?, ?)`,
          [sess[0].SessionID, seId, visitId, type]
        );
      }
    }
  } catch (err) {
    console.error('Failed to auto-record Security activity:', err);
  }

  return result;
};

// Update bay-in time (Executive Officer)
exports.updateBayInTime = async (visitId, actualBayInTime, eoId) => {
  const [result] = await db.execute(
    `UPDATE BAYOPERATION 
     SET ActualBayInTime = ?, Status = 'Bay In', EO_ID = ? 
     WHERE VisitID = ?`,
    [actualBayInTime, eoId, visitId]
  );
  
  if (result.affectedRows > 0) {
    // Update truck visit status
    await db.execute(
      `UPDATE TRUCKVISIT SET Status = 'At Bay' WHERE VisitID = ?`,
      [visitId]
    );
    
    // Update bay status to occupied
    const [bayOp] = await db.execute(
      `SELECT BayID FROM BAYOPERATION WHERE VisitID = ?`,
      [visitId]
    );
    
    if (bayOp.length > 0) {
      await db.execute(
        `UPDATE BAY SET Status = 'Occupied' WHERE BayID = ?`,
        [bayOp[0].BayID]
      );
    }
  }
  
  return result;
};

// Update bay-out time (Executive Officer)
exports.updateBayOutTime = async (visitId, actualBayOutTime, eoId) => {
  const [result] = await db.execute(
    `UPDATE BAYOPERATION 
     SET ActualBayOutTime = ?, Status = 'Completed', EO_ID = ? 
     WHERE VisitID = ?`,
    [actualBayOutTime, eoId, visitId]
  );
  
  if (result.affectedRows > 0) {
    // Update truck visit status
    await db.execute(
      `UPDATE TRUCKVISIT SET Status = 'Completed' WHERE VisitID = ?`,
      [visitId]
    );
    
    // Update bay status to available
    const [bayOp] = await db.execute(
      `SELECT BayID FROM BAYOPERATION WHERE VisitID = ?`,
      [visitId]
    );
    
    if (bayOp.length > 0) {
      await db.execute(
        `UPDATE BAY SET Status = 'Available' WHERE BayID = ?`,
        [bayOp[0].BayID]
      );
    }

    // Auto-record EO activity into efficiency tracking (if an active session exists)
    try {
      const [tvRows] = await db.execute(`SELECT Type FROM TRUCKVISIT WHERE VisitID = ?`, [visitId]);
      const type = tvRows[0]?.Type; // 'Loading' or 'Unloading'
      if (type && eoId) {
        const [sess] = await db.execute(
          `SELECT SessionID FROM EMPLOYEE_SESSION WHERE EmployeeID = ? AND LogoutTime IS NULL ORDER BY SessionID DESC LIMIT 1`,
          [eoId]
        );
        if (sess.length > 0) {
          await db.execute(
            `INSERT INTO EMPLOYEE_TRUCK_ACTIVITY (SessionID, EmployeeID, VisitID, Type) VALUES (?, ?, ?, ?)`,
            [sess[0].SessionID, eoId, visitId, type]
          );
        }
      }
    } catch (err) {
      console.error('Failed to auto-record EO activity:', err);
    }
  }
  
  return result;
};

// Get all pending truck visits for security
exports.getPendingTruckVisits = async () => {
  const [rows] = await db.execute(
    `SELECT tv.*, o.ItemCode, o.Item, o.Quantity, c.Name as CompanyName
     FROM TRUCKVISIT tv 
     JOIN \`ORDER\` o ON tv.OrderID = o.OrderID 
     JOIN COMPANY c ON tv.CompanyID = c.CompanyID 
     WHERE tv.Status IN ('Scheduled', 'Arrived', 'At Bay', 'Completed')
     ORDER BY tv.EstimatedArrivalTime`
  );
  return rows;
};

// Get all truck visits for executive officer
exports.getTruckVisitsForExecutive = async () => {
  const [rows] = await db.execute(
    `SELECT tv.*, o.ItemCode, o.Item, o.Quantity, c.Name as CompanyName,
            o.EstimatedBayInTime, o.EstimatedBayOutTime,
            bo.BayID, bo.EstimatedBayInTime as BayOpEstimatedBayInTime, bo.EstimatedBayOutTime as BayOpEstimatedBayOutTime,
            bo.ActualBayInTime, bo.ActualBayOutTime, bo.Status as BayStatus,
            b.BayNumber, b.LocationDescription
     FROM TRUCKVISIT tv 
     JOIN \`ORDER\` o ON tv.OrderID = o.OrderID 
     JOIN COMPANY c ON tv.CompanyID = c.CompanyID 
     LEFT JOIN BAYOPERATION bo ON tv.VisitID = bo.VisitID
     LEFT JOIN BAY b ON bo.BayID = b.BayID
     ORDER BY tv.EstimatedArrivalTime`
  );
  return rows;
};

// Assign bay to truck visit
exports.assignBayToVisit = async (visitId, bayId, eoId) => {
  // Check if bay is available
  const [bayCheck] = await db.execute(
    `SELECT Status FROM BAY WHERE BayID = ?`,
    [bayId]
  );
  
  if (bayCheck.length === 0 || bayCheck[0].Status !== 'Available') {
    throw new Error('Bay is not available');
  }

  // Ensure selected bay type matches the truck visit type
  const [[visitRow]] = await db.execute(
    `SELECT tv.Type AS VisitType, o.EstimatedBayInTime, o.EstimatedBayOutTime
     FROM TRUCKVISIT tv
     JOIN \`ORDER\` o ON tv.OrderID = o.OrderID
     WHERE tv.VisitID = ?`,
    [visitId]
  );

  if (!visitRow) {
    throw new Error('Truck visit not found');
  }

  const [[bayRow]] = await db.execute(
    `SELECT Type FROM BAY WHERE BayID = ?`,
    [bayId]
  );

  if (!bayRow) {
    throw new Error('Bay not found');
  }

  if (bayRow.Type !== visitRow.VisitType) {
    throw new Error('Selected bay type does not match truck visit type');
  }
  
  // Get estimated bay times from the ORDER table
  const estimatedBayInTime = visitRow.EstimatedBayInTime;
  const estimatedBayOutTime = visitRow.EstimatedBayOutTime;
  
  // Create or update bay operation
  const [existing] = await db.execute(
    `SELECT BayOpID, BayID FROM BAYOPERATION WHERE VisitID = ?`,
    [visitId]
  );
  
  if (existing.length > 0) {
    // Update existing bay operation
    const previousBayId = existing[0].BayID;
    const [result] = await db.execute(
      `UPDATE BAYOPERATION 
       SET BayID = ?, EstimatedBayInTime = ?, EstimatedBayOutTime = ?, EO_ID = ? 
       WHERE VisitID = ?`,
      [bayId, estimatedBayInTime, estimatedBayOutTime, eoId, visitId]
    );
    
    // Free previously assigned bay if different
    if (previousBayId && previousBayId !== bayId) {
      await db.execute(
        `UPDATE BAY SET Status = 'Available' WHERE BayID = ?`,
        [previousBayId]
      );
    }

    // Update new bay status to occupied
    await db.execute(
      `UPDATE BAY SET Status = 'Occupied' WHERE BayID = ?`,
      [bayId]
    );
    
    return result;
  } else {
    // Create new bay operation
    const [result] = await db.execute(
      `INSERT INTO BAYOPERATION 
       (VisitID, BayID, EstimatedBayInTime, EstimatedBayOutTime, EO_ID) 
       VALUES (?, ?, ?, ?, ?)`,
      [visitId, bayId, estimatedBayInTime, estimatedBayOutTime, eoId]
    );
    
    // Update bay status to occupied
    await db.execute(
      `UPDATE BAY SET Status = 'Occupied' WHERE BayID = ?`,
      [bayId]
    );
    
    return result;
  }
};

// Check if all bays of a specific type are occupied
exports.checkAllBaysOccupied = async (type) => {
  try {
    const [bays] = await db.execute(
      `SELECT COUNT(*) as total, 
              SUM(CASE WHEN Status = 'Occupied' THEN 1 ELSE 0 END) as occupied
       FROM BAY 
       WHERE Type = ?`,
      [type]
    );
    
    if (bays.length > 0) {
      const { total, occupied } = bays[0];
      return {
        allOccupied: occupied === total,
        totalBays: total,
        occupiedBays: occupied,
        availableBays: total - occupied
      };
    }
    
    return { allOccupied: false, totalBays: 0, occupiedBays: 0, availableBays: 0 };
  } catch (error) {
    console.error('Error checking bay availability:', error);
    throw error;
  }
};

// Get bay availability status for all bay types
exports.getBayAvailabilityStatus = async () => {
  try {
    const [loadingBays] = await db.execute(
      `SELECT COUNT(*) as total, 
              SUM(CASE WHEN Status = 'Occupied' THEN 1 ELSE 0 END) as occupied
       FROM BAY 
       WHERE Type = 'Loading'`
    );
    
    const [unloadingBays] = await db.execute(
      `SELECT COUNT(*) as total, 
              SUM(CASE WHEN Status = 'Occupied' THEN 1 ELSE 0 END) as occupied
       FROM BAY 
       WHERE Type = 'Unloading'`
    );
    
    return {
      loading: {
        allOccupied: loadingBays[0]?.occupied === loadingBays[0]?.total,
        totalBays: loadingBays[0]?.total || 0,
        occupiedBays: loadingBays[0]?.occupied || 0,
        availableBays: (loadingBays[0]?.total || 0) - (loadingBays[0]?.occupied || 0)
      },
      unloading: {
        allOccupied: unloadingBays[0]?.occupied === unloadingBays[0]?.total,
        totalBays: unloadingBays[0]?.total || 0,
        occupiedBays: unloadingBays[0]?.occupied || 0,
        availableBays: (unloadingBays[0]?.total || 0) - (unloadingBays[0]?.occupied || 0)
      }
    };
  } catch (error) {
    console.error('Error getting bay availability status:', error);
    throw error;
  }
};
