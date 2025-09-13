// backend/models/aidatamodel.js
const db = require('../config/db');

// Ensure table exists (avoids runtime 500s if DB wasn't initialized with SQL script)
const ensureTable = async () => {
  const createSql = `
    CREATE TABLE IF NOT EXISTS COUNTERVERIFICATION (
      VerifID INT PRIMARY KEY AUTO_INCREMENT,
      ManualCount INT NOT NULL,
      AICount INT NOT NULL,
      SacksNoError INT NOT NULL,
      OverlapPairs INT NOT NULL,
      OverlapPositions TEXT,
      VerifTime DATETIME DEFAULT CURRENT_TIMESTAMP,
      VisitID INT,
      IO_ID INT
    )
  `;
  await db.query(createSql);
};

const insertVerification = async ({
  ManualCount,
  AICount,
  SacksNoError,
  OverlapPairs,
  OverlapPositions,
  VisitID,
  IO_ID
}) => {
  await ensureTable();
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
  await ensureTable();
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
