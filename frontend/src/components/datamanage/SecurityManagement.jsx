import React, { useState } from "react";
import { toast } from "react-toastify";

const SecurityTimingManagement = ({ visitId, seId }) => {
  const [estimatedArrival, setEstimatedArrival] = useState("");
  const [actualArrival, setActualArrival] = useState("");
  const [estimatedLeave, setEstimatedLeave] = useState("");
  const [actualLeave, setActualLeave] = useState("");
  const [loading, setLoading] = useState(false);

  const setCurrentTime = (setter) => {
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    setter(now);
  };

  const saveSecurityTiming = () => {
    if (!visitId || !seId) {
      toast.warning("VisitID and Security Officer ID are required!");
      return;
    }
    setLoading(true);
    fetch("http://localhost:5000/api/securitytiming", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitId,
        seId,
        estimatedArrival,
        actualArrival,
        estimatedLeave,
        actualLeave,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success(data.message || "Security timing saved");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error saving security timing:", err);
        setLoading(false);
      });
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-bold text-main-red mb-4">Security Timing Management</h2>

      {/* Arrival */}
      <div className="mb-4">
        <label className="font-semibold">Estimated Arrival:</label>
        <input
          type="datetime-local"
          value={estimatedArrival}
          onChange={(e) => setEstimatedArrival(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />

        <label className="font-semibold">Actual Arrival:</label>
        <div className="flex gap-2">
          <input
            type="datetime-local"
            value={actualArrival}
            onChange={(e) => setActualArrival(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <button
            type="button"
            onClick={() => setCurrentTime(setActualArrival)}
            className="btn-primary"
          >
            Arrived Now
          </button>
        </div>
      </div>

      {/* Leave */}
      <div className="mb-4">
        <label className="font-semibold">Estimated Leave:</label>
        <input
          type="datetime-local"
          value={estimatedLeave}
          onChange={(e) => setEstimatedLeave(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />

        <label className="font-semibold">Actual Leave:</label>
        <div className="flex gap-2">
          <input
            type="datetime-local"
            value={actualLeave}
            onChange={(e) => setActualLeave(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <button
            type="button"
            onClick={() => setCurrentTime(setActualLeave)}
            className="btn-primary"
          >
            Left Now
          </button>
        </div>
      </div>

      <button
        onClick={saveSecurityTiming}
        className="btn-primary w-full"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Security Timing"}
      </button>
    </div>
  );
};

export default SecurityTimingManagement;
