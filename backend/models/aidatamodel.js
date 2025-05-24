const db = require('../server');

exports.insertVerification = (data, callback) => {
  const sql = `
    INSERT INTO COUNTERVERIFICATION 
    (ManualCount, AICount, SacksNoError, OverlapPairs, OverlapPositions, VerifTime, VisitID, IO_ID)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.ManualCount,
    data.AICount,
    data.SacksNoError,
    data.OverlapPairs,
    data.OverlapPositions,
    data.VerifTime,
    data.VisitID,
    data.IO_ID
  ];

  db.query(sql, values, callback);
};
