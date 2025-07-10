// backend/controllers/aidatacontroller.js
const { insertVerification, getAllVerifications } = require('../models/aidatamodel');

const verifyCount = async (req, res) => {
  try {
    const result = await insertVerification(req.body);
    res.status(201).json({ message: 'Verification saved', insertId: result.insertId });
  } catch (err) {
    console.error('Error in verifyCount:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const fetchVerifications = async (req, res) => {
  try {
    const data = await getAllVerifications();
    res.json(data);
  } catch (err) {
    console.error('Error in fetchVerifications:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { verifyCount, fetchVerifications };
