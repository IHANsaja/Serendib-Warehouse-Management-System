const db = require('../config/db');

/**
 * Get all employees with their efficiency metrics (excludes Administrator)
 */
const getAllEmployeesWithEfficiency = async () => {
    try {
        const query = `
            SELECT 
                e.EmployeeID,
                e.Name,
                e.Role,
                e.Email,
                e.ContactInfo,
                COALESCE(SUM(ewh.TotalWorkHours), 0) as totalWorkHours,
                COALESCE(SUM(ewh.TotalSessions), 0) as totalSessions,
                COALESCE(COUNT(DISTINCT etm.VisitID), 0) as totalTrucksManaged,
                COALESCE(COUNT(DISTINCT CASE WHEN etm.OperationType = 'Loading' THEN etm.VisitID END), 0) as loadings,
                COALESCE(COUNT(DISTINCT CASE WHEN etm.OperationType = 'Unloading' THEN etm.VisitID END), 0) as unloadings
            FROM EMPLOYEE e
            LEFT JOIN EMPLOYEE_WORK_HOURS ewh ON e.EmployeeID = ewh.EmployeeID
            LEFT JOIN EMPLOYEE_TRUCK_MANAGEMENT etm ON e.EmployeeID = etm.EmployeeID
            WHERE e.Role IN ('Executive Officer', 'Security Officer', 'Inventory Officer')
            GROUP BY e.EmployeeID, e.Name, e.Role, e.Email, e.ContactInfo
            ORDER BY e.EmployeeID
        `;
        
        const [rows] = await db.query(query);
        return rows;
    } catch (error) {
        console.error('Error in getAllEmployeesWithEfficiency:', error);
        throw error;
    }
};

/**
 * Get all users including Administrator (for authentication purposes)
 */
const getAllUsers = async () => {
    try {
        const query = `
            SELECT 
                EmployeeID,
                Name,
                Role,
                Email,
                ContactInfo
            FROM EMPLOYEE
            ORDER BY EmployeeID
        `;
        
        const [rows] = await db.query(query);
        return rows;
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        throw error;
    }
};

/**
 * Get employee efficiency for a specific date range
 */
const getEmployeeEfficiencyByDateRange = async (employeeID, startDate, endDate) => {
    try {
        const query = `
            SELECT 
                e.EmployeeID,
                e.Name,
                e.Role,
                ewh.Date,
                ewh.TotalWorkHours,
                ewh.TotalSessions,
                COUNT(DISTINCT etm.VisitID) as trucksManaged,
                COUNT(DISTINCT CASE WHEN etm.OperationType = 'Loading' THEN etm.VisitID END) as loadings,
                COUNT(DISTINCT CASE WHEN etm.OperationType = 'Unloading' THEN etm.VisitID END) as unloadings
            FROM EMPLOYEE e
            LEFT JOIN EMPLOYEE_WORK_HOURS ewh ON e.EmployeeID = ewh.EmployeeID 
                AND ewh.Date BETWEEN ? AND ?
            LEFT JOIN EMPLOYEE_TRUCK_MANAGEMENT etm ON e.EmployeeID = etm.EmployeeID
                AND DATE(etm.SessionStartTime) BETWEEN ? AND ?
            WHERE e.EmployeeID = ?
            GROUP BY e.EmployeeID, e.Name, e.Role, ewh.Date, ewh.TotalWorkHours, ewh.TotalSessions
            ORDER BY ewh.Date DESC
        `;
        
        const [rows] = await db.query(query, [startDate, endDate, startDate, endDate, employeeID]);
        return rows;
    } catch (error) {
        console.error('Error in getEmployeeEfficiencyByDateRange:', error);
        throw error;
    }
};

/**
 * Get current month efficiency for all employees
 */
const getCurrentMonthEfficiency = async () => {
    try {
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        const startDate = startOfMonth.toISOString().split('T')[0];
        const endDate = endOfMonth.toISOString().split('T')[0];
        
        const query = `
            SELECT 
                e.EmployeeID,
                e.Name,
                e.Role,
                COALESCE(SUM(ewh.TotalWorkHours), 0) as monthlyWorkHours,
                COALESCE(SUM(ewh.TotalSessions), 0) as monthlySessions,
                COALESCE(COUNT(DISTINCT etm.VisitID), 0) as monthlyTrucksManaged,
                COALESCE(COUNT(DISTINCT CASE WHEN etm.OperationType = 'Loading' THEN etm.VisitID END), 0) as monthlyLoadings,
                COALESCE(COUNT(DISTINCT CASE WHEN etm.OperationType = 'Unloading' THEN etm.VisitID END), 0) as monthlyUnloadings
            FROM EMPLOYEE e
            LEFT JOIN EMPLOYEE_WORK_HOURS ewh ON e.EmployeeID = ewh.EmployeeID 
                AND ewh.Date BETWEEN ? AND ?
            LEFT JOIN EMPLOYEE_TRUCK_MANAGEMENT etm ON e.EmployeeID = etm.EmployeeID
                AND DATE(etm.SessionStartTime) BETWEEN ? AND ?
            WHERE e.Role IN ('Executive Officer', 'Security Officer', 'Inventory Officer') -- Excludes Administrator
            GROUP BY e.EmployeeID, e.Name, e.Role
            ORDER BY monthlyTrucksManaged DESC, monthlyWorkHours DESC
        `;
        
        const [rows] = await db.query(query, [startDate, endDate, startDate, endDate]);
        return rows;
    } catch (error) {
        console.error('Error in getCurrentMonthEfficiency:', error);
        throw error;
    }
};

/**
 * Get employee login sessions for a specific date
 */
const getEmployeeSessionsByDate = async (employeeID, date) => {
    try {
        const query = `
            SELECT 
                SessionID,
                LoginTime,
                LogoutTime,
                DurationSeconds,
                ROUND(DurationSeconds / 3600, 2) as DurationHours
            FROM EMPLOYEE_LOGIN_SESSION
            WHERE EmployeeID = ? AND DATE(LoginTime) = ?
            ORDER BY LoginTime DESC
        `;
        
        const [rows] = await db.query(query, [employeeID, date]);
        return rows;
    } catch (error) {
        console.error('Error in getEmployeeSessionsByDate:', error);
        throw error;
    }
};

/**
 * Get trucks managed by employee during a specific session
 */
const getTrucksManagedBySession = async (sessionID) => {
    try {
        const query = `
            SELECT 
                etm.VisitID,
                etm.TruckNumber,
                etm.DriverName,
                etm.OperationType,
                etm.SessionStartTime,
                etm.SessionEndTime,
                tv.Status as TruckStatus,
                c.Name as CompanyName
            FROM EMPLOYEE_TRUCK_MANAGEMENT etm
            JOIN TRUCKVISIT tv ON etm.VisitID = tv.VisitID
            JOIN COMPANY c ON tv.CompanyID = c.CompanyID
            WHERE etm.SessionID = ?
            ORDER BY etm.SessionStartTime DESC
        `;
        
        const [rows] = await db.query(query, [sessionID]);
        return rows;
    } catch (error) {
        console.error('Error in getTrucksManagedBySession:', error);
        throw error;
    }
};

/**
 * Add truck management record for an employee session
 */
const addTruckManagementRecord = async (truckData) => {
    try {
        const query = `
            INSERT INTO EMPLOYEE_TRUCK_MANAGEMENT 
            (SessionID, EmployeeID, VisitID, TruckNumber, DriverName, OperationType, SessionStartTime, SessionEndTime)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const [result] = await db.query(query, [
            truckData.SessionID,
            truckData.EmployeeID,
            truckData.VisitID,
            truckData.TruckNumber,
            truckData.DriverName,
            truckData.OperationType,
            truckData.SessionStartTime,
            truckData.SessionEndTime
        ]);
        
        return result;
    } catch (error) {
        console.error('Error in addTruckManagementRecord:', error);
        throw error;
    }
};

module.exports = {
    getAllEmployeesWithEfficiency,
    getAllUsers,
    getEmployeeEfficiencyByDateRange,
    getCurrentMonthEfficiency,
    getEmployeeSessionsByDate,
    getTrucksManagedBySession,
    addTruckManagementRecord
};