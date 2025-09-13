const db = require('../config/db');

// Get current process status for all bays
exports.getCurrentProcessStatus = async () => {
  try {
    // Get ongoing operations (currently at bay) - get operations for all 6 bays
    const [ongoingOperations] = await db.execute(`
      SELECT 
        bo.BayOpID,
        bo.VisitID,
        bo.BayID,
        bo.Status as BayStatus,
        bo.ActualBayInTime,
        bo.ActualBayOutTime,
        tv.VehicleNumber,
        tv.DriverName,
        tv.Type as OperationType,
        tv.Quantity,
        tv.Status as TruckStatus,
        c.Name as CompanyName,
        o.Item,
        b.BayNumber,
        b.LocationDescription
      FROM BAYOPERATION bo
      JOIN TRUCKVISIT tv ON bo.VisitID = tv.VisitID
      JOIN \`ORDER\` o ON tv.OrderID = o.OrderID
      JOIN COMPANY c ON tv.CompanyID = c.CompanyID
      JOIN BAY b ON bo.BayID = b.BayID
      WHERE bo.Status IN ('Bay In', 'Scheduled') 
        AND tv.Status IN ('At Bay', 'Arrived')
      ORDER BY b.Type ASC, b.BayID ASC, bo.ActualBayInTime ASC
    `);

    // Get completed operations (bay out completed)
    const [completedOperations] = await db.execute(`
      SELECT 
        bo.BayOpID,
        bo.VisitID,
        bo.BayID,
        bo.Status as BayStatus,
        bo.ActualBayInTime,
        bo.ActualBayOutTime,
        tv.VehicleNumber,
        tv.DriverName,
        tv.Type as OperationType,
        tv.Quantity,
        tv.Status as TruckStatus,
        c.Name as CompanyName,
        o.Item,
        b.BayNumber,
        b.LocationDescription
      FROM BAYOPERATION bo
      JOIN TRUCKVISIT tv ON bo.VisitID = tv.VisitID
      JOIN \`ORDER\` o ON tv.OrderID = o.OrderID
      JOIN COMPANY c ON tv.CompanyID = c.CompanyID
      JOIN BAY b ON bo.BayID = b.BayID
      WHERE bo.Status = 'Completed' 
        AND tv.Status = 'Completed'
      ORDER BY bo.ActualBayOutTime DESC
    `);

    // Get pending operations (scheduled but not started)
    const [pendingOperations] = await db.execute(`
      SELECT 
        tv.VisitID,
        tv.Type as OperationType,
        tv.Quantity,
        tv.EstimatedArrivalTime,
        c.Name as CompanyName,
        o.Item
      FROM TRUCKVISIT tv
      JOIN \`ORDER\` o ON tv.OrderID = o.OrderID
      JOIN COMPANY c ON tv.CompanyID = c.CompanyID
      WHERE tv.Status = 'Scheduled'
        AND tv.EstimatedArrivalTime >= NOW()
      ORDER BY tv.EstimatedArrivalTime ASC
    `);

    // Count pending operations by type
    const pendingCounts = {
      loading: pendingOperations.filter(op => op.OperationType === 'Loading').length,
      unloading: pendingOperations.filter(op => op.OperationType === 'Unloading').length
    };

    return {
      ongoing: ongoingOperations,
      completed: completedOperations,
      pending: pendingOperations,
      pendingCounts
    };
  } catch (error) {
    console.error('Error fetching current process status:', error);
    throw error;
  }
};

// Get current process status with bay availability
exports.getCurrentProcessStatusWithAvailability = async () => {
  try {
    // Get ongoing operations
    const [ongoingOperations] = await db.execute(`
      SELECT 
        bo.BayOpID,
        bo.VisitID,
        bo.BayID,
        bo.Status as BayStatus,
        bo.ActualBayInTime,
        bo.ActualBayOutTime,
        tv.VehicleNumber,
        tv.DriverName,
        tv.Type as OperationType,
        tv.Quantity,
        tv.Status as TruckStatus,
        c.Name as CompanyName,
        o.Item,
        b.BayNumber,
        b.LocationDescription
      FROM BAYOPERATION bo
      JOIN TRUCKVISIT tv ON bo.VisitID = tv.VisitID
      JOIN \`ORDER\` o ON tv.OrderID = o.OrderID
      JOIN COMPANY c ON tv.CompanyID = c.CompanyID
      JOIN BAY b ON bo.BayID = b.BayID
      WHERE bo.Status IN ('Bay In', 'Scheduled') 
        AND tv.Status IN ('At Bay', 'Arrived')
      ORDER BY b.Type ASC, b.BayID ASC, bo.ActualBayInTime ASC
    `);

    // Get completed operations
    const [completedOperations] = await db.execute(`
      SELECT 
        bo.BayOpID,
        bo.VisitID,
        bo.BayID,
        bo.Status as BayStatus,
        bo.ActualBayInTime,
        bo.ActualBayOutTime,
        tv.VehicleNumber,
        tv.DriverName,
        tv.Type as OperationType,
        tv.Quantity,
        tv.Status as TruckStatus,
        c.Name as CompanyName,
        o.Item,
        b.BayNumber,
        b.LocationDescription
      FROM BAYOPERATION bo
      JOIN TRUCKVISIT tv ON bo.VisitID = tv.VisitID
      JOIN \`ORDER\` o ON tv.OrderID = o.OrderID
      JOIN COMPANY c ON tv.CompanyID = c.CompanyID
      JOIN BAY b ON bo.BayID = b.BayID
      WHERE bo.Status = 'Completed' 
        AND tv.Status = 'Completed'
      ORDER BY bo.ActualBayOutTime DESC
    `);

    // Get bay availability status
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
      ongoing: ongoingOperations,
      completed: completedOperations,
      bayAvailability: {
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
      }
    };
  } catch (error) {
    console.error('Error fetching current process status with availability:', error);
    throw error;
  }
};

// Get current process status for specific bay type
exports.getCurrentProcessStatusByType = async (type) => {
  try {
    const bayType = type === 'loading' ? 'Loading' : 'Unloading';
    
    // Get ongoing operations for specific type
    const [ongoingOperations] = await db.execute(`
      SELECT 
        bo.BayOpID,
        bo.VisitID,
        bo.BayID,
        bo.Status as BayStatus,
        bo.ActualBayInTime,
        bo.ActualBayOutTime,
        tv.VehicleNumber,
        tv.DriverName,
        tv.Type as OperationType,
        tv.Quantity,
        tv.Status as TruckStatus,
        c.Name as CompanyName,
        o.Item,
        b.BayNumber,
        b.LocationDescription
      FROM BAYOPERATION bo
      JOIN TRUCKVISIT tv ON bo.VisitID = tv.VisitID
      JOIN \`ORDER\` o ON tv.OrderID = o.OrderID
      JOIN COMPANY c ON tv.CompanyID = c.CompanyID
      JOIN BAY b ON bo.BayID = b.BayID
      WHERE bo.Status IN ('Bay In', 'Scheduled') 
        AND tv.Status IN ('At Bay', 'Arrived')
        AND b.Type = ?
      ORDER BY bo.ActualBayInTime ASC, bo.EstimatedBayInTime ASC
    `, [bayType]);

    // Get completed operations for specific type
    const [completedOperations] = await db.execute(`
      SELECT 
        bo.BayOpID,
        bo.VisitID,
        bo.BayID,
        bo.Status as BayStatus,
        bo.ActualBayInTime,
        bo.ActualBayOutTime,
        tv.VehicleNumber,
        tv.DriverName,
        tv.Type as OperationType,
        tv.Quantity,
        tv.Status as TruckStatus,
        c.Name as CompanyName,
        o.Item,
        b.BayNumber,
        b.LocationDescription
      FROM BAYOPERATION bo
      JOIN TRUCKVISIT tv ON bo.VisitID = tv.VisitID
      JOIN \`ORDER\` o ON tv.OrderID = o.OrderID
      JOIN COMPANY c ON tv.CompanyID = c.CompanyID
      JOIN BAY b ON bo.BayID = b.BayID
      WHERE bo.Status = 'Completed' 
        AND tv.Status = 'Completed'
        AND b.Type = ?
      ORDER BY bo.ActualBayOutTime DESC
      LIMIT 5
    `, [bayType]);

    // Get pending operations for specific type
    const [pendingOperations] = await db.execute(`
      SELECT 
        tv.VisitID,
        tv.Type as OperationType,
        tv.Quantity,
        tv.EstimatedArrivalTime,
        c.Name as CompanyName,
        o.Item
      FROM TRUCKVISIT tv
      JOIN \`ORDER\` o ON tv.OrderID = o.OrderID
      JOIN COMPANY c ON tv.CompanyID = c.CompanyID
      WHERE tv.Status = 'Scheduled'
        AND tv.EstimatedArrivalTime >= NOW()
        AND tv.Type = ?
      ORDER BY tv.EstimatedArrivalTime ASC
    `, [bayType]);

    return {
      ongoing: ongoingOperations,
      completed: completedOperations,
      pending: pendingOperations,
      pendingCount: pendingOperations.length
    };
  } catch (error) {
    console.error('Error fetching current process status by type:', error);
    throw error;
  }
};

// Get real-time process updates (for WebSocket or polling)
exports.getProcessUpdates = async () => {
  try {
    const [ongoingCount] = await db.execute(`
      SELECT COUNT(*) as count FROM BAYOPERATION bo
      JOIN TRUCKVISIT tv ON bo.VisitID = tv.VisitID
      WHERE bo.Status IN ('Bay In', 'Scheduled') 
        AND tv.Status IN ('At Bay', 'Arrived')
    `);

    const [completedCount] = await db.execute(`
      SELECT COUNT(*) as count FROM BAYOPERATION bo
      JOIN TRUCKVISIT tv ON bo.VisitID = tv.VisitID
      WHERE bo.Status = 'Completed' 
        AND tv.Status = 'Completed'
    `);

    const [pendingCount] = await db.execute(`
      SELECT COUNT(*) as count FROM TRUCKVISIT tv
      WHERE tv.Status = 'Scheduled'
        AND tv.EstimatedArrivalTime >= NOW()
    `);

    return {
      ongoing: ongoingCount[0].count,
      completed: completedCount[0].count,
      pending: pendingCount[0].count,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching process updates:', error);
    throw error;
  }
};
