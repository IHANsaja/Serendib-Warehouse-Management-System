const express = require("express");
const router = express.Router();
const db = require("../config/db"); // adjust path to your DB connection file

// GET /api/visits-bays
router.get("/visits-bays", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT v.VisitID, b.BayID
      FROM TRUCKVISIT v
      JOIN BAYOPERATION b ON v.VisitID = b.VisitID
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching visit/bay list:", error);
    res.status(500).json({ error: "Failed to fetch visit/bay data" });
  }
});

module.exports = router;
