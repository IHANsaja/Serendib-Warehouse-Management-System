import React, { useState, useEffect } from "react";

const VisitTable = () => {
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/reports", { credentials: "include" })
      .then(res => res.json())
      .then(data => setVisits(data))
      .catch(err => console.error("Error fetching visits:", err));
  }, []);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Recent Visits</h3>
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Visit ID</th>
            <th className="border p-2">Company Name</th>
          </tr>
        </thead>
        <tbody>
          {visits.map(v => (
            <tr key={v.VisitID}>
              <td className="border p-2">{v.VisitID}</td>
              <td className="border p-2">{v.CompanyName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VisitTable;