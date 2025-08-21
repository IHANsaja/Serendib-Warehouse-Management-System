// src/components/BayManagement.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function BayManagement() {
  const [visitBayList, setVisitBayList] = useState([]);
  const [selectedVisitId, setSelectedVisitId] = useState("");
  const [selectedBayId, setSelectedBayId] = useState("");

  // Fetch visit & bay list on load
  useEffect(() => {
    fetch("http://localhost:5000/api/visits-bays")
      .then((res) => res.json())
      .then((data) => setVisitBayList(data))
      .catch((err) => console.error("Error fetching visit/bay data:", err));
  }, []);

  const handleCheckIn = () => {
    if (!selectedVisitId || !selectedBayId) {
      toast.warning("Please select VisitID and BayID first");
      return;
    }

    fetch("http://localhost:5000/api/bay/check-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitId: selectedVisitId,
        bayId: selectedBayId,
        time: new Date().toISOString()
      })
    })
      .then((res) => res.json())
      .then((data) => console.log("Check-in success:", data))
      .catch((err) => console.error("Check-in error:", err));
  };

  return (
    <div className="p-4 border rounded bg-white shadow">
      <h2 className="text-lg font-semibold mb-4">Bay Management</h2>

      {/* Visit ID Dropdown */}
      <label className="block mb-2 font-medium">Select Visit ID:</label>
      <select
        className="border p-2 rounded w-full mb-4"
        value={selectedVisitId}
        onChange={(e) => {
          setSelectedVisitId(e.target.value);
          const bay = visitBayList.find(v => v.VisitID == e.target.value);
          setSelectedBayId(bay ? bay.BayID : "");
        }}
      >
        <option value="">-- Select Visit --</option>
        {visitBayList.map((item) => (
          <option key={item.VisitID} value={item.VisitID}>
            Visit {item.VisitID}
          </option>
        ))}
      </select>

      {/* Bay ID Dropdown */}
      <label className="block mb-2 font-medium">Bay ID:</label>
      <select
        className="border p-2 rounded w-full mb-4"
        value={selectedBayId}
        onChange={(e) => setSelectedBayId(e.target.value)}
      >
        <option value="">-- Select Bay --</option>
        {visitBayList.map((item) => (
          <option key={item.BayID} value={item.BayID}>
            Bay {item.BayID}
          </option>
        ))}
      </select>

      {/* Actions */}
      <button
        onClick={handleCheckIn}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Check In (Current Time)
      </button>
    </div>
  );
}
