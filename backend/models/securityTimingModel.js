const db = require('../config/db');

exports.addSecurityTiming = async (data) => {
  const { visitId, seId, estimatedArrival, actualArrival, estimatedLeave, actualLeave } = data;
  const [result] = await db.execute(
    `INSERT INTO SECURITYTIMING 
     (VisitID, SE_ID, EstimatedArrival, ActualArrival, EstimatedLeave, ActualLeave) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [visitId, seId, estimatedArrival, actualArrival, estimatedLeave, actualLeave]
  );
  return result;
};

exports.getSecurityTimingByVisit = async (visitId) => {
  const [rows] = await db.execute(`SELECT * FROM SECURITYTIMING WHERE VisitID = ?`, [visitId]);
  return rows[0];
};
