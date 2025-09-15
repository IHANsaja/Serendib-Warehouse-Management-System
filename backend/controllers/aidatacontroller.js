// backend/controllers/aidatacontroller.js
const { insertVerification, getAllVerifications, getCurrentVisitId } = require('../models/aidatamodel');

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

const fetchCurrentVisit = async (req, res) => {
  try {
    const visitId = await getCurrentVisitId();
    if (visitId) {
      return res.json({ visitId, message: 'Truck is on the bay' });
    }
    return res.json({ visitId: null, message: 'Truck visit ID is not available because no truck is on the bay (test run).' });
  } catch (err) {
    console.error('Error in fetchCurrentVisit:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { verifyCount, fetchVerifications, fetchCurrentVisit };
