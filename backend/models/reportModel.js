// models/reportModel.js
const db = require('../config/db');

async function getReportDataByVisit(visitId) {
  const [rows] = await db.query(`
    SELECT
      tv.VisitID,
      tv.VehicleNumber,
      tv.DriverName,
      tv.EstimatedArrivalTime,
      tv.ActualArrivalTime,
      tv.EstimatedLeaveTime,
      tv.ActualLeaveTime,
      tv.Type,
      tv.Quantity,
      tv.Status,
      tv.CompanyID,
      c.Name AS CompanyName,
      o.OrderID,
      o.ItemCode,
      o.Item,
      o.OrderDate,
      o.EstimatedBayInTime,
      o.EstimatedBayOutTime,
      bo.BayID,
      bo.EstimatedBayInTime AS BayOpEstimatedBayInTime,
      bo.EstimatedBayOutTime AS BayOpEstimatedBayOutTime,
      bo.ActualBayInTime,
      bo.ActualBayOutTime,
      bo.Status AS BayStatus,
      b.BayNumber,
      b.LocationDescription,
      e1.Name AS SecurityOfficerName,
      e2.Name AS ExecutiveOfficerName,
      se.EmployeeID AS SecurityOfficerID,
      eo.EmployeeID AS ExecutiveOfficerID

    FROM TRUCKVISIT tv
    LEFT JOIN COMPANY c ON c.CompanyID = tv.CompanyID
    LEFT JOIN \`ORDER\` o ON o.OrderID = tv.OrderID
    LEFT JOIN BAYOPERATION bo ON bo.VisitID = tv.VisitID
    LEFT JOIN BAY b ON b.BayID = bo.BayID
    LEFT JOIN EMPLOYEE e1 ON e1.EmployeeID = tv.SE_ID
    LEFT JOIN EMPLOYEE e2 ON e2.EmployeeID = tv.EO_ID
    LEFT JOIN EMPLOYEE se ON se.EmployeeID = tv.SE_ID
    LEFT JOIN EMPLOYEE eo ON eo.EmployeeID = tv.EO_ID
    WHERE tv.VisitID = ?
  `, [visitId]);

  return rows[0] || null;
}

async function getVisitList() {
  const [rows] = await db.query(`
    SELECT 
      tv.VisitID, 
      tv.VehicleNumber,
      tv.DriverName,
      c.Name AS CompanyName,
      o.Item,
      tv.Type,
      tv.Status,
      tv.EstimatedArrivalTime,
      tv.ActualArrivalTime,
      bo.ActualBayInTime,
      bo.ActualBayOutTime,
      tv.ActualLeaveTime
    FROM TRUCKVISIT tv
    LEFT JOIN COMPANY c ON c.CompanyID = tv.CompanyID
    LEFT JOIN \`ORDER\` o ON o.OrderID = tv.OrderID
    LEFT JOIN BAYOPERATION bo ON bo.VisitID = tv.VisitID
    ORDER BY tv.VisitID DESC
  `);
  return rows;
}

async function getDelaySummaryReport(startDate, endDate) {
  const [rows] = await db.query(`
    SELECT
      COUNT(*) as totalVisits,
      COUNT(CASE WHEN tv.ActualArrivalTime > tv.EstimatedArrivalTime THEN 1 END) as arrivalDelays,
      COUNT(CASE WHEN bo.ActualBayInTime > o.EstimatedBayInTime THEN 1 END) as bayInDelays,
      COUNT(CASE WHEN bo.ActualBayOutTime > o.EstimatedBayOutTime THEN 1 END) as bayOutDelays,
      COUNT(CASE WHEN tv.ActualLeaveTime > tv.EstimatedLeaveTime THEN 1 END) as exitDelays,
      AVG(CASE WHEN tv.ActualArrivalTime > tv.EstimatedArrivalTime 
        THEN TIMESTAMPDIFF(MINUTE, tv.EstimatedArrivalTime, tv.ActualArrivalTime) END) as avgArrivalDelay,
      AVG(CASE WHEN bo.ActualBayInTime > o.EstimatedBayInTime 
        THEN TIMESTAMPDIFF(MINUTE, o.EstimatedBayInTime, bo.ActualBayInTime) END) as avgBayInDelay,
      AVG(CASE WHEN bo.ActualBayOutTime > o.EstimatedBayOutTime 
        THEN TIMESTAMPDIFF(MINUTE, o.EstimatedBayOutTime, bo.ActualBayOutTime) END) as avgBayOutDelay,
      AVG(CASE WHEN tv.ActualLeaveTime > tv.EstimatedLeaveTime 
        THEN TIMESTAMPDIFF(MINUTE, tv.EstimatedLeaveTime, tv.ActualLeaveTime) END) as avgExitDelay,
      AVG(TIMESTAMPDIFF(MINUTE, tv.ActualArrivalTime, tv.ActualLeaveTime)) as avgTotalTime
    FROM TRUCKVISIT tv
    LEFT JOIN \`ORDER\` o ON o.OrderID = tv.OrderID
    LEFT JOIN BAYOPERATION bo ON bo.VisitID = tv.VisitID
    WHERE DATE(tv.EstimatedArrivalTime) BETWEEN ? AND ?
      AND tv.ActualArrivalTime IS NOT NULL
  `, [startDate, endDate]);

  return rows[0] || null;
}

async function getCompanyDelayReport(startDate, endDate) {
  const [rows] = await db.query(`
    SELECT
      c.Name AS CompanyName,
      COUNT(*) as totalVisits,
      COUNT(CASE WHEN tv.ActualArrivalTime > tv.EstimatedArrivalTime THEN 1 END) as arrivalDelays,
      COUNT(CASE WHEN bo.ActualBayInTime > o.EstimatedBayInTime THEN 1 END) as bayInDelays,
      COUNT(CASE WHEN bo.ActualBayOutTime > o.EstimatedBayOutTime THEN 1 END) as bayOutDelays,
      COUNT(CASE WHEN tv.ActualLeaveTime > tv.EstimatedLeaveTime THEN 1 END) as exitDelays,
      AVG(CASE WHEN tv.ActualArrivalTime > tv.EstimatedArrivalTime 
        THEN TIMESTAMPDIFF(MINUTE, tv.EstimatedArrivalTime, tv.ActualArrivalTime) END) as avgArrivalDelay,
      AVG(CASE WHEN bo.ActualBayInTime > o.EstimatedBayInTime 
        THEN TIMESTAMPDIFF(MINUTE, o.EstimatedBayInTime, bo.ActualBayInTime) END) as avgBayInDelay,
      AVG(CASE WHEN bo.ActualBayOutTime > o.EstimatedBayOutTime 
        THEN TIMESTAMPDIFF(MINUTE, o.EstimatedBayOutTime, bo.ActualBayOutTime) END) as avgBayOutDelay,
      AVG(CASE WHEN tv.ActualLeaveTime > tv.EstimatedLeaveTime 
        THEN TIMESTAMPDIFF(MINUTE, tv.EstimatedLeaveTime, tv.ActualLeaveTime) END) as avgExitDelay
    FROM TRUCKVISIT tv
    LEFT JOIN COMPANY c ON c.CompanyID = tv.CompanyID
    LEFT JOIN \`ORDER\` o ON o.OrderID = tv.OrderID
    LEFT JOIN BAYOPERATION bo ON bo.VisitID = tv.VisitID
    WHERE DATE(tv.EstimatedArrivalTime) BETWEEN ? AND ?
      AND tv.ActualArrivalTime IS NOT NULL
    GROUP BY c.CompanyID, c.Name
    ORDER BY totalVisits DESC
  `, [startDate, endDate]);

  return rows;
}

async function getBayPerformanceReport(startDate, endDate) {
  const [rows] = await db.query(`
    SELECT
      b.BayNumber,
      b.LocationDescription,
      b.Type,
      COUNT(bo.BayOpID) as totalOperations,
      AVG(TIMESTAMPDIFF(MINUTE, bo.ActualBayInTime, bo.ActualBayOutTime)) as avgOperationTime,
      COUNT(CASE WHEN bo.ActualBayInTime > o.EstimatedBayInTime THEN 1 END) as bayInDelays,
      COUNT(CASE WHEN bo.ActualBayOutTime > o.EstimatedBayOutTime THEN 1 END) as bayOutDelays,
      AVG(CASE WHEN bo.ActualBayInTime > o.EstimatedBayInTime 
        THEN TIMESTAMPDIFF(MINUTE, o.EstimatedBayInTime, bo.ActualBayInTime) END) as avgBayInDelay,
      AVG(CASE WHEN bo.ActualBayOutTime > o.EstimatedBayOutTime 
        THEN TIMESTAMPDIFF(MINUTE, o.EstimatedBayOutTime, bo.ActualBayOutTime) END) as avgBayOutDelay
    FROM BAY b
    LEFT JOIN BAYOPERATION bo ON b.BayID = bo.BayID
    LEFT JOIN TRUCKVISIT tv ON bo.VisitID = tv.VisitID
    LEFT JOIN \`ORDER\` o ON tv.OrderID = o.OrderID
    WHERE DATE(tv.EstimatedArrivalTime) BETWEEN ? AND ?
      AND bo.ActualBayInTime IS NOT NULL
      AND bo.ActualBayOutTime IS NOT NULL
    GROUP BY b.BayID, b.BayNumber, b.LocationDescription, b.Type
    ORDER BY totalOperations DESC
  `, [startDate, endDate]);

  return rows;
}

async function getEmployeePerformanceReport(startDate, endDate) {
  const [rows] = await db.query(`
    SELECT
      e.Name AS EmployeeName,
      e.Role,
      COUNT(DISTINCT tv.VisitID) as totalVisitsHandled,
      COUNT(CASE WHEN tv.ActualArrivalTime > tv.EstimatedArrivalTime THEN 1 END) as arrivalDelays,
      COUNT(CASE WHEN bo.ActualBayInTime > o.EstimatedBayInTime THEN 1 END) as bayInDelays,
      COUNT(CASE WHEN bo.ActualBayOutTime > o.EstimatedBayOutTime THEN 1 END) as bayOutDelays,
      COUNT(CASE WHEN tv.ActualLeaveTime > tv.EstimatedLeaveTime THEN 1 END) as exitDelays,
      AVG(CASE WHEN tv.ActualArrivalTime > tv.EstimatedArrivalTime 
        THEN TIMESTAMPDIFF(MINUTE, tv.EstimatedArrivalTime, tv.ActualArrivalTime) END) as avgArrivalDelay,
      AVG(CASE WHEN bo.ActualBayInTime > o.EstimatedBayInTime 
        THEN TIMESTAMPDIFF(MINUTE, o.EstimatedBayInTime, bo.ActualBayInTime) END) as avgBayInDelay,
      AVG(CASE WHEN bo.ActualBayOutTime > o.EstimatedBayOutTime 
        THEN TIMESTAMPDIFF(MINUTE, o.EstimatedBayOutTime, bo.ActualBayOutTime) END) as avgBayOutDelay,
      AVG(CASE WHEN tv.ActualLeaveTime > tv.EstimatedLeaveTime 
        THEN TIMESTAMPDIFF(MINUTE, tv.EstimatedLeaveTime, tv.ActualLeaveTime) END) as avgExitDelay
    FROM EMPLOYEE e
    LEFT JOIN TRUCKVISIT tv ON (e.EmployeeID = tv.SE_ID OR e.EmployeeID = tv.EO_ID)
    LEFT JOIN \`ORDER\` o ON tv.OrderID = o.OrderID
    LEFT JOIN BAYOPERATION bo ON bo.VisitID = tv.VisitID
    WHERE DATE(tv.EstimatedArrivalTime) BETWEEN ? AND ?
      AND tv.ActualArrivalTime IS NOT NULL
      AND e.Role IN ('Security Officer', 'Executive Officer')
    GROUP BY e.EmployeeID, e.Name, e.Role
    ORDER BY totalVisitsHandled DESC
  `, [startDate, endDate]);

  return rows;
}

module.exports = { 
  getReportDataByVisit, 
  getVisitList, 
  getDelaySummaryReport,
  getCompanyDelayReport,
  getBayPerformanceReport,
  getEmployeePerformanceReport
};
