const efficiencyModel = require('../models/efficiencyModel');

exports.startSession = async (req, res) => {
  try {
    const user = req.session?.user;
    const employeeId = user?.id || req.body.employeeId;
    const role = user?.role || req.body.role;
    if (!employeeId) return res.status(400).json({ error: 'Employee ID is required' });
    const session = await efficiencyModel.ensureActiveSession(employeeId, role);
    if (!session) return res.status(400).json({ error: 'Role not supported for efficiency tracking' });
    res.json({ message: 'Session started/active', session });
  } catch (e) {
    console.error('startSession error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.stopSession = async (req, res) => {
  try {
    const user = req.session?.user;
    const employeeId = user?.id || req.body.employeeId;
    if (!employeeId) return res.status(400).json({ error: 'Employee ID is required' });
    const result = await efficiencyModel.endActiveSession(employeeId);
    res.json({ message: result.affectedRows ? 'Session ended' : 'No active session', result });
  } catch (e) {
    console.error('stopSession error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.recordActivity = async (req, res) => {
  try {
    const user = req.session?.user;
    const employeeId = user?.id || req.body.employeeId;
    const { type, visitId } = req.body;
    if (!employeeId || !type) return res.status(400).json({ error: 'employeeId and type are required' });
    const result = await efficiencyModel.recordActivity(employeeId, type, visitId || null);
    res.status(201).json({ message: 'Activity recorded', ...result });
  } catch (e) {
    console.error('recordActivity error:', e);
    res.status(500).json({ error: e.message || 'Internal server error' });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const user = req.session?.user;
    const employeeId = req.params.employeeId || user?.id;
    if (!employeeId) return res.status(400).json({ error: 'Employee ID is required' });
    const summary = await efficiencyModel.getSummary(employeeId);
    res.json(summary);
  } catch (e) {
    console.error('getSummary error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllSummaries = async (req, res) => {
  try {
    const list = await efficiencyModel.getAllEmployeeSummaries();
    res.json(list);
  } catch (e) {
    console.error('getAllSummaries error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
};
