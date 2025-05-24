const AIdataModel = require('../models/aidatamodel');

exports.saveAICount = (req, res) => {
  const {
    ManualCount,
    AICount,
    SacksNoError,
    OverlapPairs,
    OverlapPositions,
    VisitID,
    IO_ID
  } = req.body;

  const VerifTime = new Date();

  AIdataModel.insertVerification({
    ManualCount,
    AICount,
    SacksNoError,
    OverlapPairs,
    OverlapPositions,
    VerifTime,
    VisitID,
    IO_ID
  }, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ success: true, VerifID: result.insertId });
  });
};
