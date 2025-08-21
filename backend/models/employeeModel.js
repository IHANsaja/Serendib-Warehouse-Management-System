const db = require('../config/db');

/**
 * Fetches employees (Executive Officers & Security Officers) with basic information.
 * Since EMPLOYEEEFFICIENCY table might not exist, we'll provide basic data.
 */
const findAllWithPerformance = async () => {
    try {
        // First try to get employees with performance data
        const query = `
            SELECT
                e.EmployeeID AS id,
                e.Name AS name,
                e.Role AS role,
                COALESCE(SUM(ef.TrucksManaged), 0) AS totalTrucksManaged,
                COALESCE(SUM(ef.WorkingHours), 0) AS totalWorkingHours
            FROM
                EMPLOYEE e
            LEFT JOIN
                EMPLOYEEEFFICIENCY ef ON e.EmployeeID = ef.EmployeeID AND 
                MONTH(ef.Date) = MONTH(CURDATE()) AND 
                YEAR(ef.Date) = YEAR(CURDATE())
            WHERE
                e.Role IN ('Executive Officer', 'Security Officer')
            GROUP BY
                e.EmployeeID, e.Name, e.Role
            ORDER BY
                e.EmployeeID;
        `;
        const [rows] = await db.query(query);
        
        // If we got results, return them
        if (rows.length > 0) {
            return rows;
        }
        
        // If no results, fall back to basic employee data
        const fallbackQuery = `
            SELECT
                e.EmployeeID AS id,
                e.Name AS name,
                e.Role AS role,
                0 AS totalTrucksManaged,
                0 AS totalWorkingHours
            FROM
                EMPLOYEE e
            WHERE
                e.Role IN ('Executive Officer', 'Security Officer')
            ORDER BY
                e.EmployeeID;
        `;
        const [fallbackRows] = await db.query(fallbackQuery);
        return fallbackRows;
        
    } catch (error) {
        console.error('Error in findAllWithPerformance:', error);
        
        // If there's an error (like missing table), fall back to basic employee data
        const basicQuery = `
            SELECT
                e.EmployeeID AS id,
                e.Name AS name,
                e.Role AS role,
                0 AS totalTrucksManaged,
                0 AS totalWorkingHours
            FROM
                EMPLOYEE e
            WHERE
                e.Role IN ('Executive Officer', 'Security Officer')
            ORDER BY
                e.EmployeeID;
        `;
        const [basicRows] = await db.query(basicQuery);
        return basicRows;
    }
};

module.exports = {
    findAllWithPerformance
};