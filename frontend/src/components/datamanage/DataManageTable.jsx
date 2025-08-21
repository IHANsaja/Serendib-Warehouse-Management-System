import React, { useState, useEffect } from "react";
import { getSriLankaTime } from "../../utils/timeUtils";
import { toast } from "react-toastify";

const DataManageTable = ({ role }) => {
  const [activeTab, setActiveTab] = useState("loading");
  const [data, setData] = useState([]);
  const [timestamps, setTimestamps] = useState({});
  const [user, setUser] = useState(null);
  const [selectedBays, setSelectedBays] = useState({});
  const [availableBays, setAvailableBays] = useState([]);
  const [bayAvailability, setBayAvailability] = useState({
    loading: { allOccupied: false, totalBays: 3, occupiedBays: 0, availableBays: 3 },
    unloading: { allOccupied: false, totalBays: 3, occupiedBays: 0, availableBays: 3 }
  });

  // Fetch session data
  useEffect(() => {
    fetch("http://localhost:5000/api/auth/session", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        console.log("Session user:", data.user);
      })
      .catch((err) => console.error("Session fetch failed:", err));
  }, []);

  // Fetch available bays
  useEffect(() => {
    const fetchBays = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/bay/bays?type=${activeTab === 'loading' ? 'Loading' : 'Unloading'}`, {
          credentials: "include",
        });
        
        if (response.ok) {
          const bays = await response.json();
          console.log("Available bays for", activeTab, ":", bays);
          setAvailableBays(bays);
        } else {
          console.error("Failed to fetch bays:", response.status);
        }
      } catch (error) {
        console.error("Error fetching bays:", error);
      }
    };

    if (role === "Executive Officer") {
      fetchBays();
    }
  }, [activeTab, role]);

  // Fetch bay availability status
  useEffect(() => {
    const fetchBayAvailability = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/bay/availability', {
          credentials: "include",
        });
        
        if (response.ok) {
          const availability = await response.json();
          setBayAvailability(availability);
        }
      } catch (error) {
        console.error("Error fetching bay availability:", error);
      }
    };

    fetchBayAvailability();
    
    // Set up interval to check bay availability every 10 seconds
    const interval = setInterval(fetchBayAvailability, 10000);
    return () => clearInterval(interval);
  }, []);

  // Function to fetch truck visits data
  const fetchTruckVisits = async () => {
    try {
      const endpoint = role === "Security Officer" 
        ? "/api/bay/truck-visits/security"
        : "/api/bay/truck-visits/executive";
      
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const truckVisits = await response.json();
      console.log("Fetched truck visits:", truckVisits);
      
      // Filter by type (loading/unloading)
      const filteredData = truckVisits.filter(visit => 
        visit.Type.toLowerCase() === activeTab
      );
      
      console.log("Filtered data for", activeTab, ":", filteredData);
      
      setData(filteredData);
      
      // Update selected bays based on current data
      const baySelections = {};
      filteredData.forEach(visit => {
        if (visit.BayID) {
          baySelections[visit.VisitID] = visit.BayID;
        }
      });
      console.log("Bay selections:", baySelections);
      setSelectedBays(baySelections);
    } catch (err) {
      console.error("Failed to fetch truck visits:", err);
      setData([]);
    }
  };

  // Fetch truck visits based on role
  useEffect(() => {
    fetchTruckVisits();
  }, [activeTab, role]);

  const isSecurity = role === "Security Officer";
  const isExecutive = role === "Executive Officer";

  const handleBaySelection = async (visitId, bayId) => {
    console.log('Bay selection triggered:', { visitId, bayId });
    if (!bayId) return; // Don't proceed if no bay selected
    
    try {
      console.log('Sending bay assignment request:', {
        bayId: parseInt(bayId),
        eoId: user?.employeeId || 1002
      });
      
      const response = await fetch(`http://localhost:5000/api/bay/truck-visit/${visitId}/assign-bay`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          bayId: parseInt(bayId),
          eoId: user?.employeeId || 1002
        }),
      });
      
      if (response.ok) {
        console.log("Bay assigned successfully");
        setSelectedBays(prev => ({
          ...prev,
          [visitId]: bayId
        }));
        // Refresh data to show updated bay assignment
        await fetchTruckVisits();
        toast.success("Bay assigned successfully!");
      } else {
        const errorData = await response.json();
        console.error("Failed to assign bay:", errorData);
        toast.error("Failed to assign bay: " + (errorData.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error assigning bay:", error);
      toast.error("Error assigning bay: " + error.message);
    }
  };

  const updateTruckArrival = async (visitId) => {
    const currentTime = getSriLankaTime();
    
    try {
      const response = await fetch(`http://localhost:5000/api/bay/truck-visit/${visitId}/arrival`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          actualArrivalTime: currentTime,
          seId: user?.employeeId || 1003
        }),
      });
      
      if (response.ok) {
        console.log("Truck arrival time updated successfully");
        setTimestamps(prev => ({
          ...prev,
          [visitId]: { ...prev[visitId], arrival: currentTime }
        }));
        // Refresh data to show updated state
        await fetchTruckVisits();
        toast.success("Truck arrival time recorded successfully!");
      } else {
        console.error("Failed to update truck arrival time");
        toast.error("Failed to record truck arrival time");
      }
    } catch (error) {
      console.error("Error updating truck arrival:", error);
              toast.error("Error recording truck arrival: " + error.message);
    }
  };

  const updateTruckLeave = async (visitId) => {
    const currentTime = getSriLankaTime();
    
    try {
      const response = await fetch(`http://localhost:5000/api/bay/truck-visit/${visitId}/leave`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          actualLeaveTime: currentTime,
          seId: user?.employeeId || 1003
        }),
      });
      
      if (response.ok) {
        console.log("Truck leave time updated successfully");
        setTimestamps(prev => ({
          ...prev,
          [visitId]: { ...prev[visitId], leave: currentTime }
        }));
        // Refresh data to show updated state
        await fetchTruckVisits();
        toast.success("Truck leave time recorded successfully!");
      } else {
        console.error("Failed to update truck leave time");
        toast.error("Failed to record truck leave time");
      }
    } catch (error) {
      console.error("Error updating truck leave:", error);
              toast.error("Error recording truck leave: " + error.message);
    }
  };

  const updateBayInTime = async (visitId) => {
    const currentTime = getSriLankaTime();
    
    try {
      const response = await fetch(`http://localhost:5000/api/bay/truck-visit/${visitId}/bay-in`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          actualBayInTime: currentTime,
          eoId: user?.employeeId || 1002
        }),
      });
      
      if (response.ok) {
        console.log("Bay-in time updated successfully");
        setTimestamps(prev => ({
          ...prev,
          [visitId]: { ...prev[visitId], bayIn: currentTime }
        }));
        // Refresh data to show updated state
        await fetchTruckVisits();
        toast.success("Bay-in time recorded successfully!");
      } else {
        console.error("Failed to update bay-in time");
        toast.error("Failed to record bay-in time");
      }
    } catch (error) {
      console.error("Error updating bay-in time:", error);
              toast.error("Error recording bay-in time: " + error.message);
    }
  };

  const updateBayOutTime = async (visitId) => {
    const currentTime = getSriLankaTime();
    
    try {
      const response = await fetch(`http://localhost:5000/api/bay/truck-visit/${visitId}/bay-out`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          actualBayOutTime: currentTime,
          eoId: user?.employeeId || 1002
        }),
      });
      
      if (response.ok) {
        console.log("Bay-out time updated successfully");
        setTimestamps(prev => ({
          ...prev,
          [visitId]: { ...prev[visitId], bayOut: currentTime }
        }));
        // Refresh data to show updated state
        await fetchTruckVisits();
        toast.success("Bay-out time recorded successfully!");
      } else {
        console.error("Failed to update bay-out time");
        toast.error("Failed to record bay-out time");
      }
    } catch (error) {
      console.error("Error updating bay-out time:", error);
              toast.error("Error recording bay-out time: " + error.message);
    }
  };

  return (
    <div className="bg-[var(--table-row-two)] font-[Noto Sans Sinhala] w-full flex flex-col items-center">
      <div className="w-full flex justify-center h-full">
        <button
          className={`w-1/2 py-3 text-lg font-semibold text-center cursor-pointer ${
            activeTab === "loading"
              ? "bg-[var(--main-red)] text-[var(--theme-white)]"
              : "bg-[var(--table-row-two)] text-[var(--darkest-red)]"
          }`}
          onClick={() => setActiveTab("loading")}
        >
          Loading
        </button>
        <button
          className={`w-1/2 py-3 text-lg font-semibold text-center cursor-pointer ${
            activeTab === "unloading"
              ? "bg-[var(--main-red)] text-[var(--theme-white)]"
              : "bg-[var(--table-row-two)] text-[var(--darkest-red)]"
          }`}
          onClick={() => setActiveTab("unloading")}
        >
          Unloading
        </button>
      </div>

      <h2 className="text-left text-[var(--darkest-red)] m-5 mt-8 text-2xl font-bold">
        {activeTab === "loading"
          ? "පැටවුම්වලට අදාළ විස්තර"
          : "බැවුම්වලට අදාළ විස්තර"}
      </h2>
      
      {/* Bay availability warning */}
      {activeTab === "loading" && bayAvailability.loading.allOccupied && (
        <div className="mx-5 mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded">
          ⚠️ <strong>Warning:</strong> All loading bays are currently occupied. No new loading operations can be added until a bay becomes available.
        </div>
      )}
      
      {activeTab === "unloading" && bayAvailability.unloading.allOccupied && (
        <div className="mx-5 mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded">
          ⚠️ <strong>Warning:</strong> All unloading bays are currently occupied. No new unloading operations can be added until a bay becomes available.
        </div>
      )}

      <table className="w-full mt-6 text-center">
        <thead>
          <tr className="table-header bg-[var(--main-red)] text-[var(--theme-white)]">
            <th className="p-3">Item Code</th>
            <th className="p-3">Item</th>
            <th className="p-3">Quantity</th>
            <th className="p-3">Vehicle Number</th>
            <th className="p-3">Driver</th>
            <th className="p-3">Company</th>
            <th className="p-3">Estimated Arrival</th>
            <th className="p-3">Estimated Leave</th>

            {isSecurity && (
              <>
                <th className="p-3">✔ Arrival</th>
                <th className="p-3">Actual Arrival</th>
                <th className="p-3">✔ Leave</th>
                <th className="p-3">Actual Leave</th>
              </>
            )}
            
            {isExecutive && (
              <>
                <th className="p-3">Bay Assignment</th>
                <th className="p-3">Estimated Bay-In</th>
                <th className="p-3">Estimated Bay-Out</th>
                <th className="p-3">✔ Bay-In</th>
                <th className="p-3">Actual Bay-In</th>
                <th className="p-3">✔ Bay-Out</th>
                <th className="p-3">Actual Bay-Out</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) && data.length > 0 ? (
            data.map((visit, index) => (
              <tr
                key={visit.VisitID}
                className={
                  index % 2 === 0
                    ? "bg-[var(--table-row-two)]"
                    : "bg-[var(--table-row-one)]"
                }
              >
                <td className="p-3">{visit.ItemCode}</td>
                <td className="p-3">{visit.Item}</td>
                <td className="p-3">{visit.Quantity}</td>
                <td className="p-3">{visit.VehicleNumber}</td>
                <td className="p-3">{visit.DriverName}</td>
                <td className="p-3">{visit.CompanyName}</td>
                <td className="p-3">
                  {new Date(visit.EstimatedArrivalTime).toLocaleString('en-US', {
                    hour12: false,
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
                <td className="p-3">
                  {new Date(visit.EstimatedLeaveTime).toLocaleString('en-US', {
                    hour12: false,
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>

                {isSecurity && (
                  <>
                    <td className="p-3">
                      <input
                        type="checkbox"
                        className="accent-[var(--main-red)] cursor-pointer"
                        onChange={() => updateTruckArrival(visit.VisitID)}
                        checked={!!timestamps[visit.VisitID]?.arrival}
                        disabled={!!visit.ActualArrivalTime}
                      />
                    </td>
                    <td className="p-3">
                      {visit.ActualArrivalTime ? 
                        new Date(visit.ActualArrivalTime).toLocaleString('en-US', {
                          hour12: false,
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 
                        timestamps[visit.VisitID]?.arrival || "-"
                      }
                    </td>
                    <td className="p-3">
                      {visit.ActualArrivalTime && !visit.ActualLeaveTime && (
                        <input
                          type="checkbox"
                          className="accent-[var(--main-red)] cursor-pointer"
                          onChange={() => updateTruckLeave(visit.VisitID)}
                          checked={!!timestamps[visit.VisitID]?.leave}
                        />
                      )}
                    </td>
                    <td className="p-3">
                      {visit.ActualLeaveTime ? 
                        new Date(visit.ActualLeaveTime).toLocaleString('en-US', {
                          hour12: false,
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 
                        timestamps[visit.VisitID]?.leave || "-"
                      }
                    </td>
                  </>
                )}

                {isExecutive && (
                  <>
                    <td className="p-3">
                      <select 
                        name="baynumber" 
                        id="baynumber" 
                        onChange={(e) => handleBaySelection(visit.VisitID, e.target.value)} 
                        value={selectedBays[visit.VisitID] || ""}
                        disabled={!!visit.ActualBayInTime} // Only disable if bay-in has already been recorded
                      >
                        <option value="">Select Bay</option>
                        {availableBays.map(bay => (
                          <option key={bay.BayID} value={bay.BayID}>
                            {bay.BayNumber} - {bay.LocationDescription}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3">
                      {visit.EstimatedBayInTime ? 
                        new Date(visit.EstimatedBayInTime).toLocaleString('en-US', {
                          hour12: false,
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : "-"
                      }
                    </td>
                    <td className="p-3">
                      {visit.EstimatedBayOutTime ? 
                        new Date(visit.EstimatedBayOutTime).toLocaleString('en-US', {
                          hour12: false,
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : "-"
                      }
                    </td>
                    <td className="p-3">
                      <input
                        type="checkbox"
                        className="accent-[var(--main-red)] cursor-pointer"
                        onChange={() => updateBayInTime(visit.VisitID)}
                        checked={!!timestamps[visit.VisitID]?.bayIn}
                        disabled={!!visit.ActualBayInTime || !visit.BayID}
                      />
                    </td>
                    <td className="p-3">
                      {visit.ActualBayInTime ? 
                        new Date(visit.ActualBayInTime).toLocaleString('en-US', {
                          hour12: false,
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 
                        timestamps[visit.VisitID]?.bayIn || "-"
                      }
                    </td>
                    <td className="p-3">
                      {(visit.ActualBayInTime || timestamps[visit.VisitID]?.bayIn) && !visit.ActualBayOutTime && (
                        <input
                          type="checkbox"
                          className="accent-[var(--main-red)] cursor-pointer"
                          onChange={() => updateBayOutTime(visit.VisitID)}
                          checked={!!timestamps[visit.VisitID]?.bayOut}
                        />
                      )}
                    </td>
                    <td className="p-3">
                      {visit.ActualBayOutTime ? 
                        new Date(visit.ActualBayOutTime).toLocaleString('en-US', {
                          hour12: false,
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 
                        timestamps[visit.VisitID]?.bayOut || "-"
                      }
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={isSecurity ? 12 : isExecutive ? 19 : 8}
                className="p-4 text-center text-red-500"
              >
                දත්ත ලබා ගත නොහැක / No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataManageTable;
