const TruckModel = require('../models/TruckModel');

const getLoadingTrucks = async (req, res) => {
    try {
        const { date } = req.query; // ✅ Get optional date from query parameters
        const trucks = await TruckModel.getTruckVisitsByType('Loading', date);
        res.json(trucks);
    } catch (err) {
        console.error("Error fetching loading trucks:", err);
        res.status(500).json({ message: "Server error" });
    }
};

const getUnloadingTrucks = async (req, res) => {
    try {
        const { date } = req.query; // ✅ Get optional date from query parameters
        const trucks = await TruckModel.getTruckVisitsByType('Unloading', date);
        res.json(trucks);
    } catch (err) {
        console.error("Error fetching unloading trucks:", err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getLoadingTrucks,
    getUnloadingTrucks
};