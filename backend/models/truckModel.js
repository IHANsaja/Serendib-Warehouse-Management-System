const db = require('../config/db');

// Get all truck visits by type, with optional date filtering
const getTruckVisitsByType = async (truckType, filterDate) => {
    // Base query - updated to work with new database structure
    let sql = `
        SELECT 
            o.OrderID AS orderId,
            tv.VehicleNumber AS truckNumber,
            o.Quantity AS quantity,
            c.Name AS organization,
            o.ItemCode AS itemCode,
            o.OrderDate AS date,
            -- Determine status based on the truck's actual leave time
            CASE 
                WHEN tv.ActualLeaveTime IS NOT NULL THEN 'completed'
                ELSE 'pending'
            END AS status
        FROM TRUCKVISIT tv
        JOIN COMPANY c ON tv.CompanyID = c.CompanyID
        LEFT JOIN \`ORDER\` o ON o.OrderID = tv.OrderID
        WHERE tv.Type = ?
    `;

    const params = [truckType];

    // Add date filtering to the query if a date is provided
    if (filterDate) {
        // Filter by TRUCKVISIT's estimated arrival time
        sql += ' AND DATE(tv.EstimatedArrivalTime) = ?'; 
        params.push(filterDate);
    }
    
    sql += ' ORDER BY tv.EstimatedArrivalTime DESC';

    const [rows] = await db.query(sql, params);
    return rows;
};

module.exports = {
    getTruckVisitsByType
};