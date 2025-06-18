import { useState, useEffect } from "react";

const DataManageTable = () => {
  const [activeTab, setActiveTab] = useState("loading");
  const [data, setData] = useState([]);
  const [timestamps, setTimestamps] = useState({});

  // Fetch orders based on tab (loading/unloading)
  useEffect(() => {
    fetch(`http://localhost:5000/api/order?type=${activeTab}`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched order data:", data);
        setData(data);
        setTimestamps({}); // Reset timestamps for new data
      })
      .catch((err) => {
        console.error("Failed to fetch orders:", err);
      });
  }, [activeTab]);

  const handleArrival = (id) => {
    const currentTime = new Date().toLocaleTimeString();
    setTimestamps((prev) => ({
      ...prev,
      [id]: { arrival: currentTime, exit: "" },
    }));
  };

  const handleExit = (id) => {
    const currentTime = new Date().toLocaleTimeString();
    setTimestamps((prev) => ({
      ...prev,
      [id]: { ...prev[id], exit: currentTime },
    }));
  };

  // const data = [
  //   { id: "P2009", quantity: "500KG", vehicle: "LP-2056", org: "JAY KAY", date: "2025/02/09" },
  //   { id: "P2006", quantity: "800KG", vehicle: "LP-2056", org: "MIMN", date: "2025/02/09" },
  //   { id: "P2011", quantity: "300KG", vehicle: "LP-2056", org: "Harischandra", date: "2025/02/09" },
  // ];

  return (
    <div className="bg-[var(--table-row-two)] font-[Noto Sans Sinhala] w-full flex flex-col items-center">
      <div className="w-full flex justify-center h-full">
        <button
          className={`w-1/2 py-3 text-lg font-semibold text-center cursor-pointer ${
            activeTab === "loading" ? "bg-[var(--main-red)] text-[var(--theme-white)]" : "bg-[var(--table-row-two)] text-[var(--darkest-red)]"
          }`}
          onClick={() => setActiveTab("loading")}
        >
          Loading
        </button>
        <button
          className={`w-1/2 py-3 text-lg font-semibold text-center cursor-pointer ${
            activeTab === "unloading" ? "bg-[var(--main-red)] text-[var(--theme-white)]" : "bg-[var(--table-row-two)] text-[var(--darkest-red)]"
          }`}
          onClick={() => setActiveTab("unloading")}
        >
          Unloading
        </button>
      </div>

      <h2 className="text-left text-[var(--darkest-red)] m-5 mt-8 text-2xl font-bold">{activeTab === "loading" ? "පැටවුම්වලට අදාළ විස්තර" : "බැවුම්වලට අදාළ විස්තර"}</h2>

      <table className="w-full mt-6 text-center">
        <thead>
          <tr className="table-header bg-[var(--main-red)] text-[var(--theme-white)]">
            <th className="p-3">Product ID</th>
            <th className="p-3">Quantity</th>
            <th className="p-3">Vehicle Number</th>
            <th className="p-3">Organization</th>
            <th className="p-3">Order Date</th>
            <th className="p-3">✔ Arrival</th>
            <th className="p-3">Arrival Time</th>
            <th className="p-3">✔ Exit</th>
            <th className="p-3">Exit Time</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.ItemCode} className={index % 2 === 0 ? "bg-[var(--table-row-two)]" : "bg-[var(--table-row-one)]"}>
              <td className="p-3">{item.ItemCode}</td>
              <td className="p-3">{item.QtyOrdered}</td>
              <td className="p-3">{item.VehicleNo}</td>
              <td className="p-3">{item.CustomerName}</td>
              <td className="p-3">{new Date(item.Date).toISOString().slice(0, 10)}</td>
              <td className="p-3">
                <input type="checkbox" className="accent-[var(--main-red)] cursor-pointer" onChange={() => handleArrival(item.ItemCode)} checked={!!timestamps[item.ItemCode]?.arrival} />
              </td>
              <td className="p-3">{timestamps[item.ItemCode]?.arrival || "-"}</td>
              <td className="p-3">
                {timestamps[item.ItemCode]?.arrival && (
                  <input type="checkbox" className="accent-[var(--main-red)] cursor-pointer" onChange={() => handleExit(item.ItemCode)} checked={!!timestamps[item.ItemCode]?.exit} />
                )}
              </td>
              <td className="p-3">{timestamps[item.ItemCode]?.exit || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataManageTable;