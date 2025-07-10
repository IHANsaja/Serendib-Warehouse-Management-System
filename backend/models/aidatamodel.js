// backend/models/aidatamodel.js
const db = require('../config/db');

const insertVerification = async ({
  ManualCount,
  AICount,
  SacksNoError,
  OverlapPairs,
  OverlapPositions,
  VisitID,
  IO_ID
}) => {
  const sql = `
    INSERT INTO COUNTERVERIFICATION
      (ManualCount, AICount, SacksNoError, OverlapPairs, OverlapPositions, VerifTime, VisitID, IO_ID)
    VALUES (?, ?, ?, ?, ?, NOW(), ?, ?)
  `;
  const [result] = await db.query(sql, [
    ManualCount,
    AICount,
    SacksNoError,
    OverlapPairs,
    OverlapPositions,
    VisitID,
    IO_ID
  ]);
  return result;
};

const getAllVerifications = async () => {
  const sql = `
    SELECT VerifID, ManualCount, AICount, SacksNoError, OverlapPairs,
           OverlapPositions, DATE_FORMAT(VerifTime, '%Y/%m/%d') AS VerifDate,
           VisitID, IO_ID
    FROM COUNTERVERIFICATION
    ORDER BY VerifTime DESC
  `;
  const [rows] = await db.query(sql);
  return rows;
};

module.exports = { insertVerification, getAllVerifications };
