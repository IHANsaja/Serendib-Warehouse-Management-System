const bayModel = require('../models/bayModel');
const db = require('../config/db');

// Get all available bays by type
exports.getAvailableBays = async (req, res) => {
  try {
    const { type } = req.query;
    
    if (!type) {
      return res.status(400).json({ error: "Bay type is required (Loading or Unloading)" });
    }

    const bays = await bayModel.getAvailableBays(type);
    res.json(bays);
  } catch (error) {
    console.error("Error fetching available bays:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all truck visits for security officer
exports.getTruckVisitsForSecurity = async (req, res) => {
  try {
    const truckVisits = await bayModel.getPendingTruckVisits();
    res.json(truckVisits);
  } catch (error) {
    console.error("Error fetching truck visits for security:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all truck visits for executive officer
exports.getTruckVisitsForExecutive = async (req, res) => {
  try {
    const truckVisits = await bayModel.getTruckVisitsForExecutive();
    res.json(truckVisits);
  } catch (error) {
    console.error("Error fetching truck visits for executive:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update truck arrival time (Security Officer)
exports.updateTruckArrival = async (req, res) => {
  try {
    const { visitId } = req.params;
    const { actualArrivalTime, seId } = req.body;
    
    if (!actualArrivalTime || !seId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await bayModel.updateTruckArrival(visitId, actualArrivalTime, seId);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Truck visit not found" });
    }
    
    res.json({ message: "Truck arrival time updated successfully" });
  } catch (error) {
    console.error("Error updating truck arrival:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update truck leave time (Security Officer)
exports.updateTruckLeave = async (req, res) => {
  try {
    const { visitId } = req.params;
    const { actualLeaveTime, seId } = req.body;
    
    if (!actualLeaveTime || !seId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await bayModel.updateTruckLeave(visitId, actualLeaveTime, seId);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Truck visit not found" });
    }
    
    res.json({ message: "Truck leave time updated successfully" });
  } catch (error) {
    console.error("Error updating truck leave:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update bay-in time (Executive Officer)
exports.updateBayInTime = async (req, res) => {
  try {
    const { visitId } = req.params;
    const { actualBayInTime, eoId } = req.body;
    
    if (!actualBayInTime || !eoId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await bayModel.updateBayInTime(visitId, actualBayInTime, eoId);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Bay operation not found" });
    }
    
    res.json({ message: "Bay-in time updated successfully" });
  } catch (error) {
    console.error("Error updating bay-in time:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update bay-out time (Executive Officer)
exports.updateBayOutTime = async (req, res) => {
  try {
    const { visitId } = req.params;
    const { actualBayOutTime, eoId } = req.body;
    
    if (!actualBayOutTime || !eoId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await bayModel.updateBayOutTime(visitId, actualBayOutTime, eoId);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Bay operation not found" });
    }
    
    res.json({ message: "Bay-out time updated successfully" });
  } catch (error) {
    console.error("Error updating bay-out time:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Assign bay to truck visit
exports.assignBayToVisit = async (req, res) => {
  try {
    const { visitId } = req.params;
    const { bayId, eoId } = req.body;
    
    console.log('Assign bay request:', { visitId, bayId, eoId });
    
    if (!bayId || !eoId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await bayModel.assignBayToVisit(visitId, bayId, eoId);
    
    console.log('Assign bay result:', result);
    
    res.json({ message: "Bay assigned successfully" });
  } catch (error) {
    console.error("Error assigning bay:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// Get current Sri Lanka time (GMT +5:30)
exports.getSriLankaTime = async (req, res) => {
  try {
    // Create date in Sri Lanka timezone
    const now = new Date();
    const sriLankaTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
    
    res.json({ 
      currentTime: sriLankaTime.toISOString().slice(0, 19).replace('T', ' '),
      timezone: 'GMT +5:30 (Sri Lanka)'
    });
  } catch (error) {
    console.error("Error getting Sri Lanka time:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Check if all bays of a specific type are occupied
exports.checkBayAvailability = async (req, res) => {
  try {
    const { type } = req.params;
    
    if (!type || !['Loading', 'Unloading'].includes(type)) {
      return res.status(400).json({ error: "Invalid bay type. Must be 'Loading' or 'Unloading'" });
    }

    const availability = await bayModel.checkAllBaysOccupied(type);
    res.json(availability);
  } catch (error) {
    console.error("Error checking bay availability:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get bay availability status for all bay types
exports.getBayAvailabilityStatus = async (req, res) => {
  try {
    const availability = await bayModel.getBayAvailabilityStatus();
    res.json(availability);
  } catch (error) {
    console.error("Error getting bay availability status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
