const currentProcessModel = require('../models/currentProcessModel');

// Get current process status for all bays
exports.getCurrentProcessStatus = async (req, res) => {
  try {
    const processStatus = await currentProcessModel.getCurrentProcessStatus();
    res.json(processStatus);
  } catch (error) {
    console.error("Error fetching current process status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get current process status for specific bay type
exports.getCurrentProcessStatusByType = async (req, res) => {
  try {
    const { type } = req.params;
    
    if (!type || !['loading', 'unloading'].includes(type)) {
      return res.status(400).json({ error: "Invalid bay type. Must be 'loading' or 'unloading'" });
    }

    const processStatus = await currentProcessModel.getCurrentProcessStatusByType(type);
    res.json(processStatus);
  } catch (error) {
    console.error("Error fetching current process status by type:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get current process summary (for dashboard)
exports.getCurrentProcessSummary = async (req, res) => {
  try {
    const processStatus = await currentProcessModel.getCurrentProcessStatus();
    
    // Create summary for dashboard
    const summary = {
      ongoing: {
        loading: processStatus.ongoing.filter(op => op.OperationType === 'Loading').length,
        unloading: processStatus.ongoing.filter(op => op.OperationType === 'Unloading').length
      },
      completed: {
        loading: processStatus.completed.filter(op => op.OperationType === 'Loading').length,
        unloading: processStatus.completed.filter(op => op.OperationType === 'Unloading').length
      },
      pending: processStatus.pendingCounts
    };
    
    res.json(summary);
  } catch (error) {
    console.error("Error fetching current process summary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get real-time process updates
exports.getProcessUpdates = async (req, res) => {
  try {
    const updates = await currentProcessModel.getProcessUpdates();
    res.json(updates);
  } catch (error) {
    console.error("Error fetching process updates:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get current process status with bay availability
exports.getCurrentProcessStatusWithAvailability = async (req, res) => {
  try {
    const processStatus = await currentProcessModel.getCurrentProcessStatusWithAvailability();
    res.json(processStatus);
  } catch (error) {
    console.error("Error fetching current process status with availability:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
