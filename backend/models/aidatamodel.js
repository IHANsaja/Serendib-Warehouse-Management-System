// File: src/models/aidatamodel.js
const db = require('../config/db');

const insertVerification = ({ ManualCount, AICount, SacksNoError, OverlapPairs, OverlapPositions, VisitID, IO_ID }) => {
  const sql = `
    INSERT INTO COUNTERVERIFICATION
      (ManualCount, AICount, SacksNoError, OverlapPairs, OverlapPositions, VerifTime, VisitID, IO_ID)
    VALUES
      (?, ?, ?, ?, ?, NOW(), ?, ?)
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, [ManualCount, AICount, SacksNoError, OverlapPairs, OverlapPositions, VisitID, IO_ID], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const getAllVerifications = () => {
  const sql = `
    SELECT VerifID, ManualCount, AICount, SacksNoError, OverlapPairs,
           OverlapPositions, DATE_FORMAT(VerifTime, '%Y/%m/%d') AS VerifDate,
           VisitID, IO_ID
    FROM COUNTERVERIFICATION
    ORDER BY VerifTime DESC
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

module.exports = { insertVerification, getAllVerifications };
