const db = require('../config/db');

// Utility: map full role names in EMPLOYEE to allowed roles for efficiency tracking
const TRACKABLE_ROLES = new Set(['Executive Officer', 'Security Officer', 'Inventory Officer']);

async function getUserRole(employeeId) {
  const [rows] = await db.execute('SELECT Role FROM EMPLOYEE WHERE EmployeeID = ?', [employeeId]);
  return rows[0]?.Role || null;
}

exports.ensureActiveSession = async (employeeId, role) => {
  // Ensure only trackable roles are used
  let finalRole = role;
  if (!finalRole) {
    finalRole = await getUserRole(employeeId);
  }
  if (!TRACKABLE_ROLES.has(finalRole)) {
    return null;
  }

  // Check active session
  const [existing] = await db.execute(
    `SELECT * FROM EMPLOYEE_SESSION WHERE EmployeeID = ? AND LogoutTime IS NULL ORDER BY SessionID DESC LIMIT 1`,
    [employeeId]
  );
  if (existing.length > 0) return existing[0];

  // Create new session
  const now = new Date();
  const [result] = await db.execute(
    `INSERT INTO EMPLOYEE_SESSION (EmployeeID, Role, LoginTime) VALUES (?, ?, ?)`,
    [employeeId, finalRole, now]
  );
  return { SessionID: result.insertId, EmployeeID: employeeId, Role: finalRole, LoginTime: now, LogoutTime: null };
};

exports.endActiveSession = async (employeeId) => {
  // Close only the most recent active session
  const [existing] = await db.execute(
    `SELECT * FROM EMPLOYEE_SESSION WHERE EmployeeID = ? AND LogoutTime IS NULL ORDER BY SessionID DESC LIMIT 1`,
    [employeeId]
  );
  if (existing.length === 0) return { affectedRows: 0 };
  const session = existing[0];
  const sessionId = session.SessionID;
  const now = new Date();
  // Calculate total seconds between login and now
  const [result] = await db.execute(
    `UPDATE EMPLOYEE_SESSION 
     SET LogoutTime = ?, 
         TotalWorkSeconds = TIMESTAMPDIFF(SECOND, LoginTime, ?) 
     WHERE SessionID = ?`,
    [now, now, sessionId]
  );
  return { ...result, SessionID: sessionId, LogoutTime: now };
};

exports.recordActivity = async (employeeId, type, visitId = null) => {
  // Find active session
  const [sess] = await db.execute(
    `SELECT SessionID FROM EMPLOYEE_SESSION WHERE EmployeeID = ? AND LogoutTime IS NULL ORDER BY SessionID DESC LIMIT 1`,
    [employeeId]
  );
  if (sess.length === 0) {
    throw new Error('No active session for employee');
  }
  const sessionId = sess[0].SessionID;
  const [result] = await db.execute(
    `INSERT INTO EMPLOYEE_TRUCK_ACTIVITY (SessionID, EmployeeID, VisitID, Type) VALUES (?, ?, ?, ?)`,
    [sessionId, employeeId, visitId, type]
  );
  return { insertId: result.insertId, SessionID: sessionId };
};

exports.getSummary = async (employeeId) => {
  // Try active session first
  const [active] = await db.execute(
    `SELECT * FROM EMPLOYEE_SESSION WHERE EmployeeID = ? AND LogoutTime IS NULL ORDER BY SessionID DESC LIMIT 1`,
    [employeeId]
  );
  let session = active[0];
  let isActive = true;
  if (!session) {
    // Fallback to last closed session
    const [last] = await db.execute(
      `SELECT * FROM EMPLOYEE_SESSION WHERE EmployeeID = ? AND LogoutTime IS NOT NULL ORDER BY SessionID DESC LIMIT 1`,
      [employeeId]
    );
    session = last[0];
    isActive = false;
  }
  if (!session) return { hasSession: false };

  const sessionId = session.SessionID;
  const start = new Date(session.LoginTime);
  const end = isActive ? new Date() : new Date(session.LogoutTime);
  const workSeconds = Math.max(0, Math.floor((end - start) / 1000));

  const [counts] = await db.execute(
    `SELECT 
        SUM(CASE WHEN Type = 'Loading' THEN 1 ELSE 0 END) AS loading,
        SUM(CASE WHEN Type = 'Unloading' THEN 1 ELSE 0 END) AS unloading,
        COUNT(*) AS total
     FROM EMPLOYEE_TRUCK_ACTIVITY WHERE SessionID = ?`,
    [sessionId]
  );
  const loading = counts[0]?.loading || 0;
  const unloading = counts[0]?.unloading || 0;
  const total = counts[0]?.total || 0;

  const hours = workSeconds / 3600 || 0;
  const weighted = loading + unloading * 1.1; // Slightly higher weight for unloading
  // Target baseline: 4 trucks/hour -> 100% efficiency
  const perHour = hours > 0 ? weighted / hours : 0;
  const efficiency = Math.min(200, Math.round(perHour * 25)); // cap at 200%

  return {
    hasSession: true,
    isActive,
    session: {
      id: sessionId,
      startTime: start,
      endTime: isActive ? null : end,
      workSeconds
    },
    counts: { loading, unloading, total },
    metrics: { perHour, efficiency }
  };
};

// Get summaries for all trackable employees (Executive, Security, Inventory)
exports.getAllEmployeeSummaries = async () => {
  const [emps] = await db.execute(
    `SELECT EmployeeID, Name, Role FROM EMPLOYEE 
     WHERE Role IN ('Executive Officer', 'Security Officer', 'Inventory Officer')
     ORDER BY FIELD(Role, 'Executive Officer', 'Security Officer', 'Inventory Officer'), Name`
  );
  const results = [];
  for (const emp of emps) {
    const summary = await exports.getSummary(emp.EmployeeID);
    // Normalize when no session
    const workSeconds = summary?.session?.workSeconds || 0;
    const efficiency = summary?.metrics?.efficiency ?? 0;
    results.push({
      employeeId: emp.EmployeeID,
      name: emp.Name,
      role: emp.Role,
      workSeconds,
      efficiency,
      hasSession: !!summary?.hasSession,
      counts: summary?.counts || { loading: 0, unloading: 0, total: 0 },
      isActive: !!summary?.isActive
    });
  }
  return results;
};
