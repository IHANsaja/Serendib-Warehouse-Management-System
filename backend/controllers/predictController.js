// controllers/predictController.js
const axios = require("axios");

const PY_SERVICE_URL = process.env.PY_SERVICE_URL || "http://localhost:8000";

// 🔮 Prediction controller
exports.predictIncome = async (req, res) => {
  try {
    const { incomes, n_steps = 1 } = req.body;

    if (!Array.isArray(incomes) || incomes.length === 0) {
      return res.status(400).json({ error: "Incomes must be a non-empty array" });
    }

    const { data } = await axios.post(`${PY_SERVICE_URL}/predict`, { incomes, n_steps });

    return res.json(data);
  } catch (error) {
    console.error("Prediction Error:", error.message);
    return res.status(500).json({ error: "Prediction failed" });
  }
};
