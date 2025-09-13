// backend/models/authModel.js
const db = require('../config/db');

const findUserByNameAndRole = async (name, role) => {
  const [rows] = await db.query(
    'SELECT * FROM EMPLOYEE WHERE Name = ? AND Role = ?',
    [name, role]
  );
  return rows;
};

const createLoginSession = async (sessionData) => {
  const [result] = await db.query(
    'INSERT INTO EMPLOYEE_LOGIN_SESSION (EmployeeID, LoginTime) VALUES (?, ?)',
    [sessionData.EmployeeID, sessionData.LoginTime]
  );
  return result;
};

const updateLogoutSession = async (sessionID) => {
  const [result] = await db.query(
    `UPDATE EMPLOYEE_LOGIN_SESSION 
     SET LogoutTime = NOW(), 
         DurationSeconds = TIMESTAMPDIFF(SECOND, LoginTime, NOW())
     WHERE SessionID = ?`,
    [sessionID]
  );
  return result;
};

const updateEmployeeWorkHours = async (employeeID, sessionID) => {
  try {
    // Get the session details
    const [sessionRows] = await db.query(
      'SELECT LoginTime, LogoutTime, DurationSeconds FROM EMPLOYEE_LOGIN_SESSION WHERE SessionID = ?',
      [sessionID]
    );

    if (sessionRows.length === 0) return;

    const session = sessionRows[0];
    const workHours = session.DurationSeconds / 3600; // Convert seconds to hours
    const sessionDate = new Date(session.LoginTime).toISOString().split('T')[0]; // Get date part only

    // Check if work hours record exists for today
    const [existingRows] = await db.query(
      'SELECT RecordID FROM EMPLOYEE_WORK_HOURS WHERE EmployeeID = ? AND Date = ?',
      [employeeID, sessionDate]
    );

    if (existingRows.length > 0) {
      // Update existing record
      await db.query(
        `UPDATE EMPLOYEE_WORK_HOURS 
         SET TotalWorkHours = TotalWorkHours + ?, 
             TotalSessions = TotalSessions + 1
         WHERE EmployeeID = ? AND Date = ?`,
        [workHours, employeeID, sessionDate]
      );
    } else {
      // Create new record
      await db.query(
        `INSERT INTO EMPLOYEE_WORK_HOURS (EmployeeID, Date, TotalWorkHours, TotalSessions)
         VALUES (?, ?, ?, 1)`,
        [employeeID, sessionDate, workHours]
      );
    }
  } catch (error) {
    console.error('Error updating work hours:', error);
    throw error;
  }
};

module.exports = {
  findUserByNameAndRole,
  createLoginSession,
  updateLogoutSession,
  updateEmployeeWorkHours
};
