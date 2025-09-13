const securityTimingModel = require('../models/securityTimingModel');

exports.createSecurityTiming = async (req, res) => {
  try {
    const result = await securityTimingModel.addSecurityTiming(req.body);
    res.status(201).json({ message: "Security timing recorded", insertId: result.insertId });
  } catch (error) {
    console.error("Error adding security timing:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getSecurityTiming = async (req, res) => {
  try {
    const visitId = req.params.visitId;
    const data = await securityTimingModel.getSecurityTimingByVisit(visitId);
    if (!data) return res.status(404).json({ message: "Not found" });
    res.json(data);
  } catch (error) {
    console.error("Error fetching security timing:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
